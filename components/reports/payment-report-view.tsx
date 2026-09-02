'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Download,
  Search,
  Filter,
  RefreshCw,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Receipt,
  X,
  Send,
  Building,
  Percent,
  Layers,
  Sparkles,
  RotateCcw,
  MessageCircle,
  Mail,
  Printer,
  QrCode,
  Sliders,
  AlertTriangle,
  HelpCircle,
  Phone
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  MOCK_PAYMENT_METRICS,
  MOCK_REVENUE_CHART_DATA,
  MOCK_GATEWAY_DISTRIBUTION,
  MOCK_PRODUCT_BREAKDOWN,
  MOCK_TRANSACTIONS_LIST,
  PaymentTransaction
} from '@/lib/mock-data/payment-reports-data';

export function PaymentReportView() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(MOCK_TRANSACTIONS_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [gatewayFilter, setGatewayFilter] = useState('All Gateways');
  const [dateRange, setDateRange] = useState('Last 30 Days');

  // Selected Transaction for Invoice Modal
  const [selectedInvoiceTx, setSelectedInvoiceTx] = useState<PaymentTransaction | null>(null);

  // Selected Transaction for Refund Modal
  const [refundModalTx, setRefundModalTx] = useState<PaymentTransaction | null>(null);
  const [refundReason, setRefundReason] = useState('Customer Request - Course Accidental Duplicate Purchase');
  const [isRefunding, setIsRefunding] = useState(false);

  // Selected Transaction for Reminder Modal (Email & WhatsApp)
  const [reminderModalTx, setReminderModalTx] = useState<PaymentTransaction | null>(null);
  const [reminderChannel, setReminderChannel] = useState<'whatsapp' | 'email' | 'both'>('both');
  const [customReminderNote, setCustomReminderNote] = useState('');
  const [isSendingReminder, setIsSendingReminder] = useState(false);

  // Notification Toast
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Selected Transaction for Telemetry Drawer
  const [telemetryTx, setTelemetryTx] = useState<PaymentTransaction | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (statusFilter !== 'All Status' && tx.status !== statusFilter) return false;
      if (gatewayFilter !== 'All Gateways' && tx.gateway !== gatewayFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          tx.transactionId.toLowerCase().includes(q) ||
          tx.invoiceNumber.toLowerCase().includes(q) ||
          tx.customerName.toLowerCase().includes(q) ||
          tx.customerEmail.toLowerCase().includes(q) ||
          tx.customerPhone.toLowerCase().includes(q) ||
          tx.productName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactions, statusFilter, gatewayFilter, searchQuery]);

  const handleProcessRefund = async () => {
    if (!refundModalTx) return;
    setIsRefunding(true);
    try {
      const res = await fetch('/api/reports/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'refund',
          transactionId: refundModalTx.id,
          refundReason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === refundModalTx.id ? { ...t, status: 'Refunded' } : t))
        );
        setNotification({
          type: 'success',
          message: `Refund of ₹${refundModalTx.amount.toLocaleString('en-IN')} successfully processed for ${refundModalTx.transactionId}.`,
        });
        setRefundModalTx(null);
      } else {
        setNotification({ type: 'error', message: data.error || 'Refund failed' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Refund network error' });
    } finally {
      setIsRefunding(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleSendReminder = async () => {
    if (!reminderModalTx) return;
    setIsSendingReminder(true);
    try {
      if (reminderChannel === 'whatsapp' || reminderChannel === 'both') {
        await fetch('/api/settings/email-whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'test_whatsapp',
            targetPhone: reminderModalTx.customerPhone,
          }),
        });
      }

      if (reminderChannel === 'email' || reminderChannel === 'both') {
        await fetch('/api/settings/email-whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'test_email',
            targetEmail: reminderModalTx.customerEmail,
          }),
        });
      }

      setNotification({
        type: 'success',
        message: `Payment reminder successfully dispatched to ${reminderModalTx.customerName} via ${
          reminderChannel === 'both' ? 'WhatsApp & Email' : reminderChannel === 'whatsapp' ? 'WhatsApp' : 'Email'
        }!`,
      });
      setReminderModalTx(null);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to dispatch reminder' });
    } finally {
      setIsSendingReminder(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleDirectWhatsApp = (tx: PaymentTransaction) => {
    const cleanPhone = tx.customerPhone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${tx.customerName},\n\nThis is a payment update from Nexus AI Education.\nInvoice #${tx.invoiceNumber} for "${tx.productName}" has status: ${tx.status}.\nTotal Amount: ₹${tx.amount.toLocaleString('en-IN')}\nBalance Due: ₹${tx.balanceDue.toLocaleString('en-IN')}\nDue Date: ${tx.dueDate}\n\nPlease complete your payment securely here: https://nexusai.education/pay/${tx.invoiceNumber}\n\nThank you!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Invoice Number',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Product Name',
      'Product Type',
      'Total Amount (INR)',
      'Paid Amount (INR)',
      'Balance Due (INR)',
      'Gateway',
      'Payment Method',
      'GST (18%)',
      'Net Amount',
      'Status',
      'Due Date',
      'Timestamp',
    ];

    const rows = filteredTransactions.map((t) => [
      t.transactionId,
      t.invoiceNumber,
      `"${t.customerName}"`,
      t.customerEmail,
      `"${t.customerPhone}"`,
      `"${t.productName}"`,
      t.productType,
      t.amount,
      t.paidAmount,
      t.balanceDue,
      t.gateway,
      t.paymentMethod,
      t.taxAmount,
      t.netAmount,
      t.status,
      t.dueDate,
      `"${t.timestamp}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nexus_Payment_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Color Coding for all Payment Statuses
  const getStatusBadge = (status: PaymentTransaction['status']) => {
    switch (status) {
      case 'Settled':
      case 'Captured':
        // 🟢 Green for Paid
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold';
      case 'Half Paid':
        // 🟣 Purple/Indigo for Half Paid (Installment / Partial)
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30 font-bold';
      case 'Pending':
        // 🟡 Amber/Yellow for Processing
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold';
      case 'Not Paid':
        // 🔴 Red/Rose for Unpaid / Overdue
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold';
      case 'Refunded':
        // ⚪ Muted Slate for Refunded
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30 font-medium';
      case 'Failed':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold';
      default:
        return 'bg-secondary text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── NOTIFICATION TOAST ── */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-2xl animate-in slide-in-from-top-3 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── TOP HEADER & CONTROLS ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Payment &amp; Financial Reports
            </h1>
            <Receipt className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Reconcile live transactions, generate printable GST invoices, track <strong>Pending / Half Paid / Not Paid</strong> statuses, and dispatch WhatsApp &amp; Email reminders.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Settings API Shortcut */}
          <Link href="/settings?tab=email-whatsapp">
            <Button
              variant="outline"
              className="bg-secondary/80 border-border hover:bg-secondary text-foreground text-xs font-semibold h-9 px-3.5 rounded-xl gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Email &amp; WhatsApp Settings</span>
            </Button>
          </Link>

          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-card border border-border text-foreground text-xs font-semibold rounded-xl px-3 py-2 h-9 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="Today">Today</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days (August 2026)</option>
            <option value="Q3 2026">Q3 2026</option>
            <option value="FY 2026-27">FY 2026-27 YTD</option>
          </select>

          <Button
            onClick={handleExportCSV}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-9 px-4 rounded-xl gap-1.5 shadow-md shadow-purple-950/40 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV / Excel</span>
          </Button>
        </div>
      </div>

      {/* ── STATUS SUMMARY PILLARS (DISTINCT COLORS) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Settled / Paid (Full)', count: '5 Transactions', amount: '₹37,495', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
          { label: 'Half Paid (Installments)', count: '2 Students', amount: '₹7,248 Due', badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30', dot: 'bg-indigo-400' },
          { label: 'Pending (Processing)', count: '1 Order', amount: '₹5,499 Auth', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
          { label: 'Not Paid (Invoice Due)', count: '1 Enterprise PO', amount: '₹49,999 Due', badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30', dot: 'bg-rose-400' },
          { label: 'Refunded (Reversed)', count: '1 Reversal', amount: '₹12,999 Total', badge: 'bg-slate-500/15 text-slate-400 border-slate-500/30', dot: 'bg-slate-400' },
        ].map((item, idx) => (
          <div key={idx} className={`p-3.5 rounded-2xl border ${item.badge} space-y-1`}>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className={`w-2 h-2 rounded-full ${item.dot}`} />
              <span>{item.label}</span>
            </div>
            <div className="text-base font-bold font-mono text-foreground">{item.amount}</div>
            <div className="text-[11px] opacity-80 font-mono">{item.count}</div>
          </div>
        ))}
      </div>

      {/* ── 6 FINANCIAL KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            title: 'Total Gross Revenue',
            value: `₹${MOCK_PAYMENT_METRICS.totalGrossRevenue.toLocaleString('en-IN')}`,
            change: MOCK_PAYMENT_METRICS.grossRevenueGrowth,
            positive: true,
            icon: DollarSign,
            color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
          },
          {
            title: 'Monthly Recurring (MRR)',
            value: `₹${MOCK_PAYMENT_METRICS.mrr.toLocaleString('en-IN')}`,
            change: MOCK_PAYMENT_METRICS.mrrGrowth,
            positive: true,
            icon: TrendingUp,
            color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
          },
          {
            title: 'Successful Orders',
            value: MOCK_PAYMENT_METRICS.totalTransactions.toLocaleString(),
            change: `${MOCK_PAYMENT_METRICS.successRate} Success`,
            positive: true,
            icon: CheckCircle2,
            color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
          },
          {
            title: 'Average Order Value',
            value: `₹${MOCK_PAYMENT_METRICS.averageOrderValue.toLocaleString('en-IN')}`,
            change: 'Per Checkout',
            positive: true,
            icon: Percent,
            color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
          },
          {
            title: 'Taxes Collected (GST)',
            value: `₹${MOCK_PAYMENT_METRICS.totalTaxesCollected.toLocaleString('en-IN')}`,
            change: '18% SAC 999293',
            positive: true,
            icon: FileText,
            color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
          },
          {
            title: 'In-Transit Payouts',
            value: `₹${MOCK_PAYMENT_METRICS.pendingPayouts.toLocaleString('en-IN')}`,
            change: 'T+2 Settlement',
            positive: true,
            icon: CreditCard,
            color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <Card key={idx} className="p-4 bg-card border-border rounded-2xl shadow-sm hover:border-purple-500/40 transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-muted-foreground truncate">
                  {kpi.title}
                </span>
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xl font-bold font-mono text-foreground tracking-tight">{kpi.value}</div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{kpi.change}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── CHARTS: REVENUE TREND + GATEWAY SPLIT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 Cols) Revenue Area Chart */}
        <Card className="lg:col-span-8 p-5 bg-card border-border rounded-3xl space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>Revenue Flow &amp; Daily Checkout Volume</span>
              </h3>
              <p className="text-xs text-muted-foreground">August 2026 Daily Gross Settlement Breakdown</p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Razorpay
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Stripe
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_REVENUE_CHART_DATA}>
                <defs>
                  <linearGradient id="razorpayGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="stripeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#272730" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#121217', borderColor: '#272730', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="razorpay" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#razorpayGrad)" />
                <Area type="monotone" dataKey="stripe" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#stripeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right Column (4 Cols) Gateway Donut */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-5 bg-card border-border rounded-3xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-foreground flex items-center justify-between">
              <span>Payment Gateway Share</span>
              <span className="text-[10px] font-mono text-muted-foreground">4 Gateways</span>
            </h3>

            <div className="relative h-40 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_GATEWAY_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {MOCK_GATEWAY_DISTRIBUTION.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold font-mono text-foreground">₹48.9L</span>
                <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">Settled</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              {MOCK_GATEWAY_DISTRIBUTION.map((g) => (
                <div key={g.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                    <span className="font-medium text-muted-foreground">{g.name}</span>
                  </div>
                  <span className="font-mono text-foreground font-bold">{g.percentage}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── TRANSACTIONS & RECONCILIATION TABLE ── */}
      <Card className="p-5 bg-card border-border rounded-3xl space-y-4 shadow-xl">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-secondary border border-border text-foreground text-xs font-semibold rounded-xl px-3 py-1.5 h-8 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="All Status">All Status (Settled, Half Paid, Pending, Not Paid, Refunded)</option>
              <option value="Settled">🟢 Settled / Paid</option>
              <option value="Half Paid">🟣 Half Paid (Installment)</option>
              <option value="Pending">🟡 Pending (Processing)</option>
              <option value="Not Paid">🔴 Not Paid (Invoice Due)</option>
              <option value="Refunded">⚪ Refunded</option>
            </select>

            {/* Gateway Filter */}
            <select
              value={gatewayFilter}
              onChange={(e) => setGatewayFilter(e.target.value)}
              className="bg-secondary border border-border text-foreground text-xs font-semibold rounded-xl px-3 py-1.5 h-8 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="All Gateways">All Gateways (Razorpay, Stripe, Wire, Direct UPI)</option>
              <option value="Razorpay">Razorpay</option>
              <option value="Stripe">Stripe</option>
              <option value="Bank Wire">Bank Wire</option>
              <option value="Direct UPI">Direct UPI</option>
            </select>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, phone, TXN ID, invoice #..."
              className="pl-9 pr-4 py-1.5 h-8 text-xs bg-secondary border-border text-foreground placeholder:text-muted-foreground rounded-xl"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-foreground">
            <thead className="bg-secondary text-muted-foreground font-semibold border-b border-border uppercase text-[10px] tracking-wider font-mono">
              <tr>
                <th className="p-3">Invoice &amp; TXN</th>
                <th className="p-3">Customer &amp; Phone</th>
                <th className="p-3">Product</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Paid vs Balance</th>
                <th className="p-3">Status</th>
                <th className="p-3">Due Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-secondary/40 transition-colors">
                  {/* Invoice & TXN */}
                  <td className="p-3 whitespace-nowrap font-mono space-y-0.5">
                    <span className="font-bold text-foreground block">{tx.invoiceNumber}</span>
                    <span className="text-[10px] text-purple-400 block">{tx.transactionId}</span>
                  </td>

                  {/* Customer & Phone */}
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img src={tx.customerAvatar} alt={tx.customerName} className="w-7 h-7 rounded-full border border-border" />
                      <div>
                        <span className="font-bold text-foreground block leading-tight">{tx.customerName}</span>
                        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" /> {tx.customerPhone}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Product */}
                  <td className="p-3 max-w-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-foreground block truncate">{tx.productName}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {tx.gateway} • {tx.paymentMethod}
                      </span>
                    </div>
                  </td>

                  {/* Total Amount */}
                  <td className="p-3 whitespace-nowrap font-mono font-bold text-foreground">
                    ₹{tx.amount.toLocaleString('en-IN')}
                  </td>

                  {/* Paid vs Balance */}
                  <td className="p-3 whitespace-nowrap font-mono">
                    <div className="space-y-0.5">
                      <span className="text-emerald-400 font-bold block">Paid: ₹{tx.paidAmount.toLocaleString('en-IN')}</span>
                      {tx.balanceDue > 0 ? (
                        <span className="text-rose-400 font-bold text-[11px] block">Due: ₹{tx.balanceDue.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-muted-foreground text-[10px] block">No Balance</span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] border ${getStatusBadge(tx.status)}`}>
                      {tx.status}
                    </span>
                    {tx.installmentInfo && (
                      <span className="block text-[9px] font-mono text-muted-foreground mt-0.5">
                        {tx.installmentInfo}
                      </span>
                    )}
                  </td>

                  {/* Due Date */}
                  <td className="p-3 whitespace-nowrap font-mono text-[11px]">
                    <span className={tx.balanceDue > 0 ? 'text-amber-400 font-semibold' : 'text-muted-foreground'}>
                      {tx.dueDate}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3 whitespace-nowrap text-right space-x-1.5">
                    {/* Printable Invoice Modal Button */}
                    <Button
                      onClick={() => setSelectedInvoiceTx(tx)}
                      variant="outline"
                      className="bg-secondary border-border hover:bg-secondary/80 text-foreground text-[11px] font-semibold h-7 px-2.5 rounded-lg gap-1 cursor-pointer"
                    >
                      <Printer className="w-3 h-3 text-purple-400" />
                      <span>Print Invoice</span>
                    </Button>

                    {/* WhatsApp Direct Reminder Button */}
                    <Button
                      onClick={() => handleDirectWhatsApp(tx)}
                      variant="outline"
                      className="bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold h-7 px-2 rounded-lg gap-1 cursor-pointer"
                      title="Send WhatsApp Message / Reminder"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </Button>

                    {/* Email / Custom Reminder Modal */}
                    <Button
                      onClick={() => setReminderModalTx(tx)}
                      variant="outline"
                      className="bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-400 text-[11px] font-semibold h-7 px-2 rounded-lg gap-1 cursor-pointer"
                      title="Send Automated Email / WhatsApp Reminder"
                    >
                      <Send className="w-3 h-3" />
                      <span>Reminder</span>
                    </Button>

                    {/* Refund Action */}
                    {tx.paidAmount > 0 && tx.status !== 'Refunded' && (
                      <Button
                        onClick={() => setRefundModalTx(tx)}
                        variant="outline"
                        className="bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/20 text-rose-400 text-[11px] font-semibold h-7 px-2 rounded-lg gap-1 cursor-pointer"
                        title="Issue Refund"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border text-xs text-muted-foreground font-mono">
          <div>
            Showing <span className="font-bold text-foreground">{filteredTransactions.length}</span> of{' '}
            <span className="font-bold text-foreground">{transactions.length}</span> reconciled transactions
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 font-bold">
              Total Collected: ₹{filteredTransactions.reduce((acc, t) => acc + t.paidAmount, 0).toLocaleString('en-IN')}
            </span>
            <span className="text-rose-400 font-bold">
              Total Outstanding Due: ₹{filteredTransactions.reduce((acc, t) => acc + t.balanceDue, 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </Card>

      {/* ── MODAL 1: 100% PRINTABLE TAX INVOICE MODAL (CLEAN GST FORMAT) ── */}
      {selectedInvoiceTx && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white text-zinc-900 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-200">
            {/* Top Toolbar (Hidden during browser print) */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 print:hidden">
              <div className="flex items-center gap-2 text-zinc-600 text-xs font-mono">
                <Printer className="w-4 h-4 text-purple-600" />
                <span>Ready for High-Quality PDF / Thermal / A4 Print</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => window.print()}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-8 px-4 rounded-xl gap-1.5 cursor-pointer shadow-md"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </Button>
                <button
                  onClick={() => setSelectedInvoiceTx(null)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── PRINTABLE INVOICE BODY ── */}
            <div className="space-y-6 text-zinc-900 font-sans" id="printable-invoice">
              {/* Letterhead Header */}
              <div className="flex items-start justify-between border-b-2 border-zinc-900 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-extrabold text-purple-700 tracking-tight">NEXUS AI EDUCATION</span>
                  </div>
                  <p className="text-xs text-zinc-600 font-medium">Nexus AI Technologies Pvt. Ltd.</p>
                  <p className="text-[11px] text-zinc-500">GSTIN: <strong>29ABCDE1234F1Z5</strong> • SAC: <strong>999293</strong></p>
                  <p className="text-[11px] text-zinc-500">Tech Park, Outer Ring Road, Bangalore - 560103</p>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">TAX INVOICE</div>
                  <div className="text-xs font-mono font-bold text-purple-700">{selectedInvoiceTx.invoiceNumber}</div>
                  <div className="text-[11px] text-zinc-500 font-mono">Date: {selectedInvoiceTx.timestamp}</div>
                  <div className="text-[11px] font-mono">
                    Status:{' '}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedInvoiceTx.status === 'Settled' || selectedInvoiceTx.status === 'Captured'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedInvoiceTx.status === 'Half Paid'
                        ? 'bg-indigo-100 text-indigo-800'
                        : selectedInvoiceTx.status === 'Not Paid'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedInvoiceTx.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Billed To Customer Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-zinc-500">Customer (Student / Client):</span>
                  <div className="font-bold text-zinc-900">{selectedInvoiceTx.customerName}</div>
                  <div className="text-zinc-600">{selectedInvoiceTx.customerEmail}</div>
                  <div className="text-zinc-600 font-mono">{selectedInvoiceTx.customerPhone}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-zinc-500">Payment Details:</span>
                  <div className="text-zinc-700 font-medium">Gateway: {selectedInvoiceTx.gateway}</div>
                  <div className="text-zinc-700 font-medium">Method: {selectedInvoiceTx.paymentMethod}</div>
                  <div className="text-zinc-500 font-mono text-[10px]">Ref ID: {selectedInvoiceTx.gatewayPaymentId}</div>
                </div>
              </div>

              {/* Itemized Line Items Table */}
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-300 bg-zinc-100 text-zinc-700 uppercase font-mono text-[10px]">
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3 text-center">Type</th>
                    <th className="py-2.5 px-3 text-right">Taxable (INR)</th>
                    <th className="py-2.5 px-3 text-right">GST (18%)</th>
                    <th className="py-2.5 px-3 text-right">Total (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr>
                    <td className="py-3 px-3">
                      <div className="font-bold text-zinc-900">{selectedInvoiceTx.productName}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">SAC: 999293 (Online Digital Learning)</div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">{selectedInvoiceTx.productType}</td>
                    <td className="py-3 px-3 text-right font-mono">
                      ₹{(selectedInvoiceTx.amount - selectedInvoiceTx.taxAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-600">
                      ₹{selectedInvoiceTx.taxAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-zinc-900">
                      ₹{selectedInvoiceTx.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Total & Outstanding Due Calculation */}
              <div className="flex justify-end pt-2">
                <div className="w-72 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Taxable Base Value:</span>
                    <span className="font-mono font-medium">₹{(selectedInvoiceTx.amount - selectedInvoiceTx.taxAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>IGST / CGST+SGST (18%):</span>
                    <span className="font-mono font-medium">₹{selectedInvoiceTx.taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-zinc-900 border-t border-zinc-300 pt-1.5">
                    <span>Invoice Total Amount:</span>
                    <span className="font-mono">₹{selectedInvoiceTx.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    <span>Amount Paid (Received):</span>
                    <span className="font-mono">₹{selectedInvoiceTx.paidAmount.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedInvoiceTx.balanceDue > 0 ? (
                    <div className="flex justify-between font-bold text-xs text-rose-700 bg-rose-50 px-2 py-1 rounded">
                      <span>Outstanding Balance Due:</span>
                      <span className="font-mono">₹{selectedInvoiceTx.balanceDue.toLocaleString('en-IN')}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-600 font-bold text-right pt-0.5">
                      ✓ Paid in Full (Zero Balance)
                    </div>
                  )}
                </div>
              </div>

              {/* Terms & Official Stamp */}
              <div className="border-t border-zinc-200 pt-4 flex items-center justify-between text-[10px] text-zinc-500">
                <div className="space-y-0.5 max-w-sm">
                  <p className="font-bold text-zinc-700">Terms &amp; Notes:</p>
                  <p>1. This is a computer-generated tax invoice and does not require physical signature.</p>
                  <p>2. For queries, contact billing@nexusai.education or WhatsApp +91 80 4912 8800.</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="w-24 h-10 border border-dashed border-zinc-300 rounded flex items-center justify-center font-mono text-[9px] text-zinc-400">
                    Authorized Signatory
                  </div>
                  <p className="font-bold text-zinc-700">Nexus AI Accounts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: SEND EMAIL & WHATSAPP PAYMENT REMINDER ── */}
      {reminderModalTx && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-[#0f0e17] border-purple-500/30 rounded-3xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Send className="w-4 h-4" />
                <span>Send Invoice &amp; Payment Reminder</span>
              </div>
              <button onClick={() => setReminderModalTx(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Card */}
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{reminderModalTx.customerName}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${getStatusBadge(reminderModalTx.status)}`}>
                  {reminderModalTx.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground font-mono text-[11px]">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-purple-400" /> {reminderModalTx.customerEmail}</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-400" /> {reminderModalTx.customerPhone}</span>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between font-mono">
                <span>Total: ₹{reminderModalTx.amount.toLocaleString('en-IN')}</span>
                <span className="text-rose-400 font-bold">Balance Due: ₹{reminderModalTx.balanceDue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Dispatch Channel Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Delivery Channel:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'both', label: 'WhatsApp + Email', icon: Sparkles },
                  { id: 'whatsapp', label: 'WhatsApp Only', icon: MessageCircle },
                  { id: 'email', label: 'Email Only', icon: Mail },
                ].map((ch) => {
                  const Icon = ch.icon;
                  const isSelected = reminderChannel === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setReminderChannel(ch.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                          : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{ch.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* WhatsApp / Email Template Preview */}
            <div className="p-3 bg-secondary/80 rounded-2xl border border-border space-y-1 text-[11px] font-mono text-zinc-300">
              <span className="text-[10px] text-purple-400 font-bold uppercase block">Automated Message Template:</span>
              <p className="leading-relaxed">
                &quot;Dear {reminderModalTx.customerName}, this is a reminder regarding Invoice #{reminderModalTx.invoiceNumber} for {reminderModalTx.productName}. Outstanding balance: ₹{reminderModalTx.balanceDue.toLocaleString('en-IN')} due by {reminderModalTx.dueDate}. Click here to pay securely: https://nexusai.education/pay/{reminderModalTx.invoiceNumber}&quot;
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                onClick={() => setReminderModalTx(null)}
                variant="outline"
                className="bg-secondary border-border text-foreground text-xs font-semibold h-9 px-4 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendReminder}
                disabled={isSendingReminder}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-9 px-4 rounded-xl gap-2 cursor-pointer shadow-md shadow-purple-950/40"
              >
                {isSendingReminder ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Reminder</span>
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── MODAL 3: ISSUE REFUND MODAL ── */}
      {refundModalTx && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-[#0f0e17] border-rose-500/30 rounded-3xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <RotateCcw className="w-4 h-4" />
                <span>Issue Transaction Refund</span>
              </div>
              <button onClick={() => setRefundModalTx(null)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2 text-xs">
              <span className="text-rose-300 font-bold block">Refund Amount Confirmation</span>
              <div className="text-2xl font-bold font-mono text-white">
                ₹{refundModalTx.paidAmount.toLocaleString('en-IN')}
              </div>
              <p className="text-zinc-400">
                Customer: <strong className="text-white">{refundModalTx.customerName}</strong> ({refundModalTx.customerEmail})
              </p>
              <p className="text-zinc-400">
                Transaction ID: <span className="font-mono text-purple-300">{refundModalTx.transactionId}</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Refund Reason (Audit Log):</label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full bg-secondary border border-border text-foreground text-xs font-semibold rounded-xl p-2.5 focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="Customer Request - Accidental Duplicate Purchase">Customer Request - Accidental Duplicate Purchase</option>
                <option value="Course Dissatisfaction within 7-day window">Course Dissatisfaction within 7-day window</option>
                <option value="Unauthorized Payment / Fraud Report">Unauthorized Payment / Fraud Report</option>
                <option value="Billing Discrepancy Adjustment">Billing Discrepancy Adjustment</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                onClick={() => setRefundModalTx(null)}
                variant="outline"
                className="bg-secondary border-border text-foreground text-xs font-semibold h-9 px-4 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleProcessRefund}
                disabled={isRefunding}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold h-9 px-4 rounded-xl gap-1.5 cursor-pointer shadow-md shadow-rose-950/40"
              >
                {isRefunding ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Refund...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Confirm &amp; Reverse Funds</span>
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
