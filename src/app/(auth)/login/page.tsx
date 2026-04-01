// src/app/(auth)/login/page.tsx
import { LoginBackground, LoginHeader } from '../../../components/Login/LoginVisual';
import { LoginForm } from '../../../components/Login/LoginForm';

export default function LoginPage() {
  return (
    <main className="h-screen w-full flex items-center justify-center bg-[#020617] text-slate-200 overflow-hidden font-sans relative">
      <LoginBackground />

      <div className="w-full max-w-[420px] p-8 flex flex-col items-center bg-slate-900/40 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-2xl z-10 mx-4">
        <LoginHeader />
        
        <LoginForm />

        {/* System Status Footer */}
        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">System Live // v2.6.0</span>
          </div>
          <p className="text-[9px] text-slate-600 max-w-[180px]">Unauthorized access is recorded via Axiom Security Protocols.</p>
        </div>
      </div>
    </main>
  );
}