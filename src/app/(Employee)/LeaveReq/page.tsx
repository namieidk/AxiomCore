'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LeaveRequestForm } from '../../../components/(Employee)/LeaveReq/LeaveRequestForm';
import { Sidebar } from '@/src/components/(Employee)/Dashboard/Sidebar';
import { SessionGuard } from '@/src/components/SessionGuard';
import { Calendar, Clock, LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

interface LeaveHistoryItem {
  type: string;
  date: string;
  status: string;
  color: string;
  icon: LucideIcon;
}

interface LeaveHistoryAPIResponse {
  type: string;
  date: string;
  status: string;
}

const API = 'http://localhost:5076/api/leave';

export default function LeaveReqPage() {
  const [credits, setCredits]             = useState<number>(0);
  const [history, setHistory]             = useState<LeaveHistoryItem[]>([]);
  const [requestedDays, setRequestedDays] = useState<number>(0);
  const [dates, setDates]                 = useState({ start: '', end: '' });

  // ✅ Returns employeeId as int — matches Employee.EmployeeId (int) in the DB
  const getEmployeeId = useCallback((): number | null => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const parsed = parseInt(user.employeeId);
      return isNaN(parsed) ? null : parsed;
    } catch {
      return null;
    }
  }, []);

  const fetchCredits = useCallback(async (employeeId: number) => {
    try {
      const res = await fetch(`${API}/credits/${employeeId}`);
      if (res.ok) {
        const data = await res.json();
        setCredits(data.balance ?? 0);
      } else {
        console.error(`Credits fetch failed: ${res.status}`);
      }
    } catch (err) {
      console.error('Credits fetch error:', err);
    }
  }, []);

  const fetchHistory = useCallback(async (employeeId: number) => {
    try {
      const res = await fetch(`${API}/history/${employeeId}`);
      if (res.ok) {
        const data: LeaveHistoryAPIResponse[] = await res.json();
        const mapped: LeaveHistoryItem[] = data.map((item) => {
          const status = item.status?.toUpperCase() ?? 'PENDING';
          return {
            type:   item.type,
            date:   item.date,
            status,
            color:  status === 'APPROVED' ? 'emerald'
                  : status === 'REJECTED' ? 'red'
                  : 'indigo',
            icon:   status === 'PENDING' ? Clock : Calendar,
          };
        });
        setHistory(mapped);
      } else {
        console.error(`History fetch failed: ${res.status}`);
      }
    } catch (err) {
      console.error('History fetch error:', err);
    }
  }, []);

  // ── Initial data load ──────────────────────────────────────────────────
  useEffect(() => {
    const id = getEmployeeId();
    if (!id) return;

    const load = async () => {
      await fetchCredits(id);
      await fetchHistory(id);
    };

    load();
  }, [getEmployeeId, fetchCredits, fetchHistory]);

  // ── Date change handler ────────────────────────────────────────────────
  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(value) < today) {
      toast.error('INVALID DATE: PAST DATES RESTRICTED');
      return;
    }
    const updated = { ...dates, [type]: value };
    setDates(updated);
    if (updated.start && updated.end) {
      const diff =
        Math.ceil(
          (new Date(updated.end).getTime() - new Date(updated.start).getTime()) /
          (1000 * 60 * 60 * 24)
        ) + 1;
      setRequestedDays(diff > 0 ? diff : 0);
    }
  };

  // ── Submit handler ─────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const employeeId = getEmployeeId();
    const formData   = new FormData(e.currentTarget);

    if (!employeeId) {
      toast.error('SESSION EXPIRED — PLEASE LOG IN AGAIN');
      return;
    }
    if (requestedDays <= 0) {
      toast.error('PLEASE SELECT VALID DATES');
      return;
    }

    const body = JSON.stringify({
      employeeId,                           // number — matches int in C# model
      leaveType: formData.get('leaveType'),
      startDate: dates.start,
      endDate:   dates.end,
      reason:    formData.get('reason'),
    });

    const promise = fetch(`${API}/apply`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Server error ${res.status}`);
      }
      return res;
    });

    toast.promise(promise, {
      loading: 'TRANSMITTING REQUEST...',
      success: () => {
        setDates({ start: '', end: '' });
        setRequestedDays(0);
        (e.target as HTMLFormElement).reset();
        fetchCredits(employeeId);
        fetchHistory(employeeId);
        return 'REQUEST TRANSMITTED SUCCESSFULLY';
      },
      error: (err) => err?.message ?? 'FAILED TO TRANSMIT REQUEST',
    });
  };

  return (
    <SessionGuard allowedRoles={['EMPLOYEE']}>
      <main className="h-screen w-full flex bg-[#050510] text-slate-200 overflow-hidden font-sans uppercase italic">
        <Sidebar />
        <LeaveRequestForm
          credits={credits}
          history={history}
          requestedDays={requestedDays}
          dates={dates}
          onDateChange={handleDateChange}
          onSubmit={handleSubmit}
        />
      </main>
    </SessionGuard>
  );
}