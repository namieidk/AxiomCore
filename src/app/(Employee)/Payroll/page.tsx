'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { PayrollView } from '../../../components/(Employee)/Payroll/Payroll';
import { useAutoLogout } from '../../../hooks/useAutoLogout';

export interface PayslipData {
  id: number;
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  payDate: string;
  basicSalary: number;
  nightDiff: number;
  overtime: number;
  allowances: number;
  grossPay: number;
  sssDeduction: number;
  philHealthDeduction: number;
  pagIbigDeduction: number;
  withholdingTax: number;
  totalDeductions: number;
  netPay: number;
  status: string;
  generatedAt: string;
}

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Payroll`;

export default function PayrollPage() {
  useAutoLogout();
  const [history, setHistory]       = useState<PayslipData[]>([]);
  const [activeSlip, setActiveSlip] = useState<PayslipData | null>(null);
  const [loading, setLoading]       = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchPayslips = async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      const user = JSON.parse(userStr);

      try {
        const res = await fetch(`${API_BASE}/payslips?employeeId=${user.employeeId}`);
        if (res.ok) {
          const data: PayslipData[] = await res.json();
          setHistory(data);
          if (data.length > 0) setActiveSlip(data[0]);
        }
      } catch (e) {
        console.error('API Error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchPayslips();
  }, []);

  const totalPages = Math.ceil(history.length / itemsPerPage) || 1;

  const visibleHistory = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return history.slice(start, start + itemsPerPage);
  }, [history, currentPage]);

  // Determine if this payslip is a 1st or 2nd payroll based on period start day
  const isFirstPayroll = useMemo(() => {
    if (!activeSlip) return null;
    const day = new Date(activeSlip.periodStart).getDate();
    return day <= 15;
  }, [activeSlip]);

  if (loading) return <LoadingSpinner />;

  return (
    <PayrollView
      activeSlip={activeSlip}
      visibleHistory={visibleHistory}
      currentPage={currentPage}
      totalPages={totalPages}
      isFirstPayroll={isFirstPayroll}
      onPageChange={setCurrentPage}
      onSelectSlip={setActiveSlip}
    />
  );
}

function LoadingSpinner() {
  return (
    <div className="h-screen w-full bg-[#020617] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-indigo-500 tracking-[0.5em]">SYNCHRONIZING...</p>
      </div>
    </div>
  );
}