// app/debug/page.tsx  ← DELETE AFTER FIXING
'use client';

import { useAuth } from '../../../context/AuthContext';

export default function DebugPage() {
  const { user, loading } = useAuth();

  // Read directly — no useState needed for a debug page
  const storage =
    typeof window !== 'undefined'
      ? {
          user_session: localStorage.getItem('user_session'),
          user: localStorage.getItem('user'),
          user_role: localStorage.getItem('user_role'),
          user_name: localStorage.getItem('user_name'),
        }
      : {};

  const cookies = typeof window !== 'undefined' ? document.cookie : '(ssr)';

  return (
    <div style={{ padding: 40, fontFamily: 'monospace', background: '#000', color: '#0f0', minHeight: '100vh' }}>
      <h1>AUTH DEBUG</h1>
      <h2>AuthContext</h2>
      <pre>{JSON.stringify({ user, loading }, null, 2)}</pre>
      <h2>localStorage</h2>
      <pre>{JSON.stringify(storage, null, 2)}</pre>
      <h2>Cookies</h2>
      <pre>{cookies || '(none)'}</pre>
    </div>
  );
}