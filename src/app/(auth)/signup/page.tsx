'use client';

import { LoginBackground } from '../../../components/Login/LoginVisual'; 
import { SignupHeader } from '../../../components/Signup/SignupHeader';
import { AdminSignupForm } from '../../../components/Signup/AdminSignupForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#020617] text-slate-200 font-sans relative py-10 px-4">
      <LoginBackground />

      <div className="w-full max-w-[480px] p-6 md:p-10 flex flex-col items-center bg-slate-900/60 rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-3xl z-10">
        <SignupHeader />
        
        <AdminSignupForm />

        <div className="mt-6 md:mt-8 pt-6 border-t border-white/5 w-full text-center">
          <p className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Already have clearance?{' '}
            <Link href="/login" className="text-indigo-500 hover:text-emerald-300 transition-colors">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}