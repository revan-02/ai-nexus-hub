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
  Check,
  User,
  AtSign,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();

  // Mode: standard registration (default) or instant OTP
  const [registerMode, setRegisterMode] = useState<'standard' | 'otp'>('standard');

  // Standard Registration Form State (Username, Email & Phone mandatory)
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Fallback Form State
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Standard Account Registration (username, email, phone mandatory)
  const handleStandardRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Client-side validations
    if (!fullName.trim()) {
      setErrorMessage('Full Name is required.');
      return;
    }

    const cleanUsername = username.trim().replace(/^@/, '');
    if (!cleanUsername || cleanUsername.length < 2) {
      setErrorMessage('Username is mandatory and must be at least 2 characters long.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('A valid Email address is mandatory.');
      return;
    }

    const cleanPhone = phone.trim();
    const phoneDigits = cleanPhone.replace(/[^0-9]/g, '');
    if (!cleanPhone || phoneDigits.length < 10) {
      setErrorMessage('A valid Mobile Phone Number is mandatory (minimum 10 digits).');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password is required and must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          username: cleanUsername,
          email: cleanEmail,
          phone: cleanPhone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        setErrorMessage(data.error || 'Registration failed. Please check the provided information.');
        return;
      }

      setSuccessMessage('Account created successfully! Signing you in...');

      // Store local profile for instant client state reactivity
      try {
        localStorage.setItem(
          'nexus_user_profile',
          JSON.stringify({
            name: fullName.trim(),
            email: cleanEmail,
            phone: cleanPhone,
            username: cleanUsername.startsWith('@') ? cleanUsername : `@${cleanUsername}`,
            bio: 'AI Practitioner & Systems Builder',
          })
        );
        window.dispatchEvent(new Event('nexus_profile_updated'));
      } catch {}

      // Auto sign-in using NextAuth credentials
      await signIn('credentials', {
        email: cleanEmail,
        password,
        name: fullName.trim(),
        redirect: false,
      });

      setIsLoading(false);

      setTimeout(() => {
        try {
          router.refresh();
        } catch {}
        router.push('/dashboard');
      }, 700);
    } catch {
      setIsLoading(false);
      setErrorMessage('An unexpected error occurred during account creation.');
    }
  };

  // Handle Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!identifier) {
      setErrorMessage(
        authMethod === 'phone'
          ? 'Please enter a valid Mobile Phone Number.'
          : 'Please enter a valid Email address.'
      );
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
      setOtpCode(data.code);
      setStep(2);
      setSuccessMessage(`OTP sent! Use test code: ${data.code}`);
    } catch {
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
      const finalName = data?.user?.name || fullName?.trim() || 'Learner';

      try {
        localStorage.setItem(
          'nexus_user_profile',
          JSON.stringify({
            name: finalName,
            email: data.user.email,
            phone: authMethod === 'phone' ? identifier : '',
            username: data.user.email?.split('@')[0] || '',
            bio: 'AI Practitioner & Systems Builder',
          })
        );
        window.dispatchEvent(new Event('nexus_profile_updated'));
      } catch {}

      await signIn('credentials', {
        email: data.user.email,
        password: 'password123',
        name: finalName,
        redirect: false,
      });

      setIsLoading(false);

      setTimeout(() => {
        try {
          router.refresh();
        } catch {}
        router.push('/dashboard');
      }, 700);
    } catch {
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
        <div className="w-full max-w-md space-y-5">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join 50,000+ AI Builders & Engineers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create Your Account
            </h2>
            <p className="text-xs text-zinc-400">
              Set up your profile with mandatory username, email, and phone number to begin.
            </p>
          </div>

          <Card className="p-6 bg-[#0f172a]/95 border border-[#1e293b] rounded-3xl shadow-2xl space-y-5 backdrop-blur-md">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#1e293b]/60 rounded-2xl border border-[#334155]/40 text-xs">
              <button
                type="button"
                onClick={() => {
                  setRegisterMode('standard');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 px-3 font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  registerMode === 'standard'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Create Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRegisterMode('otp');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 px-3 font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  registerMode === 'otp'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>1-Click OTP</span>
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

            {/* TAB 1: STANDARD REGISTRATION (USERNAME, EMAIL, PHONE MANDATORY) */}
            {registerMode === 'standard' && (
              <form onSubmit={handleStandardRegister} className="space-y-3.5 text-xs">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-zinc-300">
                    Full Name <span className="text-purple-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-[#131c31] border-[#1e293b] text-white pl-10 rounded-xl h-10 text-xs focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                {/* Username (Mandatory) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-zinc-300">
                      Username <span className="text-purple-400">*</span>
                    </label>
                    <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Mandatory</span>
                  </div>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <Input
                      type="text"
                      placeholder="johndoe or ai_ninja"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_.-]/g, ''))}
                      className="bg-[#131c31] border-[#1e293b] text-white pl-10 rounded-xl h-10 text-xs focus:border-purple-500"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400">Unique handle for your public profile & leaderboard ranking.</p>
                </div>

                {/* Email Address (Mandatory) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-zinc-300">
                      Email Address <span className="text-purple-400">*</span>
                    </label>
                    <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Mandatory</span>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#131c31] border-[#1e293b] text-white pl-10 rounded-xl h-10 text-xs focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                {/* Mobile Phone Number (Mandatory) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-zinc-300">
                      Mobile Phone Number <span className="text-purple-400">*</span>
                    </label>
                    <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Mandatory</span>
                  </div>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-[#131c31] border-[#1e293b] text-white pl-10 rounded-xl h-10 text-xs focus:border-purple-500"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400">Used for SMS security alerts and urgent system notifications.</p>
                </div>

                {/* Password (Mandatory) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-zinc-300">
                      Password <span className="text-purple-400">*</span>
                    </label>
                    <span className="text-[10px] text-zinc-400">Min 6 characters</span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-[#131c31] border-[#1e293b] text-white pl-10 pr-10 rounded-xl h-10 text-xs focus:border-purple-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-11 rounded-xl shadow-lg shadow-purple-900/40 gap-2 mt-3 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    <>
                      <span>Complete Registration & Launch</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* TAB 2: INSTANT 1-CLICK OTP SIGN UP */}
            {registerMode === 'otp' && (
              <div className="space-y-4 text-xs">
                {/* Method Switcher */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#131c31] rounded-xl border border-[#1e293b]">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('phone');
                      setStep(1);
                      setIdentifier('');
                      setErrorMessage(null);
                    }}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      authMethod === 'phone'
                        ? 'bg-purple-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
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
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      authMethod === 'email'
                        ? 'bg-purple-600 text-white'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email OTP</span>
                  </button>
                </div>

                {step === 1 && (
                  <form onSubmit={handleSendOtp} className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="block font-semibold text-zinc-300">Full Name (Optional)</label>
                      <Input
                        type="text"
                        placeholder="e.g. John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-[#131c31] border-[#1e293b] text-white rounded-xl text-xs h-10"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-semibold text-zinc-300">
                        {authMethod === 'phone' ? 'Mobile Phone Number' : 'Email Address'}
                      </label>
                      <div className="relative">
                        {authMethod === 'phone' ? (
                          <Smartphone className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        ) : (
                          <Mail className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        )}
                        <Input
                          type={authMethod === 'phone' ? 'tel' : 'email'}
                          placeholder={authMethod === 'phone' ? '+91 98765 43210' : 'you@example.com'}
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="bg-[#131c31] border-[#1e293b] text-white pl-9 rounded-xl text-xs h-10 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-10 rounded-xl shadow-lg shadow-purple-950/50 gap-2 mt-2"
                    >
                      {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
                    </Button>
                  </form>
                )}

                {step === 2 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                    <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center space-y-1">
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

                    <div className="space-y-1.5">
                      <label className="block font-semibold text-zinc-300">Enter 6-Digit OTP Code</label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <Input
                          type="text"
                          maxLength={6}
                          placeholder="482910"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          className="bg-[#131c31] border-[#1e293b] text-white font-mono tracking-widest text-center text-base pl-9 rounded-xl h-10 focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 rounded-xl shadow-lg shadow-emerald-950/50 gap-2"
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
                      className="w-full text-center text-xs text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 pt-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Change Phone / Email
                    </button>
                  </form>
                )}
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 sm:p-6 text-center text-xs text-zinc-400 border-t border-[#1e293b]/40 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
        <span>© 2026 AI Nexus Platform. All rights reserved.</span>
        <span className="hidden sm:inline">•</span>
        <span className="text-zinc-300 font-medium">Managed and Maintained by AalgoLabs (OPC) PVT.LTD.</span>
      </footer>
    </div>
  );
}
