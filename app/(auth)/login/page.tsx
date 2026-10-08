'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { signIn } from 'next-auth/react';
import {
  initPhoneRecaptcha,
  sendPhoneOtp,
  verifyPhoneOtp,
  loginWithEmail,
  signInWithGoogle
} from '@/lib/firebase/auth';
import type { ConfirmationResult } from 'firebase/auth';
import { validatePhoneNumber } from '@/schemas/auth';

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState<'password' | 'phone'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Firebase Phone Auth State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneStep, setPhoneStep] = useState<1 | 2>(1);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

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
      const cleanIdentifier = email.trim();

      let storedName = '';
      try {
        const savedProfile = localStorage.getItem('nexus_user_profile');
        if (savedProfile) {
          const p = JSON.parse(savedProfile);
          if (p.name && !/^[0-9\s\-+]+$/.test(p.name)) {
            storedName = p.name;
          }
        }
      } catch {}

      const res = await signIn('credentials', {
        email: cleanIdentifier,
        password,
        name: storedName || undefined,
        redirect: false,
      });

      // Synchronize with Firebase Auth & Firestore if standard email
      if (!res?.error && cleanIdentifier.includes('@')) {
        try {
          await loginWithEmail(cleanIdentifier, password);
        } catch (fbErr: any) {
          console.warn('[Firebase Auth] Non-fatal note during email login:', fbErr?.message || fbErr);
        }
      }

      setIsLoading(false);

      if (res?.error) {
        setErrorMessage('Invalid credentials. Please verify your email, username, or phone number and password.');
      } else {
        if (storedName) {
          try {
            window.dispatchEvent(new Event('nexus_profile_updated'));
          } catch {}
        }
        setSuccessMessage('Welcome back! Redirecting to AI Nexus Dashboard...');

        // Full browser navigation guarantees cookies are committed and verified by middleware
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('An unexpected error occurred during sign in.');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const { user, profile } = await signInWithGoogle();
      setSuccessMessage(`Welcome, ${profile.name}! Redirecting to Dashboard...`);
      await signIn('credentials', {
        email: profile.email || `${user.uid}@nexus.ai`,
        password: 'password123',
        name: profile.name,
        redirect: false,
      });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (err: unknown) {
      setIsLoading(false);
      const error = err as { code?: string; message?: string };
      if (error.code === 'auth/popup-closed-by-user') return;
      if (error.code === 'auth/unauthorized-domain' || error.message?.includes('unauthorized-domain')) {
        setErrorMessage(
          "Google Sign-In domain unauthorized. Add 'localhost' or 'revbodh.com' to Authorized Domains in Firebase Console > Authentication > Settings."
        );
      } else {
        setErrorMessage(error.message || 'Failed to sign in with Google.');
      }
    }
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanPhone = phoneNumber.trim();
    const phoneCheck = validatePhoneNumber(cleanPhone);
    if (!phoneCheck.valid) {
      setErrorMessage(phoneCheck.error || 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const verifier = initPhoneRecaptcha('firebase-recaptcha-container');
      const confirmation = await sendPhoneOtp(phoneCheck.formatted, verifier);
      setConfirmationResult(confirmation);
      setPhoneStep(2);
      setSuccessMessage(`SMS OTP sent to ${phoneCheck.formatted}. Please enter the 6-digit code.`);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      const errCode = error.code || '';
      const errMsg = error.message || '';

      if (errCode === 'auth/configuration-not-found' || errMsg.includes('configuration-not-found')) {
        setErrorMessage(
          'Phone Authentication is not enabled in the Firebase Console for project "revbodh". Please go to Firebase Console > Authentication > Sign-in method, click "Phone", and enable it.'
        );
      } else if (errCode === 'auth/unauthorized-domain' || errMsg.includes('unauthorized-domain')) {
        setErrorMessage(
          'This domain is not in the Firebase Authorized Domains list. Please add your current domain under Firebase Console > Authentication > Settings > Authorized domains.'
        );
      } else if (errCode === 'auth/quota-exceeded' || errMsg.includes('quota-exceeded')) {
        setErrorMessage(
          'Daily SMS quota exceeded for Firebase project. You can add test numbers in Firebase Console > Authentication > Sign-in method > Phone to test without SMS quota.'
        );
      } else if (errCode === 'auth/captcha-check-failed' || errMsg.includes('captcha-check-failed')) {
        setErrorMessage('reCAPTCHA verification failed. Please refresh the page and try again.');
      } else {
        setErrorMessage(
          error.message || 'Failed to send SMS code. Please verify phone number format (e.g. +91 98765 43210).'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!confirmationResult || !phoneCode.trim()) {
      setErrorMessage('Please enter the verification code received on your phone.');
      return;
    }

    setIsLoading(true);
    try {
      const { user, profile } = await verifyPhoneOtp(confirmationResult, phoneCode);
      setSuccessMessage(`Phone verified! Welcome ${profile.name}. Redirecting...`);
      await signIn('credentials', {
        email: profile.phone || `${user.uid}@nexus.ai`,
        password: 'password123',
        name: profile.name,
        redirect: false,
      });
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (err: unknown) {
      setIsLoading(false);
      const error = err as { code?: string; message?: string };
      setErrorMessage(error.message || 'Invalid or expired SMS verification code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070a14] text-[#f8fafc] flex flex-col justify-between selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Header Bar */}
      <header className="p-4 sm:p-6 flex items-center justify-between max-w-[1400px] w-full mx-auto">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                if (window.history.length > 1) window.history.back();
                else window.location.href = '/dashboard';
              }
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-[#1a2333] bg-[#101726] border border-[#1e293b] transition-all cursor-pointer min-h-[38px] flex items-center gap-1.5 flex-shrink-0 group shadow-sm active:scale-95"
            title="Back to previous action"
            aria-label="Back to previous action"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-purple-400" />
            <span className="hidden sm:inline text-xs font-semibold">Back</span>
          </button>

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
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-zinc-400 hidden sm:inline">Don&apos;t have an account?</span>
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
              Sign in to AI Nexus
            </h2>
            <p className="text-xs text-zinc-400">
              Access your AI learning paths, algorithms, datasets, and projects.
            </p>
          </div>

          {/* Card Form */}
          <Card className="bg-[#0f172a] border border-[#1e293b] p-6 rounded-2xl shadow-xl space-y-5">
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

            {/* Auth Mode Switcher (Password vs Phone SMS OTP) */}
            <div className="flex items-center gap-1.5 p-1 bg-[#131c31] border border-[#1e293b] rounded-xl text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('password');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  authMethod === 'password'
                    ? 'bg-purple-600 text-white font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>Password Login</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  authMethod === 'phone'
                    ? 'bg-purple-600 text-white font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Phone SMS OTP</span>
              </button>
            </div>

            {authMethod === 'password' ? (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-zinc-300">
                    Email Address, Username, or Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="learner@nexus.ai, @username, or +91 98765 43210"
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
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 rounded-xl shadow-lg shadow-purple-900/30 gap-2 transition-all mt-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In as Learner
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={phoneStep === 1 ? handleSendPhoneOtp : handleVerifyPhoneOtp} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block font-semibold text-zinc-300">Mobile Phone Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      type="tel"
                      disabled={phoneStep === 2 || isLoading}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="pl-9 pr-4 py-2 bg-[#131c31] border-[#1e293b] text-white text-xs h-10 rounded-xl focus:border-purple-500"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400">Include country code (e.g. +91 for India, +1 for US)</p>
                </div>

                {phoneStep === 2 && (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <label className="block font-semibold text-zinc-300">6-Digit SMS Verification Code</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input
                        type="text"
                        value={phoneCode}
                        onChange={(e) => setPhoneCode(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="pl-9 pr-4 py-2 bg-[#131c31] border-[#1e293b] text-white text-xs h-10 rounded-xl focus:border-purple-500 tracking-widest font-mono text-center text-sm"
                      />
                    </div>
                  </div>
                )}

                <div id="firebase-recaptcha-container"></div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-10 rounded-xl shadow-lg shadow-purple-900/30 gap-2 transition-all mt-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      {phoneStep === 1 ? 'Sending SMS OTP...' : 'Verifying Code...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {phoneStep === 1 ? 'Send SMS Verification Code' : 'Verify Code & Sign In'}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>

                {phoneStep === 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhoneStep(1);
                      setConfirmationResult(null);
                    }}
                    className="w-full text-center text-[11px] text-zinc-400 hover:text-purple-400 cursor-pointer pt-1"
                  >
                    Change Phone Number
                  </button>
                )}
              </form>
            )}

            {/* Social / OAuth Divider */}
            <div className="relative pt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1e293b]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono text-zinc-400">
                <span className="bg-[#0f172a] px-2">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full p-2.5 bg-[#131c31] border border-[#1e293b] hover:bg-[#1e293b] text-zinc-200 hover:text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 sm:p-6 text-center text-xs text-zinc-400 border-t border-[#1e293b] flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
        <span>© 2026 AI Nexus Platform. All rights reserved.</span>
        <span className="hidden sm:inline">•</span>
        <span className="text-zinc-300 font-medium">Managed and Maintained by AalgoLabs (OPC) PVT.LTD.</span>
      </footer>
    </div>
  );
}
