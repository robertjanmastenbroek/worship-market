"use client";
import { useState } from "react";
import { createClient } from "../lib/supabase/client";
import { Mail, Lock, AlertCircle, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: { isOpen: boolean; onClose: () => void; onAuthSuccess?: (user: any) => void }) {
  const [view, setView] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'leader' | 'partner'>('leader');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const supabase = createClient();

  const isConfigured = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setError("Authentication is not configured. Please set up Supabase environment variables.");
      return false;
    }
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!isConfigured()) { setLoading(false); return; }
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
        setLoading(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSuccess("Logged in!");
        const { data } = await supabase.auth.getUser();
        if (data?.user && onAuthSuccess) {
          onAuthSuccess({
            name: data.user.email,
            email: data.user.email,
            role: data.user.user_metadata?.role || 'leader',
            verified: !!data.user.user_metadata?.statement_of_faith_agreed,
          });
        }
        setLoading(false);
        setTimeout(() => onClose(), 300);
        return;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!isConfigured()) { setLoading(false); return; }
    if (!email) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      if (error) throw error;
      setResetSent(true);
      setSuccess("Password reset link sent! Check your email.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (!isConfigured()) { setLoading(false); return; }
    if (!email) {
      setError("Please enter your email address first.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw error;
      setSuccess("Verification email resent! Check your inbox.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view === 'reset' && (
              <button onClick={() => { setView('login'); setResetSent(false); setError(''); setSuccess(''); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-lg font-bold text-white">
              {view === 'reset' ? 'Reset Password' : view === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white text-lg leading-none">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {error && (
            <div className="flex items-start gap-2.5 p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2.5 p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
              <CheckCircle size={16} className="mt-0.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {resetSent ? (
            <div className="text-center py-6">
              <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">Check your email</h3>
              <p className="text-slate-400 text-sm mb-4">
                We sent a password reset link to <strong className="text-white">{email}</strong>. Click the link in the email to set a new password.
              </p>
              <button onClick={() => { setView('login'); setResetSent(false); setSuccess(''); }} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={view === 'reset' ? handleResetPassword : handleAuth} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password (not for reset) */}
              {view !== 'reset' && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      autoComplete={view === 'login' ? 'current-password' : 'new-password'}
                    />
                  </div>
                </div>
              )}

              {/* Forgot password link */}
              {view === 'login' && (
                <div className="text-right">
                  <button type="button" onClick={() => { setView('reset'); setError(''); setSuccess(''); }} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Signup extra fields */}
              {view === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">I am a</label>
                    <div className="flex gap-3">
                      <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                        role === 'leader' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-800 border-white/10 text-slate-400 hover:border-white/20'
                      }`}>
                        <input type="radio" name="role" value="leader" checked={role === 'leader'} onChange={() => setRole('leader')} className="sr-only" />
                        <span className="text-sm font-medium">Leader</span>
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                        role === 'partner' ? 'bg-emerald-600/20 border-emerald-500 text-white' : 'bg-slate-800 border-white/10 text-slate-400 hover:border-white/20'
                      }`}>
                        <input type="radio" name="role" value="partner" checked={role === 'partner'} onChange={() => setRole('partner')} className="sr-only" />
                        <span className="text-sm font-medium">Partner</span>
                      </label>
                    </div>
                  </div>
                  {role === 'partner' && (
                    <label className="flex items-start gap-2.5 p-3 bg-slate-800/50 border border-white/5 rounded-xl cursor-pointer hover:border-white/10 transition-colors">
                      <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-0.5 accent-emerald-500" />
                      <span className="text-xs text-slate-400 leading-relaxed">
                        I agree to the{' '}
                        <a href="/CONSTITUTION.md" target="_blank" className="text-indigo-400 hover:text-indigo-300 underline">Statement of Faith</a>
                        {' '}and affirm I will not sell heretical content.
                      </span>
                    </label>
                  )}
                </>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{view === 'reset' ? 'Sending...' : 'Please wait...'}</span>
                  </>
                ) : (
                  view === 'reset' ? 'Send Reset Link' : view === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>

              {/* Resend verification (shown on signup success) */}
              {view === 'signup' && success && success.includes('email') && (
                <button type="button" onClick={handleResendVerification} disabled={loading} className="w-full text-xs text-indigo-400 hover:text-indigo-300 transition-colors text-center">
                  Didn't receive the email? Resend verification
                </button>
              )}
            </form>
          )}

          {/* Toggle between login/signup */}
          {view !== 'reset' && (
            <div className="mt-5 pt-4 border-t border-white/10 text-center text-sm text-slate-400">
              {view === 'login' ? (
                <>Don't have an account?{' '}<button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors" onClick={() => { setView('signup'); setError(''); setSuccess(''); }}>Sign Up</button></>
              ) : (
                <>Already have an account?{' '}<button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors" onClick={() => { setView('login'); setError(''); setSuccess(''); }}>Sign In</button></>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
