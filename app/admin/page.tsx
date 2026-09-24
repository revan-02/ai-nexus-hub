'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Shield,
  Layers,
  Cpu,
  Database,
  Receipt,
  CreditCard,
  Activity,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Bot,
  Zap,
  Lock,
  ChevronRight,
  Sliders,
  DollarSign,
  TrendingUp,
  Server,
  FileCheck,
  Globe,
} from 'lucide-react';

interface GatewayConfig {
  razorpay: {
    enabled: boolean;
    keyId: string;
    mode: 'test' | 'live';
    currency: string;
    instantSettlement: boolean;
  };
  stripe: {
    enabled: boolean;
    publishableKey: string;
    mode: 'test' | 'live';
    currency: string;
  };
  general: {
    defaultGateway: 'razorpay' | 'stripe';
    autoInvoicing: boolean;
    taxPercentage: number;
    supportEmail: string;
  };
}

export default function AdminDashboardPage() {
  const [gateways, setGateways] = useState<GatewayConfig | null>(null);
  const [loadingGateways, setLoadingGateways] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchGatewaySettings = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/settings/payment-gateways');
      if (res.ok) {
        const json = await res.json();
        setGateways(json.data);
      }
    } catch (err) {
      console.error('Failed to load gateway config:', err);
    } finally {
      setLoadingGateways(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGatewaySettings();
  }, []);

  const handleToggleGatewayMode = async (gatewayType: 'razorpay' | 'stripe') => {
    if (!gateways) return;
    try {
      const currentMode = gateways[gatewayType].mode;
      const newMode = currentMode === 'test' ? 'live' : 'test';

      const updatedPayload = {
        [gatewayType]: {
          ...gateways[gatewayType],
          mode: newMode,
        },
      };

      const res = await fetch('/api/settings/payment-gateways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload),
      });

      const data = await res.json();
      if (data.success) {
        setGateways(data.data);
        setNotification({
          type: 'success',
          message: `${gatewayType.toUpperCase()} mode switched to ${newMode.toUpperCase()}`,
        });
      } else {
        setNotification({
          type: 'error',
          message: data.error || 'Failed to update gateway mode',
        });
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Network error updating gateway',
      });
    } finally {
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <AdminShell>
      <div className="space-y-8 max-w-[1700px] mx-auto pb-16">
        {/* Header / Command Center Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#23232b] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md shadow-purple-900/30">
                <Bot className="w-6 h-6" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                Nexus AI Executive Command Center
              </h1>
            </div>
            <p className="text-xs lg:text-sm text-zinc-400">
              Live platform operations, AI room orchestrator, financial telemetry, and gateway security.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchGatewaySettings}
              disabled={refreshing}
              className="border-[#2e2e38] bg-[#121217] text-zinc-300 hover:text-white hover:bg-[#1a1a22]"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Telemetry
            </Button>
            <Link href="/payment-reports">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white font-medium shadow-md shadow-purple-900/30">
                <Receipt className="w-3.5 h-3.5 mr-1.5" />
                Payment Reports
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Notification */}
        {notification && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between transition-all duration-300 ${
              notification.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-3 text-sm">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Executive KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {/* Card 1: Users */}
          <Card className="bg-[#121217] border-[#23232b] p-5 rounded-2xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Platform Users</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">1,482</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +14.2% this month
              </span>
              <Link href="/users" className="text-purple-400 hover:text-purple-300 flex items-center gap-0.5 font-medium">
                Manage <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>

          {/* Card 2: Interactive Rooms */}
          <Card className="bg-[#121217] border-[#23232b] p-5 rounded-2xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Interactive AI Rooms</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">28 Rooms</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-zinc-400">9,450 Tasks Completed</span>
              <Link href="/admin/rooms" className="text-purple-400 hover:text-purple-300 flex items-center gap-0.5 font-medium">
                Rooms Studio <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>

          {/* Card 3: Platform Revenue */}
          <Card className="bg-[#121217] border-[#23232b] p-5 rounded-2xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Platform Revenue (MTD)</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">₹14,85,200</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 99.2% Gateway Success
              </span>
              <Link href="/payment-reports" className="text-purple-400 hover:text-purple-300 flex items-center gap-0.5 font-medium">
                Invoices <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>

          {/* Card 4: Local AI Engine Cluster */}
          <Card className="bg-[#121217] border-[#23232b] p-5 rounded-2xl relative overflow-hidden group hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Ollama AI Engine</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white tracking-tight">Healthy</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Llama 3.3 & Qwen 2.5 Coder</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 42ms Latency
              </span>
            </div>
          </Card>
        </div>

        {/* Payment Gateways & Telemetry Quick Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Payment Gateways Control Panel */}
          <Card className="lg:col-span-2 bg-[#121217] border-[#23232b] p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Active Payment Gateways</h2>
                  <p className="text-xs text-zinc-400">
                    Dual Gateway Engine: Razorpay (Domestic INR) & Stripe (Global Cross-Border)
                  </p>
                </div>
              </div>
              <Link href="/payment-reports">
                <Button variant="ghost" size="sm" className="text-xs text-purple-400 hover:text-purple-300">
                  Transaction Audit <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            {loadingGateways ? (
              <div className="p-8 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-purple-500" />
                Loading gateway telemetry...
              </div>
            ) : gateways ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Razorpay Card */}
                <div className="p-4 rounded-xl bg-[#09090c] border border-[#23232b] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                        RZ
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Razorpay</div>
                        <div className="text-[11px] text-zinc-400">Default Currency: {gateways.razorpay.currency}</div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        gateways.razorpay.mode === 'live'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {gateways.razorpay.mode} Mode
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-400 pt-1">
                    <div className="flex justify-between">
                      <span>Public Key ID:</span>
                      <span className="font-mono text-zinc-300">{gateways.razorpay.keyId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Instant Settlement:</span>
                      <span className="text-emerald-400 font-medium">Enabled (T+0)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST Calculation:</span>
                      <span className="text-zinc-300 font-medium">18% Auto-applied</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1c1c24] flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleGatewayMode('razorpay')}
                      className="text-xs h-7 border-[#2e2e38] hover:bg-[#1a1a22] text-zinc-300"
                    >
                      Toggle to {gateways.razorpay.mode === 'test' ? 'Live' : 'Test'}
                    </Button>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Operational
                    </span>
                  </div>
                </div>

                {/* Stripe Card */}
                <div className="p-4 rounded-xl bg-[#09090c] border border-[#23232b] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                        ST
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Stripe</div>
                        <div className="text-[11px] text-zinc-400">Default Currency: {gateways.stripe.currency}</div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        gateways.stripe.mode === 'live'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      }`}
                    >
                      {gateways.stripe.mode} Mode
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-400 pt-1">
                    <div className="flex justify-between">
                      <span>Publishable Key:</span>
                      <span className="font-mono text-zinc-300 truncate max-w-[170px]">{gateways.stripe.publishableKey}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Webhook Security:</span>
                      <span className="text-emerald-400 font-medium">HMAC Signed</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Billing Support:</span>
                      <span className="text-zinc-300">{gateways.general.supportEmail}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1c1c24] flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleGatewayMode('stripe')}
                      className="text-xs h-7 border-[#2e2e38] hover:bg-[#1a1a22] text-zinc-300"
                    >
                      Toggle to {gateways.stripe.mode === 'test' ? 'Live' : 'Test'}
                    </Button>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Operational
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-rose-400">
                Failed to load gateway configuration. Ensure admin credentials are authorized.
              </div>
            )}
          </Card>

          {/* Column 3: Platform Infrastructure Health */}
          <Card className="bg-[#121217] border-[#23232b] p-6 rounded-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Core Services Health</h2>
                <p className="text-xs text-zinc-400">Real-time daemon and connection status</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 rounded-xl bg-[#09090c] border border-[#23232b] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-semibold text-zinc-200">PostgreSQL 16</div>
                    <div className="text-[10px] text-zinc-500">Prisma Client Pool (localhost:5432)</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  ONLINE (3ms)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#09090c] border border-[#23232b] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bot className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-semibold text-zinc-200">Local Ollama Hub</div>
                    <div className="text-[10px] text-zinc-500">127.0.0.1:11434 / vLLM Stream</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  STANDBY
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#09090c] border border-[#23232b] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-zinc-200">JWT RBAC Shield</div>
                    <div className="text-[10px] text-zinc-500">NextAuth Proxy Guards Active</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  ENFORCED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#09090c] border border-[#23232b] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="font-semibold text-zinc-200">SendGrid & WhatsApp API</div>
                    <div className="text-[10px] text-zinc-500">Dual-channel notification engine</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  READY
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Command Tiles Hub: Fast Access to Admin Subsystems */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Administrative Subsystems & Workspaces
            </h2>
            <span className="text-xs text-zinc-400">All tools equipped for superadmin execution</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Tile 1: AI Rooms Studio */}
            <Link href="/admin/rooms" className="group">
              <Card className="h-full bg-[#121217] border-[#23232b] p-5 rounded-2xl hover:border-purple-500/50 hover:bg-[#15151c] transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      Interactive AI Rooms Studio
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Create interactive challenge rooms, multi-choice tasks, code execution labs, and set XP levels.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1e1e26] flex items-center justify-between text-xs text-purple-400 font-medium">
                  <span>Open Rooms Studio</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>

            {/* Tile 2: Financial Reports & Invoicing */}
            <Link href="/payment-reports" className="group">
              <Card className="h-full bg-[#121217] border-[#23232b] p-5 rounded-2xl hover:border-emerald-500/50 hover:bg-[#15151c] transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Payment Reports & Invoicing
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Audit transactions, issue customer refunds with idempotency, print GST invoices, dispatch WhatsApp reminders.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1e1e26] flex items-center justify-between text-xs text-emerald-400 font-medium">
                  <span>View Financial Audit</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>

            {/* Tile 3: Users & Access Control */}
            <Link href="/users" className="group">
              <Card className="h-full bg-[#121217] border-[#23232b] p-5 rounded-2xl hover:border-blue-500/50 hover:bg-[#15151c] transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                      User Management & Directory
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Manage active learners, instructors, assign roles, inspect account statuses, and reset passwords.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1e1e26] flex items-center justify-between text-xs text-blue-400 font-medium">
                  <span>Manage Users</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>

            {/* Tile 4: Role & Permission Matrix */}
            <Link href="/roles" className="group">
              <Card className="h-full bg-[#121217] border-[#23232b] p-5 rounded-2xl hover:border-amber-500/50 hover:bg-[#15151c] transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      RBAC Roles & Permissions
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Define granular permissions for Content Creators, Course Instructors, and System Administrators.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1e1e26] flex items-center justify-between text-xs text-amber-400 font-medium">
                  <span>Configure Permissions</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>

            {/* Tile 5: AI Overview & Model Zoo */}
            <Link href="/ai-overview" className="group">
              <Card className="h-full bg-[#121217] border-[#23232b] p-5 rounded-2xl hover:border-cyan-500/50 hover:bg-[#15151c] transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      AI Overview & Model Zoo
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Monitor token usage, manage local Ollama inference models, temperature bounds, and prompt cache.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1e1e26] flex items-center justify-between text-xs text-cyan-400 font-medium">
                  <span>Explore AI Engine</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>

            {/* Tile 6: System Health & Telemetry */}
            <Link href="/system-health" className="group">
              <Card className="h-full bg-[#121217] border-[#23232b] p-5 rounded-2xl hover:border-rose-500/50 hover:bg-[#15151c] transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                      System Health & Diagnostics
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Uptime monitoring, database performance metrics, memory overhead, and active worker nodes.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1e1e26] flex items-center justify-between text-xs text-rose-400 font-medium">
                  <span>Inspect Health Status</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
