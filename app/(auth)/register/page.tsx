'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Mail,
  Smartphone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  Check
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();

  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!identifier) {
      setErrorMessage(authMethod === 'phone' ? 'Please enter a valid Mobile Phone Number.' : 'Please enter a valid Email address.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, type: authMethod }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to send OTP.');
        return;
      }

      setGeneratedCode(data.code);
      setOtpCode(data.code); // Auto-fill for instant 1-click verification
      setStep(2);
      setSuccessMessage(`OTP sent! Use test code: ${data.code}`);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Failed to connect to authentication server.');
    }
  };

  // Handle Step 2: Verify OTP & Launch App
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!otpCode || otpCode.length < 4) {
      setErrorMessage('Please enter the 6-digit verification OTP code.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier,
          code: otpCode,
          type: authMethod,
          name: fullName || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        setErrorMessage(data.error || 'Invalid verification code.');
        return;
      }

      setSuccessMessage('Verified successfully! Logging in...');

      // Auto sign in using NextAuth
      const signInRes = await signIn('credentials', {
        email: data.user.email,
        password: 'password123',
        redirect: false,
      });

      setIsLoading(false);

      if (signInRes?.error) {
        router.push('/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Verification failed.');
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
          <span className="text-zinc-400 hidden sm:inline">Already have an account?</span>
          <Link
            href="/login"
            className="px-3.5 py-1.5 bg-[#131c31] border border-[#1e293b] hover:bg-[#1e293b] text-purple-300 font-semibold rounded-xl transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant 1-Click OTP Sign Up</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create Your Free Account
            </h2>
            <p className="text-xs text-zinc-400">
              No complicated passwords required. Verify via OTP and start learning AI in seconds.
            </p>
          </div>

          <Card className="p-6 bg-[#0f172a]/90 border border-[#1e293b] rounded-3xl shadow-2xl space-y-6 backdrop-blur-md">
            {/* Method Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#1e293b]/50 rounded-2xl border border-[#334155]/40">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setStep(1);
                  setIdentifier('');
                  setErrorMessage(null);
                }}
                className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                  authMethod === 'phone'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile OTP</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMethod('email');
                  setStep(1);
                  setIdentifier('');
                  setErrorMessage(null);
                }}
                className={`py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                  authMethod === 'email'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Email OTP</span>
              </button>
            </div>

            {/* Success & Error Messages */}
            {errorMessage && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* STEP 1: Enter Phone Number or Email */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300">Your Full Name (Optional)</label>
                  <Input
                    type="text"
                    placeholder="e.g. Rajj Kashyap"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-[#1e293b]/60 border-[#334155] text-white rounded-xl text-xs h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300">
                    {authMethod === 'phone' ? 'Mobile Phone Number' : 'Email Address'}
                  </label>
                  <div className="relative">
                    {authMethod === 'phone' ? (
                      <Smartphone className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                    ) : (
                      <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                    )}
                    <Input
                      type={authMethod === 'phone' ? 'tel' : 'email'}
                      placeholder={authMethod === 'phone' ? '+91 98765 43210' : 'you@example.com'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="bg-[#1e293b]/60 border-[#334155] text-white pl-10 rounded-xl text-xs h-11 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-11 rounded-xl shadow-lg shadow-purple-950/50 gap-2 mt-2"
                >
                  {isLoading ? (
                    'Sending OTP...'
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* STEP 2: Enter 6-Digit OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl text-center space-y-1">
                  <span className="text-[11px] text-purple-300 font-semibold">Verification Code Sent To</span>
                  <p className="text-xs font-mono font-bold text-white">{identifier}</p>
                  {generatedCode && (
                    <div className="pt-2 border-t border-purple-500/20 text-xs">
                      <span className="text-zinc-400 text-[10px]">Test OTP Code: </span>
                      <span className="font-mono font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                        {generatedCode}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-300">Enter 6-Digit OTP Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-purple-400 absolute left-3.5 top-3.5" />
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="482910"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="bg-[#1e293b]/60 border-[#334155] text-white font-mono tracking-widest text-center text-lg pl-10 rounded-xl h-11 focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-11 rounded-xl shadow-lg shadow-emerald-950/50 gap-2"
                >
                  {isLoading ? (
                    'Verifying...'
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Verify & Launch Platform</span>
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 pt-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Change Phone / Email
                </button>
              </form>
            )}
          </Card>
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-zinc-500 border-t border-[#1e293b]/40">
        © 2026 AI Nexus. Secure 1-Click Verification.
      </footer>
    </div>
  );
}
