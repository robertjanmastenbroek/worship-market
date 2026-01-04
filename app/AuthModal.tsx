"use client";
import { useState } from "react";
import { createClient } from "../lib/supabase/client";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: { isOpen: boolean; onClose: () => void; onAuthSuccess?: (user: any) => void }) {
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'leader' | 'partner'>('leader');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }
    if (view === "signup" && role === "partner" && !agree) {
      setError("You must agree to the Statement of Faith.");
      setLoading(false);
      return;
    }
    try {
      if (view === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role, statement_of_faith_agreed: role === "partner" ? agree : undefined },
          },
        });
        if (error) throw error;
        setSuccess("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSuccess("Logged in! Redirecting...");
        // Fetch user details and call onAuthSuccess
        const { data } = await supabase.auth.getUser();
        if (data?.user && onAuthSuccess) {
          onAuthSuccess({
            name: data.user.email,
            role: data.user.user_metadata?.role || 'leader',
            verified: !!data.user.user_metadata?.statement_of_faith_agreed,
          });
        }
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 p-8 rounded-xl w-full max-w-md shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
        <h2 className="text-xl font-bold mb-4 text-white">{view === 'login' ? 'Sign In' : 'Sign Up'}</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="flex flex-col gap-3">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-slate-800 text-white mb-2"
              autoComplete="email"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-slate-800 text-white"
              autoComplete="current-password"
            />
          </div>
          {view === 'signup' && (
            <>
              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="role" value="leader" checked={role === 'leader'} onChange={() => setRole('leader')} />
                  Leader
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="role" value="partner" checked={role === 'partner'} onChange={() => setRole('partner')} />
                  Partner
                </label>
              </div>
              {role === 'partner' && (
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                  I agree to the <a href="/CONSTITUTION.md" target="_blank" className="underline">Statement of Faith</a>
                </label>
              )}
            </>
          )}
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {success && <div className="text-green-400 text-sm">{success}</div>}
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded" disabled={loading}>{loading ? 'Loading...' : view === 'login' ? 'Sign In' : 'Sign Up'}</button>
        </form>
        <div className="mt-4 text-center text-slate-400 text-sm">
          {view === 'login' ? (
            <>Don't have an account? <button className="underline" onClick={() => setView('signup')}>Sign Up</button></>
          ) : (
            <>Already have an account? <button className="underline" onClick={() => setView('login')}>Sign In</button></>
          )}
        </div>
      </div>
    </div>
  );
}
