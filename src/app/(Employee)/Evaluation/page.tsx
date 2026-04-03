'use client';

import React, { useState, useEffect, use } from 'react';
import { EvaluationView, Agent } from '../../../components/(Employee)/Evaluation/Evaluation';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAutoLogout } from '../../../hooks/useAutoLogout';
interface LocalUser {
  employeeId: string;
  name: string;
  role: string;
  department: string;
}

export interface EnhancedAgent extends Agent {
  alreadyEvaluated?: boolean;
  lastEvaluationDate?: string;
}

export default function EvaluationPage() {
  useAutoLogout();
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [targetAgent, setTargetAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<EnhancedAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { setHasMounted(true); }, []);

  useEffect(() => {
    if (!selectedType || !hasMounted) return;

    const fetchAgents = async () => {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setLoading(false);
        return;
      }
      
      const user: LocalUser = JSON.parse(userStr);
      try {
        const params = new URLSearchParams({
          department: user.department || '',
          excludeId:  user.employeeId || '',
          viewerRole: user.role       || '',
          mode:       selectedType,
        });

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Evaluation/agents-with-status?${params}`);
        if (res.ok) {
          const data = await res.json();
          setAgents(data);
        }
      } catch (e) {
        console.error("Fetch Error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [selectedType, hasMounted]);

  const handleSubmit = async (avgScore: number, finalComment: string) => {
    if (!targetAgent || !selectedType) return;
    setIsSubmitting(true);
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    const user: LocalUser = JSON.parse(userStr);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Evaluation/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetEmployeeId: targetAgent.id,
          evaluatorId:      user.employeeId,
          score:            avgScore,
          comments:         finalComment,
          mode:             selectedType,
        }),
      });

      if (res.ok) {
        setShowToast(true);
        // Delay to allow user to see success state before hard refresh
        setTimeout(() => {
          setShowToast(false);
          setSelectedType(null);
          setTargetAgent(null);
          window.location.reload();
        }, 3000);
      } else {
        alert("CRITICAL: DATA REJECTED BY SERVER");
      }
    } catch (e) {
      console.error("Submission error:", e);
      alert("COMMUNICATION ERROR: SYSTEM OFFLINE");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasMounted) return (
    <div className="h-screen w-full bg-[#020617] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <>
      {/* RESPONSIVE TOAST */}
      {showToast && (
        <div className="fixed top-6 lg:top-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-indigo-600 text-white px-6 lg:px-10 py-4 lg:py-5 rounded-[1.5rem] lg:rounded-[2rem] shadow-2xl flex items-center gap-4 lg:gap-5 border border-indigo-400/30 backdrop-blur-md">
            <div className="bg-white/10 p-2 rounded-full">
              <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6 animate-pulse" />
            </div>
            <div className="uppercase italic font-black">
              <p className="text-[10px] lg:text-[11px] tracking-[0.2em] lg:tracking-widest">Audit Finalized</p>
              <p className="text-[7px] lg:text-[8px] opacity-70 tracking-widest mt-0.5">Monthly Quota Updated • Syncing...</p>
            </div>
          </div>
        </div>
      )}

      <EvaluationView
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        agents={agents}
        targetAgent={targetAgent}
        setTargetAgent={setTargetAgent}
        loading={loading}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting || showToast}
      />
    </>
  );
}