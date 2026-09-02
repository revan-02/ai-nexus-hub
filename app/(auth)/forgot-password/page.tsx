'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Brain, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'otp'>('request');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setErrorMessage('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/reset-password');
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#070a14] text-[#f8fafc] flex flex-col justify-between selection:bg-purple-500/30 selection:text-purple-200">
      {/* Header */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-[1400px] w-full mx-auto">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white">AI Nexus</h1>
            <p className="text-[11px] text-purple-400 font-medium">Intelligence. Amplified.</p>
          </div>
        </Link>

        <Link href="/login" className="text-xs text-purple-300 hover:text-white flex items-center gap-1.5 font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </header>

      {/* Main Center Box */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {step === 'request' ? 'Reset Your Password' : 'Verify Security Code'}
            </h2>
            <p className="text-xs text-zinc-400">
              {step === 'request'
                ? "Enter your email address and we'll send you a 6-digit verification code."
                : `We sent a 6-digit code to ${email}. Enter it below to proceed.`}
            </p>
          </div>

          <Card className="bg-[#0f172a] border border-[#1e293b] p-6 rounded-2xl shadow-xl space-y-5">
            {errorMessage && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {step === 'request' ? (
              <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block font-semibold text-zinc-300">Registered Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. learner@nexus.ai"
                      className="pl-9 pr-4 py-2 bg-[#131c31] border-[#1e293b] text-white text-xs h-10 rounded-xl focus:border-purple-500"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 rounded-xl shadow-lg shadow-purple-900/30 gap-2 transition-all"
                >
                  {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-5 text-xs">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-12 h-12 text-center text-lg font-mono font-bold bg-[#131c31] border border-[#1e293b] focus:border-purple-500 text-purple-300 rounded-xl outline-none"
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 rounded-xl shadow-lg shadow-purple-900/30 gap-2 transition-all"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Continue'}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>

      <footer className="p-4 text-center text-xs text-zinc-400 border-t border-[#1e293b]">
        <span>© 2026 AI Nexus Platform • Enterprise Security</span>
      </footer>
    </div>
  );
}
