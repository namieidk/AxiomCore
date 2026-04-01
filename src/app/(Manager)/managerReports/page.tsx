'use client';

import React, { useState, useEffect } from 'react';
import ManagerReportsView from '../../../components/(Manager)/Reports/Reports';

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

export interface KpiMetric {
  label: string;
  value: string;
  trend: string;
  isPositive: boolean;
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

export default function ManagerReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [managerName, setManagerName] = useState('');
  const [department, setDepartment] = useState('');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveLoading, setLeaveLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [kpis, setKpis] = useState<KpiMetric[]>([
    { label: 'TOTAL REPORTS', value: '—', trend: 'loading', isPositive: true },
    { label: 'APPROVED', value: '—', trend: 'loading', isPositive: true },
    { label: 'PENDING REVIEW', value: '—', trend: 'loading', isPositive: true },
    { label: 'THIS MONTH', value: '—', trend: 'loading', isPositive: true },
  ]);

  // Fetch Reports and KPIs
  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const parsed = stored ? JSON.parse(stored) : {};
    const employeeId = parsed.employeeId ?? '';
    setManagerName(parsed.name ?? 'Manager');
    setDepartment(parsed.department ?? '');

    if (!employeeId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async (silent = false) => {
      try {
        if (!silent) setIsLoading(true);
        const res = await fetch('http://localhost:5076/api/Reports/my-reports', {
          headers: { 'X-Employee-Id': employeeId, 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) return;

        const data: Report[] = await res.json();
        setReports(data);

        const now = new Date();
        const thisMonthCount = data.filter(r => {
          const d = new Date(r.createdAt);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;

        const approved = data.filter(r => r.status?.toUpperCase() === 'APPROVED').length;
        const pending = data.filter(r => r.status?.toUpperCase() === 'PENDING').length;

        setKpis([
          { label: 'TOTAL REPORTS', value: data.length.toString(), trend: 'ALL TIME', isPositive: true },
          { label: 'APPROVED', value: approved.toString(), trend: 'VERIFIED', isPositive: true },
          { label: 'PENDING REVIEW', value: pending.toString(), trend: pending > 0 ? 'NEEDS ACTION' : 'CLEAR', isPositive: pending === 0 },
          { label: 'THIS MONTH', value: thisMonthCount.toString(), trend: `${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`, isPositive: true },
        ]);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(() => fetchData(true), 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Leave Requests
  useEffect(() => {
    const fetchLeave = async (silent = false) => {
      try {
        if (!silent) setLeaveLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5076/api/Leave/pending', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) setLeaveRequests(await res.json());
      } catch (err) {
        console.error('Leave fetch error:', err);
      } finally {
        setLeaveLoading(false);
      }
    };

    fetchLeave();
    const interval = setInterval(() => fetchLeave(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLeaveAction = async (requestId: number, action: 'APPROVED' | 'REJECTED') => {
    try {
      setActionId(requestId);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5076/api/Leave/manager-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ requestId, status: action }),
      });
      if (res.ok) setLeaveRequests(prev => prev.filter(r => r.id !== requestId));
    } finally {
      setActionId(null);
    }
  };

  const handleAuditDownload = () => {
    if (reports.length === 0) return;
    const csv = [
      ['ReportNumber', 'Name', 'Type', 'Status', 'EmployeeId', 'Department', 'CreatedAt'].join(','),
      ...reports.map(r => [r.reportNumber, `"${r.name}"`, r.type, r.status, r.employeeId, r.department, new Date(r.createdAt).toLocaleString()].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `audit-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ManagerReportsView
      reports={reports}
      isLoading={isLoading}
      managerName={managerName}
      department={department}
      leaveRequests={leaveRequests}
      leaveLoading={leaveLoading}
      actionId={actionId}
      kpis={kpis}
      onLeaveAction={handleLeaveAction}
      onAuditDownload={handleAuditDownload}
    />
  );
}