'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ManagerSidebar } from '../../../components/(Manager)/Dashboard/ManagerSidebar';
import { ManagerApprovalsUI, ApprovalRequest } from '../../../components/(Manager)/Approvals/ManagerApprovals';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ApprovalsPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'SUCCESS' | 'ERROR' } | null>(null);

  // Filter States
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const fetchRequests = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5076/api/Leave/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      setFetchError(String(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Computed Filtered List
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesType = typeFilter === 'ALL' || req.type.toUpperCase().includes(typeFilter);
      const matchesPriority = priorityFilter === 'ALL' || req.priority === priorityFilter;
      return matchesType && matchesPriority;
    });
  }, [requests, typeFilter, priorityFilter]);

  const showToast = (message: string, type: 'SUCCESS' | 'ERROR') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async (requestId: number, actionType: 'APPROVED' | 'REJECTED') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5076/api/Leave/manager-action', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ RequestId: requestId, Status: actionType }),
      });

      if (response.ok) {
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        showToast(
          actionType === 'APPROVED' ? 'FORWARDED TO HR' : 'REQUEST REJECTED',
          'SUCCESS'
        );
      } else {
        showToast('TRANSACTION FAILED', 'ERROR');
      }
    } catch {
      showToast('NETWORK ERROR', 'ERROR');
    }
  };

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase relative">
      <ManagerSidebar />

      {toast && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl border backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 shadow-2xl ${
          toast.type === 'SUCCESS' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'SUCCESS' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className="text-[10px] font-black tracking-[0.3em]">{toast.message}</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center bg-[#020617]">
          <div className="text-indigo-500 font-black animate-pulse tracking-[0.5em] text-[10px]">SYNCING QUEUE...</div>
        </div>
      ) : fetchError ? (
        <div className="flex-1 flex items-center justify-center bg-[#020617]">
          <div className="flex flex-col items-center gap-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <button onClick={fetchRequests} className="px-6 py-3 bg-indigo-600/10 border border-indigo-600/30 rounded-2xl text-[10px] font-black text-indigo-400 tracking-widest"><RefreshCw className="w-4 h-4 inline mr-2" /> RETRY</button>
          </div>
        </div>
      ) : (
        <ManagerApprovalsUI 
          requests={filteredRequests} 
          onAction={handleAction}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />
      )}
    </main>
  );
}