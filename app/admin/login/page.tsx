'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Brain,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter your admin email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      });

      setIsLoading(false);

      if (res?.error) {
        setErrorMessage('Invalid admin credentials. Access denied.');
      } else {
        setSuccessMessage('Authentication successful. Loading Admin Panel...');
        setTimeout(() => {
          try {
            router.push('/admin');
          } catch {}
          if (typeof window !== 'undefined') {
            window.location.href = '/admin';
          }
        }, 300);
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070a14] text-[#f8fafc] flex flex-col justify-between">
      {/* Top bar */}
      <header className="p-5 flex items-center justify-between border-b border-[#1e293b]/60">
        <Link href="/login" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-900/30">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-sm text-white">AI Nexus</span>
        </Link>
        <Link
          href="/login"
          className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors border border-[#1e293b] hover:border-zinc-600 px-3 py-1.5 rounded-lg"
        >
          ← Back to User Login
        </Link>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">

          {/* Admin badge */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/30 flex items-center justify-center shadow-xl shadow-red-900/20">
              <ShieldCheck className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
              <p className="text-xs text-zinc-400 mt-1">
                Restricted access — AalgoLabs administrators only
              </p>
            </div>
          </div>

          {/* Security notice */}
          <div className="flex items-start gap-2.5 p-3 bg-amber-500/8 border border-amber-500/20 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-300/80 leading-relaxed">
              This portal is monitored. Unauthorized access attempts are logged and reported.
            </p>
          </div>

          {/* Form card */}
          <Card className="bg-[#0f172a] border border-[#1e293b] p-6 rounded-2xl shadow-2xl space-y-5">
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-zinc-300">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@yourdomain.com or @ainexus_admin"
                    autoComplete="username"
                    className="pl-9 bg-[#131c31] border-[#1e293b] text-white text-xs h-10 rounded-xl focus:border-red-500/60 focus:ring-red-500/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-zinc-300">Admin Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="pl-9 pr-10 bg-[#131c31] border-[#1e293b] text-white text-xs h-10 rounded-xl focus:border-red-500/60 focus:ring-red-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-700 hover:bg-red-600 text-white font-bold text-xs h-10 rounded-xl shadow-lg shadow-red-900/30 mt-2 transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    Verifying credentials...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Access Admin Panel
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </Card>

          <p className="text-center text-[11px] text-zinc-600">
            Session is encrypted and monitored by AalgoLabs security systems.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-zinc-600 border-t border-[#1e293b]/40">
        © 2026 AI Nexus Platform · Managed and Maintained by AalgoLabs (OPC) PVT.LTD.
      </footer>
    </div>
  );
}
