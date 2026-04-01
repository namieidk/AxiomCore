'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ApplicantListUI } from '../../../components/(Hr)/Applicants/ApplicantList';

interface Applicant {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  email: string;
  phone: string;
  resumePath: string;
  referenceCode: string;
  status: string;
}

export default function HRApplicantListPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('http://localhost:5076/api/applicants?status=PENDING', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: Failed to fetch`);
      
      const data: Applicant[] = await response.json();
      setApplicants(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (app: Applicant, newStatus: 'APPROVED' | 'REJECTED') => {
    const actionText = newStatus === 'APPROVED' ? 'Approved' : 'Denied';
    
    try {
      const response = await fetch(`http://localhost:5076/api/applicants/${app.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setApplicants(prev => prev.filter(a => a.id !== app.id));
        toast.success(`Application ${actionText}`, {
          description: `${app.firstName} ${app.lastName} moved to ${newStatus.toLowerCase()} list.`,
        });
      } else {
        toast.error("Action Failed");
      }
    } catch (error) {
      toast.error("Connection Error");
    }
  };

  const filteredApplicants = applicants.filter(app => 
    `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.referenceCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ApplicantListUI 
      applicants={filteredApplicants}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      loading={loading}
      errorMsg={errorMsg}
      onRefresh={fetchApplicants}
      onUpdateStatus={handleStatusUpdate}
    />
  );
}