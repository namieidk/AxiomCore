import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

interface BaseRecord {
  id: string;
  name: string;
}

export interface AttendanceNotification {
  employeeId: string;
  name: string;
  time: string;
  dept: string;
}

interface UseAttendanceSignalRProps<T> {
  department: string;
  role?: 'HR' | 'MANAGER' | 'EMPLOYEE';
  onNewClockIn: (record: T) => void;
  onLateNotification: (notification: AttendanceNotification) => void;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export function useAttendanceSignalR<T extends BaseRecord>({
  department,
  role = 'MANAGER',
  onNewClockIn,
  onLateNotification,
}: UseAttendanceSignalRProps<T>) {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const url = `${apiBaseUrl}/hubs/attendance?department=${encodeURIComponent(department)}&role=${role}`;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(url, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.None)
      .build();

    connection.on('NewClockIn', (record: T) => {
      if (isMounted) onNewClockIn(record);
    });

    connection.on('LateNotification', (notification: AttendanceNotification) => {
      if (isMounted) onLateNotification(notification);
    });

    const startConnection = async () => {
      try {
        await connection.start();
        if (isMounted) {
          setIsConnected(true);
          console.log(`[SignalR] Linked as ${role}`);
        }
      } catch (err) {
        if (isMounted) console.error("[SignalR] Connection Failed:", err);
      }
    };

    startConnection();
    connectionRef.current = connection;

    return () => {
      isMounted = false;
      if (connectionRef.current) {
        const conn = connectionRef.current;
        connectionRef.current = null;
        
        conn.off('NewClockIn');
        conn.off('LateNotification');
        
        if (conn.state !== signalR.HubConnectionState.Disconnected) {
          conn.stop().catch(() => {});
        }
        setIsConnected(false);
      }
    };
  }, [department, role, onNewClockIn, onLateNotification]);

  return { isConnected };
}