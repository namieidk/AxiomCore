'use client';

import React from 'react';
import { UserPlus, UserRoundCog, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export interface UserAccount {
  id: number;
  name: string;
  employeeId: string;
  role: string;
  department?: string; 
  status?: string;     
}

interface Props {
  accounts: UserAccount[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onCreateClick: () => void;
  onEditClick: (account: UserAccount) => void;
  onRevokeClick: (id: number) => void;
  onReactivateClick: (id: number) => void;
}

export const AccountList = ({ 
  accounts, loading, currentPage, totalPages, totalItems, onPageChange,
  roleFilter, setRoleFilter, statusFilter, setStatusFilter,
  onCreateClick, onEditClick, onRevokeClick, onReactivateClick 
}: Props) => {
  return (
    <section className="flex-1 flex flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617] to-[#020617] italic font-black scrollbar-hide">
      
      {/* RESPONSIVE HEADER: Stacks on mobile, aligns bottom on XL screens */}
      <header className="px-6 lg:px-12 py-8 lg:py-10 border-b border-white/5 flex flex-col xl:flex-row xl:items-end justify-between gap-6 lg:gap-8 backdrop-blur-md sticky top-0 z-20 bg-[#020617]/80">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 mb-2">
            <UserRoundCog className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={3} />
            <span className="text-[8px] lg:text-[10px] uppercase tracking-[0.4em]">Axiom Admin Console</span>
          </div>
          <h1 className="text-2xl lg:text-4xl text-white tracking-tighter uppercase leading-none">
            Identity <span className="text-indigo-600">Database</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:gap-4">
          {/* Role Filter */}
          <div className="flex-1 sm:flex-none flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 min-w-[140px]">
            <Filter className="w-3 h-3 text-indigo-400 shrink-0" />
            <select 
              value={roleFilter} 
              onChange={(e) => { setRoleFilter(e.target.value); onPageChange(1); }}
              className="bg-transparent text-[9px] text-white outline-none cursor-pointer tracking-widest uppercase font-black w-full"
            >
              <option className="bg-[#020617]" value="ALL">ALL ROLES</option>
              <option className="bg-[#020617]" value="ADMIN">ADMIN</option>
              <option className="bg-[#020617]" value="MANAGER">MANAGER</option>
              <option className="bg-[#020617]" value="EMPLOYEE">EMPLOYEE</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex-1 sm:flex-none flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 min-w-[140px]">
            <select 
              value={statusFilter} 
              onChange={(e) => { setStatusFilter(e.target.value); onPageChange(1); }}
              className="bg-transparent text-[9px] text-white outline-none cursor-pointer tracking-widest uppercase font-black w-full"
            >
              <option className="bg-[#020617]" value="ALL">ALL STATUS</option>
              <option className="bg-[#020617]" value="ACTIVE">ACTIVE</option>
              <option className="bg-[#020617]" value="REVOKED">REVOKED</option>
            </select>
          </div>

          <button 
            onClick={onCreateClick} 
            className="w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-4 bg-indigo-600 text-white rounded-2xl text-[9px] lg:text-[10px] tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> PROVISION
          </button>
        </div>
      </header>

      <div className="p-4 lg:p-12 max-w-[1600px] w-full mx-auto space-y-6">
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl lg:rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
          
          {/* SCROLL CONTAINER: Allows horizontal swipe on mobile */}
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-[9px] lg:text-[10px] text-slate-500 tracking-[0.3em]">
                  <th className="px-6 lg:px-10 py-6 text-indigo-500/50 uppercase">IDENTIFIER / NAME</th>
                  <th className="px-6 py-6 text-center text-indigo-500/50 uppercase">ACCESS ROLE</th>
                  <th className="px-6 py-6 text-center text-indigo-500/50 uppercase">SYSTEM STATUS</th>
                  <th className="px-6 lg:px-10 py-6 text-right text-indigo-500/50 uppercase">COMMAND</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {!loading && accounts.length > 0 ? accounts.map((acc) => {
                  const isActive = (acc.status || 'ACTIVE').toUpperCase() === 'ACTIVE';
                  return (
                    <tr key={acc.id} className={`transition-colors group ${isActive ? 'hover:bg-indigo-600/5' : 'bg-red-950/10 opacity-70'}`}>
                      <td className="px-6 lg:px-10 py-5 lg:py-6">
                        <p className="text-[11px] lg:text-xs text-white group-hover:text-indigo-400 transition-colors uppercase truncate max-w-[200px]">{acc.name}</p>
                        <p className="text-[8px] text-slate-600 tracking-widest uppercase font-mono">{acc.employeeId}</p>
                      </td>
                      <td className="px-6 py-5 lg:py-6 text-center">
                        <span className="text-[9px] lg:text-[10px] px-3 py-1 rounded-lg border text-indigo-400 border-indigo-400/20 bg-indigo-400/5 inline-block min-w-[80px]">
                          {acc.role}
                        </span>
                      </td>
                      <td className="px-6 py-5 lg:py-6 text-center">
                        <span className={`text-[8px] lg:text-[9px] tracking-widest flex items-center justify-center gap-1.5 ${isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                          <span className="text-[12px]">●</span> {isActive ? 'ACTIVE' : 'REVOKED'}
                        </span>
                      </td>
                      <td className="px-6 lg:px-10 py-5 lg:py-6 text-right">
                        <div className="flex items-center justify-end gap-4 lg:gap-6">
                          {isActive && (
                            <button 
                              onClick={() => onEditClick(acc)} 
                              className="text-[9px] text-slate-500 hover:text-white transition-all uppercase whitespace-nowrap"
                            >
                              EDIT
                            </button>
                          )}
                          {isActive ? (
                            <button 
                              onClick={() => onRevokeClick(acc.id)} 
                              className="text-[9px] text-red-500/50 hover:text-red-500 transition-all uppercase whitespace-nowrap"
                            >
                              REVOKE
                            </button>
                          ) : (
                            <button 
                              onClick={() => onReactivateClick(acc.id)} 
                              className="text-[9px] text-emerald-500/50 hover:text-emerald-500 transition-all uppercase whitespace-nowrap"
                            >
                              RESTORE
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={4} className="px-10 py-20 text-center text-slate-600 text-[10px] tracking-widest uppercase italic">
                      {loading ? 'Decrypting Records...' : 'No records found matching filters'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* RESPONSIVE FOOTER: Pagination stacks on very small screens */}
          <footer className="px-6 lg:px-10 py-6 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 italic">
            <p className="text-[9px] text-slate-500 tracking-widest uppercase">
              SHOWING <span className="text-indigo-400">{totalItems}</span> NODES
            </p>
            <div className="flex items-center gap-6">
              <button 
                disabled={currentPage === 1} 
                onClick={() => onPageChange(currentPage - 1)} 
                className="p-2 lg:p-2.5 rounded-xl border border-white/5 text-slate-500 hover:text-indigo-400 disabled:opacity-20 transition-all bg-white/5"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[9px] lg:text-[10px] text-white tracking-widest uppercase">
                PAGE {currentPage} / {totalPages || 1}
              </span>
              <button 
                disabled={currentPage === totalPages || totalPages === 0} 
                onClick={() => onPageChange(currentPage + 1)} 
                className="p-2 lg:p-2.5 rounded-xl border border-white/5 text-slate-500 hover:text-indigo-400 disabled:opacity-20 transition-all bg-white/5"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
};