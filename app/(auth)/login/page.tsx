'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Globe,
  KeyRound
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [loginRole, setLoginRole] = useState<'learner' | 'admin'>('learner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleQuickFillAdmin = () => {
    setLoginRole('admin');
    setEmail('john.doe@example.com');
    setPassword('password123');
    setErrorMessage(null);
  };

  const handleQuickFillLearner = () => {
    setLoginRole('learner');
    setEmail('emma.johnson@example.com');
    setPassword('password123');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      setIsLoading(false);

      if (res?.error) {
        setErrorMessage('Invalid email or password. Please try again.');
      } else {
        setSuccessMessage(
          loginRole === 'admin'
            ? 'Admin authentication successful! Redirecting to Control Center...'
            : 'Welcome back! Redirecting to AI Nexus Dashboard...'
        );

        setTimeout(() => {
          if (loginRole === 'admin') {
            router.push('/users');
          } else {
            router.push('/dashboard');
          }
        }, 800);
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('An unexpected error occurred during sign in.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070a14] text-[#f8fafc] flex flex-col justify-between selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Header Bar */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-[1400px] w-full mx-auto">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1">
              AI Nexus
            </h1>
            <p className="text-[11px] text-purple-400 font-medium">Intelligence. Amplified.</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400 hidden sm:inline">Don't have an account?</span>
          <Link
            href="/register"
            className="px-3.5 py-1.5 bg-[#131c31] border border-[#1e293b] hover:bg-[#1e293b] text-purple-300 font-semibold rounded-xl transition-colors"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Form Center Box */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          {/* Title Block */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {loginRole === 'admin' ? 'Admin Portal Access' : 'Sign in to AI Nexus'}
            </h2>
            <p className="text-xs text-zinc-400">
              {loginRole === 'admin'
                ? 'Enter administrative credentials to access system controls & permissions.'
                : 'Access your AI learning paths, algorithms, datasets, and projects.'}
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="p-1 bg-[#0f172a] border border-[#1e293b] rounded-2xl flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setLoginRole('learner');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                loginRole === 'learner'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Learner / User</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginRole('admin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                loginRole === 'admin'
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Administrator</span>
            </button>
          </div>

          {/* Card Form */}
          <Card className="bg-[#0f172a] border border-[#1e293b] p-6 rounded-2xl shadow-xl space-y-5">
            {/* Quick Demo Fill Buttons */}
            <div className="p-3 bg-[#131c31] border border-[#1e293b] rounded-xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">Quick Demo One-Click Login</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleQuickFillLearner}
                  className="px-2.5 py-1.5 bg-[#1e293b] hover:bg-purple-950/40 border border-[#2d3a54] text-zinc-200 hover:text-purple-300 font-semibold rounded-lg transition-all flex items-center justify-center gap-1 text-[11px]"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                  <span>Learner Demo</span>
                </button>
                <button
                  type="button"
                  onClick={handleQuickFillAdmin}
                  className="px-2.5 py-1.5 bg-[#1e293b] hover:bg-purple-950/40 border border-[#2d3a54] text-zinc-200 hover:text-purple-300 font-semibold rounded-lg transition-all flex items-center justify-center gap-1 text-[11px]"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Demo</span>
                </button>
              </div>
            </div>

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
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-zinc-300">
                  {loginRole === 'admin' ? 'Admin Email / Username' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={loginRole === 'admin' ? 'admin@nexus.ai' : 'learner@nexus.ai'}
                    className="pl-9 pr-4 py-2 bg-[#131c31] border-[#1e293b] text-white text-xs h-10 rounded-xl focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-zinc-300">Password</label>
                  <Link href="/forgot-password" className="text-[11px] text-purple-400 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pl-9 pr-10 py-2 bg-[#131c31] border-[#1e293b] text-white text-xs h-10 rounded-xl focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#1e293b] bg-[#131c31] text-purple-600 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-zinc-400 cursor-pointer select-none">
                  Remember this device for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 rounded-xl shadow-lg shadow-purple-900/30 gap-2 transition-all mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {loginRole === 'admin' ? 'Sign In to Admin Portal' : 'Sign In as Learner'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Social / OAuth Divider */}
            <div className="relative pt-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#1e293b]" /></div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono text-zinc-400">
                <span className="bg-[#0f172a] px-2">Or continue with</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                className="p-2.5 bg-[#131c31] border border-[#1e293b] hover:bg-[#1e293b] text-zinc-200 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4 text-purple-400" />
                <span>Google OAuth</span>
              </button>
              <button
                type="button"
                className="p-2.5 bg-[#131c31] border border-[#1e293b] hover:bg-[#1e293b] text-zinc-200 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-blue-400" />
                <span>Enterprise SSO</span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-zinc-400 border-t border-[#1e293b]">
        <span>© 2026 AI Nexus Platform • Enterprise AI Education & Control Center</span>
      </footer>
    </div>
  );
}
