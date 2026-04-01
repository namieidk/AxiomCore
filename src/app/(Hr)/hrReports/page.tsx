'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { HRReportsUI } from '../../../components/(Hr)/Report/Report';

export interface Report {
  id: string;
  reportNumber: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  employeeId: string;
  department: string;
  downloadUrl: string;
}

export interface LeaveRequest {
  id: number;
  employeeId: string;
  name: string;
  type: string;
  date: string;
  reason: string;
  priority: string;
}

export interface SummaryStats {
  total: number;
  approved: number;
  pending: number;
  byType: { type: string; count: number }[];
}

export default function HRReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveLoading, setLeaveLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [hrName, setHrName] = useState('');

  // ── Fetch Reports & Summary ──
  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const parsed = stored ? JSON.parse(stored) : {};
    const employeeId = parsed.employeeId ?? '';
    setHrName(parsed.name ?? 'HR');

    if (!employeeId) { setIsLoading(false); return; }

    const headers: HeadersInit = {
      'X-Employee-Id': employeeId,
      'Authorization': `Bearer ${token}`,
    };

    const fetchReports = async (silent = false) => {
      try {
        if (!silent) setIsLoading(true);
        const [repRes, sumRes] = await Promise.all([
          fetch('http://localhost:5076/api/Reports/my-reports', { headers }),
          fetch('http://localhost:5076/api/Reports/summary', { headers }),
        ]);
        if (repRes.ok) setReports(await repRes.json());
        if (sumRes.ok) setSummary(await sumRes.json());
      } catch (err) {
        console.error('HR reports fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports(false);
    const interval = setInterval(() => fetchReports(true), 10000);
    return () => clearInterval(interval);
  }, []);

  // ── Fetch Leave Queue ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchLeave = async (silent = false) => {
      try {
        if (!silent) setLeaveLoading(true);
        const res = await fetch('http://localhost:5076/api/Leave/hr-pending', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) setLeaveRequests(await res.json());
      } catch (err) {
        console.error('HR leave fetch error:', err);
      } finally {
        setLeaveLoading(false);
      }
    };

    fetchLeave(false);
    const interval = setInterval(() => fetchLeave(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLeaveAction = async (requestId: number, action: 'APPROVED' | 'REJECTED') => {
    try {
      setActionId(requestId);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5076/api/Leave/hr-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, status: action }),
      });
      if (res.ok) setLeaveRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (err) {
      console.error('HR leave action error:', err);
    } finally {
      setActionId(null);
    }
  };

  const exportCSV = () => {
    if (reports.length === 0) return;
    const csv = [
      ['ReportNumber', 'Name', 'Type', 'Status', 'EmployeeId', 'Department', 'CreatedAt'].join(','),
      ...reports.map(r => [
        r.reportNumber, `"${r.name}"`, r.type, r.status,
        r.employeeId, r.department, new Date(r.createdAt).toLocaleString(),
      ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `hr-audit-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <HRReportsUI 
      reports={reports}
      summary={summary}
      isLoading={isLoading}
      leaveRequests={leaveRequests}
      leaveLoading={leaveLoading}
      actionId={actionId}
      hrName={hrName}
      onLeaveAction={handleLeaveAction}
      onExportCSV={exportCSV}
    />
  );
}