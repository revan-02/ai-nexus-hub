'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { useNexus, UserLevel, ThemeMode, AccentColor } from '@/context/nexus-context';
import { signOut } from 'next-auth/react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User,
  Sliders,
  Bell,
  ShieldCheck,
  CreditCard,
  Link as LinkIcon,
  Sun,
  Moon,
  Laptop,
  Check,
  Download,
  Share2,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Globe,
  Trash2,
  Plus,
  Zap,
  DollarSign,
  X,
  Copy,
  Users,
  Gift,
  Send,
  MessageSquare,
  FileText,
  Database,
  HardDrive,
  RefreshCw,
  Landmark,
  Server,
  Cloud,
  RotateCcw,
  Mail,
  MessageCircle,
  Phone,
  Tag,
  Percent,
  BadgePercent,
  Bot
} from 'lucide-react';
import Link from 'next/link';
import {
  Coupon,
  couponsDatabase,
  createCoupon,
  toggleCouponStatus,
  deleteCoupon,
  validateCoupon,
  CouponValidationResult
} from '@/services/coupon-service';

interface SettingsPageProps {
  defaultTab?: string;
}

function SettingsPageInner({ defaultTab }: SettingsPageProps) {
  const { theme, setTheme, accentColor, setAccentColor, userLevel, setUserLevel, isAiBotEnabled, setIsAiBotEnabled } = useNexus();
  const searchParams = useSearchParams();

  // Quick Action Modal States
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Referral State
  const [copiedLink, setCopiedLink] = useState(false);
  const referralCode = 'NEXUS-ALEX-2026';
  const referralLink = `https://nexus.ai/ref/${referralCode}`;

  // Data Download State
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // Support Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Technical Issue');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Payment Gateways & APIs State
  const [razorpayKeyId, setRazorpayKeyId] = useState('rzp_test_9842aBcDeFgHiJ');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('••••••••••••••••••••••••');
  const [razorpayWebhook, setRazorpayWebhook] = useState('••••••••••••••••');
  const [razorpayMode, setRazorpayMode] = useState<'test' | 'live'>('test');
  const [currency, setCurrency] = useState('INR');
  const [stripePubKey, setStripePubKey] = useState('pk_test_51MzAbCdEfGhIjKlMnOpQrStUvWxYz');
  const [stripeSecretKey, setStripeSecretKey] = useState('••••••••••••••••••••••••');
  const [paymentSaveSuccess, setPaymentSaveSuccess] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);

  // Backup & Recovery State
  const [settingsBackups, setSettingsBackups] = useState([
    { id: 'bkp-1', name: 'PostgreSQL Core DB Snapshot', size: '14.8 MB', date: 'Today at 02:30 AM', status: 'Completed' },
    { id: 'bkp-2', name: 'Incremental Content & Rooms Snapshot', size: '12.4 MB', date: 'Yesterday at 02:30 AM', status: 'Completed' },
  ]);
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
  const [snapshotSuccessMsg, setSnapshotSuccessMsg] = useState<string | null>(null);

  // Coupon Management State
  const [couponsList, setCouponsList] = useState<Coupon[]>(couponsDatabase);
  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [newDiscountValue, setNewDiscountValue] = useState(25);
  const [newMaxUses, setNewMaxUses] = useState(500);
  const [newExpiryDate, setNewExpiryDate] = useState('2026-12-31');
  const [newMinOrder, setNewMinOrder] = useState(0);
  const [newApplicableTier, setNewApplicableTier] = useState('All');
  const [couponActionMsg, setCouponActionMsg] = useState<string | null>(null);

  // Live Coupon Tester State
  const [testCouponCode, setTestCouponCode] = useState('NEXUS50');
  const [testCoursePrice, setTestCoursePrice] = useState('₹4,999');
  const [testResult, setTestResult] = useState<CouponValidationResult | null>(null);

  // Update Payment Method State
  const [showUpdateCardModal, setShowUpdateCardModal] = useState(false);
  const [paymentMethodText, setPaymentMethodText] = useState('Visa ending in •••• 4242');
  const [newCardHolderName, setNewCardHolderName] = useState('John Doe');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCvv, setNewCardCvv] = useState('');
  const [newCardBrand, setNewCardBrand] = useState<'Visa' | 'Mastercard' | 'RuPay'>('Visa');
  const [newPaymentType, setNewPaymentType] = useState<'card' | 'upi'>('card');
  const [newUpiId, setNewUpiId] = useState('');
  const [cardUpdateSuccess, setCardUpdateSuccess] = useState(false);

  // AI Bot Controls (Admin) State
  const [adminAiBotMaster, setAdminAiBotMaster] = useState(isAiBotEnabled);
  const [enableOllamaChat, setEnableOllamaChat] = useState(true);
  const [enableModelTrainer, setEnableModelTrainer] = useState(true);
  const [enableCodeHints, setEnableCodeHints] = useState(true);
  const [enableAntiCheatAi, setEnableAntiCheatAi] = useState(true);
  const [enableCopilotWidget, setEnableCopilotWidget] = useState(true);
  const [defaultAdminModel, setDefaultAdminModel] = useState('llama3.2');
  const [maxTokensPerRequest, setMaxTokensPerRequest] = useState(2048);
  const [hourlyRateLimit, setHourlyRateLimit] = useState(50);
  const [offlineMaintenanceMsg, setOfflineMaintenanceMsg] = useState('AI Bot is temporarily disabled by administrator for scheduled cluster maintenance.');
  const [aiBotSaveSuccess, setAiBotSaveSuccess] = useState(false);

  // Tab mapping for URL parameter lookup
  const tabMap: Record<string, string> = useMemo(() => ({
    profile: 'Profile',
    account: 'Profile',
    preferences: 'Preferences',
    coupons: 'Coupons & Promo Codes',
    'ai-bot': 'AI Bot Controls (Admin)',
    notifications: 'Notifications',
    security: 'Privacy & Security',
    billing: 'Billing & Plan',
    'payment-gateways': 'Payment Gateways & APIs',
    'email-whatsapp': 'Email & WhatsApp APIs',
    'backup-recovery': 'Backup & Recovery',
    accounts: 'Connected Accounts',
  }), []);

  const reverseTabMap: Record<string, string> = useMemo(() => ({
    'Profile': 'profile',
    'Preferences': 'preferences',
    'Coupons & Promo Codes': 'coupons',
    'AI Bot Controls (Admin)': 'ai-bot',
    'Notifications': 'notifications',
    'Privacy & Security': 'security',
    'Billing & Plan': 'billing',
    'Payment Gateways & APIs': 'payment-gateways',
    'Email & WhatsApp APIs': 'email-whatsapp',
    'Backup & Recovery': 'backup-recovery',
    'Connected Accounts': 'accounts',
  }), []);

  // Single Source of Truth: Compute activeTab directly from searchParams or defaultTab
  const activeTab = useMemo(() => {
    const tabParam = searchParams?.get('tab');
    if (tabParam && tabMap[tabParam]) {
      return tabMap[tabParam];
    }
    if (defaultTab && (tabMap[defaultTab] || Object.values(tabMap).includes(defaultTab))) {
      return tabMap[defaultTab] || defaultTab;
    }
    return 'Profile';
  }, [searchParams, defaultTab, tabMap]);

  // Profile Form State
  const [fullName, setFullName] = useState('Expert Learner');
  const [username, setUsername] = useState('expert.learner');
  const [email, setEmail] = useState('expert.learner@nexus.ai');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [bio, setBio] = useState('Passionate about AI research, LLM architectures, and building intelligent agentic systems.');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Preferences State
  const [preferredLang, setPreferredLang] = useState('en');
  const [dailyGoal, setDailyGoal] = useState('120');
  const [aiRecs, setAiRecs] = useState(true);

  // Notifications State
  const [emailNotifs, setEmailNotifs] = useState({
    courses: true,
    weekly: true,
    community: false,
    security: true,
  });

  // Security State
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Connected Accounts State
  const [connectedAccounts, setConnectedAccounts] = useState([
    { name: 'GitHub', username: '@alex-rivera-ai', status: 'Connected' },
    { name: 'Google Workspace', username: 'alex@nexus.ai', status: 'Connected' },
    { name: 'Hugging Face', username: 'alex_rivera_hf', status: 'Connected' },
    { name: 'Weights & Biases (W&B)', username: 'alex-wandb', status: 'Connected' },
    { name: 'LinkedIn', username: 'Not connected', status: 'Disconnected' },
  ]);

  const accents: { name: AccentColor; color: string }[] = [
    { name: 'purple', color: '#7c3aed' },
    { name: 'blue', color: '#3b82f6' },
    { name: 'emerald', color: '#10b981' },
    { name: 'amber', color: '#f59e0b' },
    { name: 'rose', color: '#f43f5e' },
    { name: 'cyan', color: '#06b6d4' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleAccountConnection = (accountName: string) => {
    setConnectedAccounts((prev) =>
      prev.map((acc) =>
        acc.name === accountName
          ? {
              ...acc,
              status: acc.status === 'Connected' ? 'Disconnected' : 'Connected',
              username: acc.status === 'Connected' ? 'Not connected' : `@${username}`,
            }
          : acc
      )
    );
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleGenerateExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
    }, 2000);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setShowSupportModal(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 3000);
  };

  const handleSavePaymentGateways = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPayment(true);
    try {
      await fetch('/api/settings/payment-gateways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay: {
            enabled: true,
            keyId: razorpayKeyId,
            keySecret: razorpayKeySecret,
            webhookSecret: razorpayWebhook,
            mode: razorpayMode,
            currency,
          },
          stripe: {
            enabled: true,
            publishableKey: stripePubKey,
            secretKey: stripeSecretKey,
          },
        }),
      });
      setPaymentSaveSuccess(true);
      setTimeout(() => setPaymentSaveSuccess(false), 3500);
    } catch (err) {
      alert('Failed to update payment gateway settings');
    } finally {
      setIsSavingPayment(false);
    }
  };

  const handleCreateSettingsSnapshot = async () => {
    setIsCreatingSnapshot(true);
    setSnapshotSuccessMsg(null);
    try {
      const res = await fetch('/api/system/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'Full System Snapshot (Settings)' }),
      });
      const json = await res.json();
      if (json.data) {
        setSettingsBackups((prev) => [
          {
            id: json.data.id,
            name: json.data.name,
            size: json.data.size,
            date: json.data.createdAt,
            status: 'Completed',
          },
          ...prev,
        ]);
        setSnapshotSuccessMsg(`Database snapshot '${json.data.name}' generated!`);

        if (json.data.snapshotData) {
          const blob = new Blob([JSON.stringify(json.data.snapshotData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `nexus-db-snapshot-${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    } catch (err) {
      alert('Failed to generate snapshot');
    } finally {
      setIsCreatingSnapshot(false);
      setTimeout(() => setSnapshotSuccessMsg(null), 4000);
    }
  };

  const handleDownloadSettingsBackup = (b: any) => {
    const blob = new Blob([JSON.stringify({ backupId: b.id, name: b.name, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${b.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreSettingsBackup = (b: any) => {
    if (confirm(`Simulate restoring from '${b.name}'?`)) {
      setSnapshotSuccessMsg(`Restored snapshot from '${b.name}' successfully!`);
      setTimeout(() => setSnapshotSuccessMsg(null), 4000);
    }
  };

  return (
    <NexusShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Settings</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your profile, learning preferences, notifications, security, billing, payment gateways, and system backups.
          </p>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-border pb-2 overflow-x-auto scrollbar-none">
          {[
            'Profile',
            'Preferences',
            'Coupons & Promo Codes',
            'AI Bot Controls (Admin)',
            'Notifications',
            'Privacy & Security',
            'Billing & Plan',
            'Payment Gateways & APIs',
            'Email & WhatsApp APIs',
            'Backup & Recovery',
            'Connected Accounts',
          ].map((tab) => {
            const paramKey = reverseTabMap[tab] || 'profile';
            const isSelected = activeTab === tab;
            return (
              <Link
                key={tab}
                href={`/settings?tab=${paramKey}`}
                scroll={false}
                className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {tab}
              </Link>
            );
          })}
        </div>

        {/* Success Feedback Alert */}
        {saveSuccess && (
          <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Settings updated successfully! Changes applied globally across AI Nexus.</span>
          </div>
        )}

        {/* Main Grid: Form Content (Left 8 Cols) + Sidebar Summary (Right 4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* ==================== TAB 1: PROFILE ==================== */}
            {activeTab === 'Profile' && (
              <Card className="p-6 bg-card border-border rounded-2xl space-y-5">
                <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">Profile Information</h2>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-purple-900/30">
                    EL
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{fullName}</h3>
                    <span className="text-xs text-purple-400 capitalize font-semibold">{userLevel} Learner</span>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-foreground mb-1.5">Full Name</label>
                      <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-secondary border-border text-foreground text-xs h-9" />
                    </div>
                    <div>
                      <label className="block font-semibold text-foreground mb-1.5">Username</label>
                      <Input value={username} onChange={(e) => setUsername(e.target.value)} className="bg-secondary border-border text-foreground text-xs h-9" />
                    </div>
                    <div>
                      <label className="block font-semibold text-foreground mb-1.5">Email Address</label>
                      <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary border-border text-foreground text-xs h-9" />
                    </div>
                    <div>
                      <label className="block font-semibold text-foreground mb-1.5">Phone Number</label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-secondary border-border text-foreground text-xs h-9" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1.5">Bio</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-3 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-5 py-2 h-9 rounded-xl shadow-sm shadow-purple-900/30">
                      Save Profile Changes
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* ==================== TAB 2: PREFERENCES ==================== */}
            {activeTab === 'Preferences' && (
              <Card className="p-6 bg-card border-border rounded-2xl space-y-6">
                <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">Learning & Content Preferences</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-foreground mb-1.5">Default Learning Level</label>
                    <select
                      value={userLevel}
                      onChange={(e) => setUserLevel(e.target.value as UserLevel)}
                      className="w-full h-9 px-3 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none capitalize"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1.5">Preferred Language</label>
                    <select
                      value={preferredLang}
                      onChange={(e) => setPreferredLang(e.target.value)}
                      className="w-full h-9 px-3 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                    >
                      <option value="en">English (EN)</option>
                      <option value="es">Español (ES)</option>
                      <option value="fr">Français (FR)</option>
                      <option value="de">Deutsch (DE)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1.5">Daily Learning Goal</label>
                    <select
                      value={dailyGoal}
                      onChange={(e) => setDailyGoal(e.target.value)}
                      className="w-full h-9 px-3 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                    >
                      <option value="30">30 min / day</option>
                      <option value="60">60 min / day</option>
                      <option value="120">120 min / day (Recommended)</option>
                    </select>
                  </div>
                </div>

                {/* Appearance & Theme Selector */}
                <div className="space-y-3 pt-2 text-xs border-t border-border">
                  <span className="font-bold text-foreground block">Appearance & Color Theme</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { mode: 'dark' as ThemeMode, label: 'Dark Mode', icon: Moon, desc: 'Midnight Cyberpunk with sleek glass accents' },
                      { mode: 'light' as ThemeMode, label: 'Light / White Mode', icon: Sun, desc: 'Crisp pearl canvas with vibrant contrast' },
                      { mode: 'system' as ThemeMode, label: 'System Auto', icon: Laptop, desc: 'Matches your operating system theme' },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = theme === item.mode;
                      return (
                        <button
                          key={item.mode}
                          type="button"
                          onClick={() => setTheme(item.mode)}
                          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-purple-600/15 border-purple-500 shadow-md shadow-purple-950/20 text-foreground'
                              : 'bg-secondary/40 border-border hover:border-purple-500/40 text-muted-foreground'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 rounded-xl ${isSelected ? 'bg-purple-600 text-white' : 'bg-secondary text-foreground'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                          </div>
                          <h4 className="font-bold text-foreground text-xs">{item.label}</h4>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Accent Color Palette */}
                <div className="space-y-3 pt-2 text-xs border-t border-border">
                  <span className="font-bold text-foreground block">Brand Accent Highlights</span>
                  <div className="flex items-center gap-3 flex-wrap">
                    {accents.map((acc) => {
                      const isSelected = accentColor === acc.name;
                      return (
                        <button
                          key={acc.name}
                          type="button"
                          onClick={() => setAccentColor(acc.name)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                            isSelected ? 'bg-secondary border-foreground text-foreground shadow-sm' : 'bg-card border-border text-muted-foreground hover:border-border'
                          }`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: acc.color }} />
                          <span>{acc.name}</span>
                          {isSelected && <Check className="w-3 h-3 text-foreground" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs border-t border-border">
                  <span className="font-bold text-foreground block">AI Recommendation Engine</span>
                  <div className="p-4 bg-secondary/50 border border-border rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-foreground block">Smart AI Path Recommendations</span>
                      <span className="text-[11px] text-muted-foreground">Tailor courses and research papers dynamically based on your quiz performance.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={aiRecs}
                      onChange={(e) => setAiRecs(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* ==================== TAB: COUPONS & PROMO CODES ==================== */}
            {activeTab === 'Coupons & Promo Codes' && (
              <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="p-4 bg-card border-border rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Active Promo Codes</span>
                      <Tag className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-2xl font-extrabold text-foreground">
                      {couponsList.filter((c) => c.isActive).length}
                    </div>
                    <p className="text-[11px] text-emerald-400 font-medium">Ready for immediate checkout</p>
                  </Card>

                  <Card className="p-4 bg-card border-border rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Total Redemptions</span>
                      <BadgePercent className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-extrabold text-foreground">
                      {couponsList.reduce((acc, c) => acc + c.usedCount, 0).toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-muted-foreground">Across all certification tracks</p>
                  </Card>

                  <Card className="p-4 bg-card border-border rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Student Savings Generated</span>
                      <Gift className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-400">
                      ₹18.4 Lakhs
                    </div>
                    <p className="text-[11px] text-purple-400 font-medium">Scholarships & discounts granted</p>
                  </Card>
                </div>

                {couponActionMsg && (
                  <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{couponActionMsg}</span>
                  </div>
                )}

                {/* Coupon Management Card */}
                <Card className="p-6 bg-card border-border rounded-2xl space-y-6 text-xs">
                  <div className="flex items-center justify-between border-b border-border pb-4 flex-wrap gap-3">
                    <div>
                      <h3 className="text-base font-bold text-foreground">Coupon & Promo Code Directory</h3>
                      <p className="text-muted-foreground text-[11px]">Create discount codes, configure percentage/flat deductions, and track redemption quotas.</p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => setShowCreateCouponModal(!showCreateCouponModal)}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-950/40"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Coupon</span>
                    </Button>
                  </div>

                  {/* Create Coupon Drawer / Inline Form */}
                  {showCreateCouponModal && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!newCouponCode.trim()) return;
                        const created = await createCoupon({
                          code: newCouponCode,
                          description: newCouponDesc || 'Special Promotional Discount',
                          discountType: newDiscountType,
                          discountValue: Number(newDiscountValue),
                          maxUses: Number(newMaxUses),
                          expiryDate: newExpiryDate,
                          minOrderAmount: Number(newMinOrder),
                          applicableTier: newApplicableTier,
                          isActive: true,
                        });
                        setCouponsList([created, ...couponsList]);
                        setShowCreateCouponModal(false);
                        setNewCouponCode('');
                        setNewCouponDesc('');
                        setCouponActionMsg(`Coupon code "${created.code}" created successfully!`);
                        setTimeout(() => setCouponActionMsg(null), 3500);
                      }}
                      className="p-5 bg-secondary/40 border border-purple-500/30 rounded-2xl space-y-4"
                    >
                      <h4 className="font-bold text-foreground text-xs flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" /> New Coupon Generator
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-foreground font-semibold mb-1">Coupon Code</label>
                          <Input
                            type="text"
                            required
                            value={newCouponCode}
                            onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                            placeholder="e.g. FESTIVE60"
                            className="bg-card border-border text-foreground text-xs uppercase font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-foreground font-semibold mb-1">Discount Type</label>
                          <select
                            value={newDiscountType}
                            onChange={(e) => setNewDiscountType(e.target.value as any)}
                            className="w-full h-9 px-3 bg-card border border-border rounded-xl text-xs text-foreground focus:outline-none"
                          >
                            <option value="percentage">Percentage (%) Off</option>
                            <option value="flat">Flat Amount (₹ INR) Off</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-foreground font-semibold mb-1">
                            {newDiscountType === 'percentage' ? 'Percentage (1-100%)' : 'Flat Value (₹)'}
                          </label>
                          <Input
                            type="number"
                            required
                            min={1}
                            max={newDiscountType === 'percentage' ? 100 : 100000}
                            value={newDiscountValue}
                            onChange={(e) => setNewDiscountValue(Number(e.target.value))}
                            className="bg-card border-border text-foreground text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-foreground font-semibold mb-1">Max Redemptions</label>
                          <Input
                            type="number"
                            min={1}
                            value={newMaxUses}
                            onChange={(e) => setNewMaxUses(Number(e.target.value))}
                            className="bg-card border-border text-foreground text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-foreground font-semibold mb-1">Expiry Date</label>
                          <Input
                            type="date"
                            value={newExpiryDate}
                            onChange={(e) => setNewExpiryDate(e.target.value)}
                            className="bg-card border-border text-foreground text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-foreground font-semibold mb-1">Min Order Value (₹)</label>
                          <Input
                            type="number"
                            min={0}
                            value={newMinOrder}
                            onChange={(e) => setNewMinOrder(Number(e.target.value))}
                            className="bg-card border-border text-foreground text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-foreground font-semibold mb-1">Description / Campaign Purpose</label>
                        <Input
                          type="text"
                          value={newCouponDesc}
                          onChange={(e) => setNewCouponDesc(e.target.value)}
                          placeholder="e.g. Diwali AI Hackathon Winner 60% Scholarship"
                          className="bg-card border-border text-foreground text-xs"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCreateCouponModal(false)}
                          className="bg-card border-border text-foreground text-xs px-3 py-1.5 h-8 rounded-xl cursor-pointer"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-1.5 h-8 rounded-xl cursor-pointer"
                        >
                          Publish Coupon
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* Active Coupons Table */}
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-secondary/60 text-muted-foreground font-semibold border-b border-border">
                        <tr>
                          <th className="p-3">Coupon Code</th>
                          <th className="p-3">Discount</th>
                          <th className="p-3">Redemption Quota</th>
                          <th className="p-3">Min Order</th>
                          <th className="p-3">Expiry</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-foreground">
                        {couponsList.map((c) => (
                          <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                            <td className="p-3 font-mono font-bold text-purple-400">
                              <div className="flex items-center gap-1.5">
                                <span>{c.code}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(c.code);
                                    setCouponActionMsg(`Copied "${c.code}" to clipboard!`);
                                    setTimeout(() => setCouponActionMsg(null), 3000);
                                  }}
                                  className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground cursor-pointer"
                                  title="Copy Code"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                              <span className="block text-[10px] text-muted-foreground font-sans font-normal truncate max-w-[200px]">
                                {c.description}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-emerald-400">
                              {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue.toLocaleString('en-IN')} FLAT`}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{c.usedCount}</span>
                                <span className="text-muted-foreground">/ {c.maxUses}</span>
                              </div>
                              <div className="w-24 bg-secondary h-1.5 rounded-full overflow-hidden mt-1">
                                <div
                                  className="bg-purple-500 h-full rounded-full"
                                  style={{ width: `${Math.min(100, (c.usedCount / c.maxUses) * 100)}%` }}
                                />
                              </div>
                            </td>
                            <td className="p-3 text-muted-foreground">
                              {c.minOrderAmount > 0 ? `₹${c.minOrderAmount.toLocaleString('en-IN')}` : 'None (₹0)'}
                            </td>
                            <td className="p-3 font-mono text-[11px] text-muted-foreground">
                              {c.expiryDate}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                c.isActive
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
                              }`}>
                                {c.isActive ? 'ACTIVE' : 'PAUSED'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={async () => {
                                    await toggleCouponStatus(c.id);
                                    setCouponsList(couponsList.map((item) => item.id === c.id ? { ...item, isActive: !item.isActive } : item));
                                    setCouponActionMsg(`Coupon "${c.code}" is now ${!c.isActive ? 'Active' : 'Paused'}.`);
                                    setTimeout(() => setCouponActionMsg(null), 3000);
                                  }}
                                  className="text-[10px] h-7 px-2.5 rounded-lg border-border text-foreground hover:bg-secondary cursor-pointer"
                                >
                                  {c.isActive ? 'Pause' : 'Activate'}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={async () => {
                                    if (confirm(`Delete coupon "${c.code}"?`)) {
                                      await deleteCoupon(c.id);
                                      setCouponsList(couponsList.filter((item) => item.id !== c.id));
                                      setCouponActionMsg(`Coupon "${c.code}" deleted.`);
                                      setTimeout(() => setCouponActionMsg(null), 3000);
                                    }
                                  }}
                                  className="text-[10px] h-7 px-2 rounded-lg border-border text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Interactive Coupon Validation Simulator */}
                  <div className="p-4 bg-secondary/30 border border-border rounded-2xl space-y-3">
                    <h4 className="font-bold text-foreground text-xs flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-purple-400" /> Live Coupon Validation Tester
                    </h4>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="w-full sm:w-1/3">
                        <label className="block text-[11px] text-muted-foreground mb-1">Test Coupon Code</label>
                        <Input
                          type="text"
                          value={testCouponCode}
                          onChange={(e) => setTestCouponCode(e.target.value.toUpperCase())}
                          placeholder="e.g. NEXUS50"
                          className="bg-card border-border text-foreground text-xs uppercase font-mono font-bold"
                        />
                      </div>
                      <div className="w-full sm:w-1/3">
                        <label className="block text-[11px] text-muted-foreground mb-1">Course Price</label>
                        <Input
                          type="text"
                          value={testCoursePrice}
                          onChange={(e) => setTestCoursePrice(e.target.value)}
                          placeholder="e.g. ₹4,999"
                          className="bg-card border-border text-foreground text-xs font-mono"
                        />
                      </div>
                      <div className="w-full sm:w-1/3 pt-4 sm:pt-4">
                        <Button
                          type="button"
                          onClick={() => {
                            const res = validateCoupon(testCouponCode, testCoursePrice);
                            setTestResult(res);
                          }}
                          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-9 rounded-xl cursor-pointer"
                        >
                          Simulate Checkout Discount
                        </Button>
                      </div>
                    </div>

                    {testResult && (
                      <div className={`p-3 rounded-xl border text-xs ${
                        testResult.isValid
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}>
                        {testResult.isValid ? (
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span>
                              ✅ Valid! Applied <strong>{testResult.formattedDiscount}</strong> on {testCoursePrice}.
                            </span>
                            <span className="font-bold font-mono text-sm text-foreground">
                              Payable: ₹{testResult.finalPrice.toLocaleString('en-IN')} (Saved ₹{testResult.discountAmount.toLocaleString('en-IN')})
                            </span>
                          </div>
                        ) : (
                          <span>❌ {testResult.error}</span>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* ==================== TAB: AI BOT CONTROLS (ADMIN) ==================== */}
            {activeTab === 'AI Bot Controls (Admin)' && (
              <div className="space-y-6">
                <Card className="p-6 bg-card border-border rounded-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                    <div>
                      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                        <Bot className="w-5 h-5 text-purple-400" />
                        <span>AI Bot & Assistant Controls (Admin Panel)</span>
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Manage global AI availability, Ollama local inference engines, fine-tuning studio access, and student guardrails.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          adminAiBotMaster
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            adminAiBotMaster ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                          }`}
                        />
                        <span>{adminAiBotMaster ? 'AI Bot Enabled' : 'AI Bot Disabled'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Master Enable / Disable Banner */}
                  <div className="p-5 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="font-bold text-sm text-foreground block">
                        Master AI Bot & Copilot Availability
                      </span>
                      <p className="text-xs text-muted-foreground">
                        When disabled, all student AI chatbots, live hint synthesizers, and Ollama execution endpoints are suspended immediately.
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={() => setAdminAiBotMaster(!adminAiBotMaster)}
                      className={`text-xs font-bold px-5 h-10 rounded-xl transition-all cursor-pointer ${
                        adminAiBotMaster
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/40'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                      }`}
                    >
                      {adminAiBotMaster ? 'Disable AI Bot' : 'Enable AI Bot'}
                    </Button>
                  </div>

                  {/* Granular Sub-Features */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-foreground block">Granular Feature Toggles:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        {
                          title: 'Ollama Q&A Chatbot (/ollama)',
                          desc: 'Interactive chat interface with open LLMs (LLaMA 3.2, DeepSeek-R1).',
                          enabled: enableOllamaChat,
                          toggle: () => setEnableOllamaChat(!enableOllamaChat),
                        },
                        {
                          title: 'LoRA Model Fine-Tuning Studio',
                          desc: 'Custom dataset upload, Modelfile generation, and loss visualizer.',
                          enabled: enableModelTrainer,
                          toggle: () => setEnableModelTrainer(!enableModelTrainer),
                        },
                        {
                          title: 'Student Code Hint Generator',
                          desc: 'Automated AI pair-programming hints in collaborative challenge rooms.',
                          enabled: enableCodeHints,
                          toggle: () => setEnableCodeHints(!enableCodeHints),
                        },
                        {
                          title: 'Proctored Anti-Cheat AI Vision',
                          desc: 'Face tracking, gaze verification, and anomaly detection during exams.',
                          enabled: enableAntiCheatAi,
                          toggle: () => setEnableAntiCheatAi(!enableAntiCheatAi),
                        },
                        {
                          title: 'Floating Copilot Assistant Widget',
                          desc: 'Global floating assistant widget accessible on every course page.',
                          enabled: enableCopilotWidget,
                          toggle: () => setEnableCopilotWidget(!enableCopilotWidget),
                        },
                      ].map((feat) => (
                        <div
                          key={feat.title}
                          className="p-4 bg-secondary/50 border border-border rounded-xl flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-foreground block">{feat.title}</span>
                            <span className="text-[11px] text-muted-foreground">{feat.desc}</span>
                          </div>
                          <button
                            type="button"
                            onClick={feat.toggle}
                            disabled={!adminAiBotMaster}
                            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                              !adminAiBotMaster
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                : feat.enabled
                                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                                : 'bg-secondary text-muted-foreground border border-border'
                            }`}
                          >
                            {feat.enabled && adminAiBotMaster ? 'ON' : 'OFF'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Guardrails & Policies */}
                  <div className="pt-4 border-t border-border space-y-4">
                    <span className="text-xs font-bold text-foreground block">Model Governance & Rate Limits:</span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="text-muted-foreground block text-[11px]">Default Student Base Model:</label>
                        <select
                          value={defaultAdminModel}
                          onChange={(e) => setDefaultAdminModel(e.target.value)}
                          className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-purple-500"
                        >
                          <option value="llama3.2">LLaMA 3.2 (Meta - 3B)</option>
                          <option value="mistral">Mistral 7B Instruct</option>
                          <option value="deepseek-r1">DeepSeek-R1 (Distill 7B)</option>
                          <option value="qwen2.5-coder">Qwen 2.5 Coder (7B)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-muted-foreground block text-[11px]">Max Generation Tokens:</label>
                        <select
                          value={maxTokensPerRequest}
                          onChange={(e) => setMaxTokensPerRequest(parseInt(e.target.value))}
                          className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-purple-500 font-mono"
                        >
                          <option value={1024}>1,024 Tokens (~750 words)</option>
                          <option value={2048}>2,048 Tokens (Recommended)</option>
                          <option value={4096}>4,096 Tokens (Extended)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-muted-foreground block text-[11px]">Hourly Prompt Rate Limit:</label>
                        <select
                          value={hourlyRateLimit}
                          onChange={(e) => setHourlyRateLimit(parseInt(e.target.value))}
                          className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-purple-500 font-mono"
                        >
                          <option value={20}>20 Prompts / Hour</option>
                          <option value={50}>50 Prompts / Hour (Default)</option>
                          <option value={100}>100 Prompts / Hour</option>
                          <option value={9999}>Unlimited</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-muted-foreground block text-[11px]">Offline / Maintenance Banner Notice:</label>
                      <Input
                        value={offlineMaintenanceMsg}
                        onChange={(e) => setOfflineMaintenanceMsg(e.target.value)}
                        placeholder="Notice shown to students when AI Bot is disabled..."
                        className="bg-secondary border-border text-xs h-9"
                      />
                    </div>
                  </div>

                  {/* Feedback Message */}
                  {aiBotSaveSuccess && (
                    <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>AI Bot admin configuration updated and saved globally!</span>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border">
                    <Link
                      href="/ollama"
                      className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1.5"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Test AI Bot in Ollama Studio</span>
                    </Link>

                    <Button
                      type="button"
                      onClick={() => {
                        setIsAiBotEnabled(adminAiBotMaster);
                        setAiBotSaveSuccess(true);
                        setTimeout(() => setAiBotSaveSuccess(false), 3000);
                      }}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-6 h-9 rounded-xl shadow-md shadow-purple-900/40 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      <span>Save AI Bot Settings</span>
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* ==================== TAB 3: NOTIFICATIONS ==================== */}
            {activeTab === 'Notifications' && (
              <Card className="p-6 bg-card border-border rounded-2xl space-y-6">
                <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">Notification Settings</h2>

                <div className="space-y-4 text-xs">
                  <span className="font-bold text-foreground block">Email Notifications</span>
                  <div className="space-y-2">
                    {[
                      { key: 'courses', label: 'New Course & Algorithm Releases', desc: 'Get notified when new deep learning modules are published.' },
                      { key: 'weekly', label: 'Weekly Learning Summary Digest', desc: 'Receive weekly reports on your study streaks and quiz scores.' },
                      { key: 'security', label: 'Security & Account Alerts', desc: 'Critical login attempt notifications and 2FA alerts.' },
                    ].map((item) => (
                      <div key={item.key} className="p-3.5 bg-secondary/50 border border-border rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-bold text-foreground block">{item.label}</span>
                          <span className="text-[11px] text-muted-foreground">{item.desc}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={(emailNotifs as any)[item.key]}
                          onChange={(e) => setEmailNotifs({ ...emailNotifs, [item.key]: e.target.checked })}
                          className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* ==================== TAB 4: PRIVACY & SECURITY ==================== */}
            {activeTab === 'Privacy & Security' && (
              <div className="space-y-6">
                {/* 2FA Card */}
                <Card className="p-6 bg-card border-border rounded-2xl space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h3 className="font-bold text-foreground">Two-Factor Authentication (2FA)</h3>
                        <span className="text-[11px] text-emerald-400 font-semibold">2FA Protection Enabled</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                      variant={is2FAEnabled ? 'outline' : 'default'}
                      className={`text-xs h-8 px-3 rounded-xl ${
                        is2FAEnabled ? 'bg-secondary border-border text-rose-400 hover:bg-rose-500/20' : 'bg-purple-600 text-white'
                      }`}
                    >
                      {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </Button>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Protect your AI Nexus account with Google Authenticator or 1Password. An extra layer of security prevents unauthorized administrative access.
                  </p>
                </Card>

                {/* Password Update Card */}
                <Card className="p-6 bg-card border-border rounded-2xl space-y-4 text-xs">
                  <h3 className="font-bold text-foreground border-b border-border pb-3">Change Password</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block font-semibold text-foreground mb-1">Current Password</label>
                      <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="bg-secondary border-border text-foreground text-xs h-9" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-foreground mb-1">New Password</label>
                        <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-secondary border-border text-foreground text-xs h-9" />
                      </div>
                      <div>
                        <label className="block font-semibold text-foreground mb-1">Confirm New Password</label>
                        <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-secondary border-border text-foreground text-xs h-9" />
                      </div>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-8 px-4 rounded-xl shadow-sm shadow-purple-900/30">
                      Update Password
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* ==================== TAB 5: BILLING & PLAN ==================== */}
            {activeTab === 'Billing & Plan' && (
              <div className="space-y-6">
                {cardUpdateSuccess && (
                  <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-semibold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Payment method updated successfully! Next invoice will bill to {paymentMethodText}.</span>
                  </div>
                )}

                <Card className="p-6 bg-card border-border rounded-2xl space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold font-mono rounded-lg">
                        Active Membership
                      </span>
                      <h3 className="text-base font-bold text-foreground mt-1">AI Nexus Pro Plan</h3>
                    </div>
                    <span className="font-mono text-lg font-bold text-emerald-400">₹2,499 / month</span>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    Unlimited access to 50+ deep learning courses, GPU model training cloud, vector database sandboxes, and verified certificates.
                  </p>

                  <div className="p-3 bg-secondary/50 border border-border rounded-xl flex items-center justify-between">
                    <span className="font-semibold text-foreground">Payment Method: {paymentMethodText}</span>
                    <Button
                      variant="outline"
                      onClick={() => setShowUpdateCardModal(true)}
                      className="bg-secondary border-border text-foreground text-xs h-7 px-3 rounded-lg hover:bg-secondary/80 cursor-pointer"
                    >
                      Update Card
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* ==================== TAB 6: PAYMENT GATEWAYS & APIS (RAZORPAY / STRIPE) ==================== */}
            {activeTab === 'Payment Gateways & APIs' && (
              <div className="space-y-6">
                {paymentSaveSuccess && (
                  <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Payment Gateway API keys and credentials saved successfully!</span>
                  </div>
                )}

                {/* Razorpay Gateway Card */}
                <Card className="p-6 bg-card border-border rounded-2xl space-y-5 text-xs">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold font-mono text-sm">
                        ₹
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">Razorpay Payment Gateway (India & Global)</h3>
                        <p className="text-[11px] text-muted-foreground">UPI, Credit/Debit Cards, NetBanking, and Auto-Invoicing</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-lg border ${
                        razorpayMode === 'live' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {razorpayMode.toUpperCase()} MODE
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSavePaymentGateways} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-foreground mb-1">Razorpay Key ID</label>
                        <Input
                          value={razorpayKeyId}
                          onChange={(e) => setRazorpayKeyId(e.target.value)}
                          placeholder="rzp_live_..."
                          className="bg-secondary border-border text-foreground font-mono text-xs h-9"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-foreground mb-1">Razorpay Key Secret</label>
                        <Input
                          type="password"
                          value={razorpayKeySecret}
                          onChange={(e) => setRazorpayKeySecret(e.target.value)}
                          placeholder="••••••••••••••••"
                          className="bg-secondary border-border text-foreground font-mono text-xs h-9"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-foreground mb-1">Webhook Secret</label>
                        <Input
                          type="password"
                          value={razorpayWebhook}
                          onChange={(e) => setRazorpayWebhook(e.target.value)}
                          placeholder="••••••••••••••••"
                          className="bg-secondary border-border text-foreground font-mono text-xs h-9"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-foreground mb-1">Environment Mode</label>
                        <select
                          value={razorpayMode}
                          onChange={(e) => setRazorpayMode(e.target.value as 'test' | 'live')}
                          className="w-full h-9 px-3 bg-secondary border border-border rounded-xl text-xs text-foreground font-semibold focus:outline-none"
                        >
                          <option value="test">Test / Sandbox Mode</option>
                          <option value="live">Production / Live Mode</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>256-bit encrypted API secret storage</span>
                      </div>
                      <Button
                        type="submit"
                        disabled={isSavingPayment}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-9 px-5 rounded-xl shadow-md shadow-blue-900/30 cursor-pointer"
                      >
                        {isSavingPayment ? 'Saving Gateway...' : 'Save Razorpay Credentials'}
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* Stripe Card */}
                <Card className="p-6 bg-card border-border rounded-2xl space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold font-mono text-sm">
                        $
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">Stripe Gateway (International USD/EUR)</h3>
                        <p className="text-[11px] text-muted-foreground">Global credit cards, Apple Pay, and subscription billing</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded">
                      Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-foreground mb-1">Stripe Publishable Key</label>
                      <Input
                        value={stripePubKey}
                        onChange={(e) => setStripePubKey(e.target.value)}
                        className="bg-secondary border-border text-foreground font-mono text-xs h-9"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-foreground mb-1">Default Settlement Currency</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full h-9 px-3 bg-secondary border border-border rounded-xl text-xs text-foreground font-semibold focus:outline-none"
                      >
                        <option value="INR">INR (₹) - Indian Rupee</option>
                        <option value="USD">USD ($) - US Dollar</option>
                        <option value="EUR">EUR (€) - Euro</option>
                      </select>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* ==================== TAB 7: EMAIL & WHATSAPP APIS ==================== */}
            {activeTab === 'Email & WhatsApp APIs' && (
              <div className="space-y-6">
                <Card className="p-6 bg-card border-border rounded-2xl space-y-6 text-xs shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-foreground">Email &amp; WhatsApp Communication APIs</h3>
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] font-mono font-bold rounded border border-purple-500/30">
                          Automated Invoicing &amp; Reminders
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Configure SendGrid/SMTP and Meta WhatsApp Cloud API credentials to dispatch instant PDF invoices and payment reminders.
                      </p>
                    </div>

                    <Link href="/payment-reports">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-8 px-3.5 rounded-xl gap-1.5 cursor-pointer">
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Payment Reports</span>
                      </Button>
                    </Link>
                  </div>

                  {/* Section 1: Email Configuration */}
                  <div className="p-5 rounded-2xl bg-secondary/50 border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-foreground font-bold">
                        <Mail className="w-4 h-4 text-purple-400" />
                        <span>Email Gateway (SendGrid / SMTP / Resend)</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Connected &amp; Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-foreground">Email Provider</label>
                        <select className="w-full bg-secondary border border-border text-foreground text-xs font-semibold rounded-xl p-2.5 focus:outline-none focus:border-purple-500 cursor-pointer">
                          <option value="SendGrid">SendGrid (Twilio) - Recommended</option>
                          <option value="Resend">Resend API</option>
                          <option value="AWS SES">Amazon Simple Email Service (SES)</option>
                          <option value="SMTP">Custom SMTP Server</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-foreground">Sender Email Address</label>
                        <Input defaultValue="billing@nexusai.education" className="text-xs bg-secondary border-border" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-foreground">Sender Display Name</label>
                        <Input defaultValue="Nexus AI Billing & Finance" className="text-xs bg-secondary border-border" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-foreground">API Key / SMTP Token</label>
                        <Input type="password" defaultValue="SG.LiveProductionKey_89410294810284" className="text-xs bg-secondary border-border font-mono" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <Button
                        onClick={() => alert('Test invoice email dispatched to billing@nexusai.education!')}
                        variant="outline"
                        className="bg-secondary border-border hover:bg-secondary/80 text-foreground text-xs font-semibold h-8 px-3.5 rounded-xl gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-purple-400" />
                        <span>Send Test Invoice Email</span>
                      </Button>
                    </div>
                  </div>

                  {/* Section 2: WhatsApp Business API Configuration */}
                  <div className="p-5 rounded-2xl bg-secondary/50 border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-foreground font-bold">
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span>WhatsApp Business Cloud API (Meta Graph API)</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Meta Verified Account
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-foreground">WhatsApp Provider</label>
                        <select className="w-full bg-secondary border border-border text-foreground text-xs font-semibold rounded-xl p-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer">
                          <option value="Meta">Meta WhatsApp Cloud API (Graph v20.0)</option>
                          <option value="Twilio">Twilio WhatsApp Messaging API</option>
                          <option value="Gupshup">Gupshup Enterprise WhatsApp</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-foreground">Meta Phone Number ID</label>
                        <Input defaultValue="109824819204918" className="text-xs bg-secondary border-border font-mono" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-foreground">WhatsApp Business Account ID (WABA)</label>
                        <Input defaultValue="918402910491028" className="text-xs bg-secondary border-border font-mono" />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-foreground">Permanent Access Token</label>
                        <Input type="password" defaultValue="EAAO9...WhatsAppCloudLiveToken" className="text-xs bg-secondary border-border font-mono" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <Button
                        onClick={() => alert('Test WhatsApp payment reminder template sent to +91 98450 12345!')}
                        variant="outline"
                        className="bg-secondary border-border hover:bg-secondary/80 text-emerald-400 text-xs font-semibold h-8 px-3.5 rounded-xl gap-1.5 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Send Test WhatsApp Message</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* ==================== TAB 8: BACKUP & RECOVERY ==================== */}
            {activeTab === 'Backup & Recovery' && (
              <div className="space-y-6">
                {snapshotSuccessMsg && (
                  <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{snapshotSuccessMsg}</span>
                  </div>
                )}

                <Card className="p-6 bg-card border-border rounded-2xl space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Database Snapshot & Backups</h3>
                      <p className="text-[11px] text-muted-foreground">Export and restore courses, learning tasks, user credentials, and certificates.</p>
                    </div>
                    <Button
                      onClick={handleCreateSettingsSnapshot}
                      disabled={isCreatingSnapshot}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-9 px-4 rounded-xl gap-1.5 shadow-sm shadow-purple-900/30 cursor-pointer"
                    >
                      {isCreatingSnapshot ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      <span>{isCreatingSnapshot ? 'Creating Snapshot...' : 'Generate New Backup'}</span>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {settingsBackups.map((b) => (
                      <div key={b.id} className="p-4 bg-secondary/50 border border-border rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                            <Database className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-foreground block">{b.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{b.date} • {b.size}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleDownloadSettingsBackup(b)}
                            variant="outline"
                            className="bg-secondary border-border text-foreground text-xs h-8 px-3 rounded-lg gap-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </Button>
                          <Button
                            onClick={() => handleRestoreSettingsBackup(b)}
                            variant="outline"
                            className="bg-secondary border-border text-purple-400 hover:bg-purple-500/20 text-xs h-8 px-3 rounded-lg gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Restore
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* ==================== TAB 8: CONNECTED ACCOUNTS ==================== */}
            {activeTab === 'Connected Accounts' && (
              <Card className="p-6 bg-card border-border rounded-2xl space-y-5 text-xs">
                <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">OAuth & Developer Integrations</h2>
                <div className="space-y-3">
                  {connectedAccounts.map((acc) => (
                    <div key={acc.name} className="p-4 bg-secondary/50 border border-border rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                          <LinkIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">{acc.name}</span>
                          <span className="text-[11px] text-muted-foreground font-mono">{acc.username}</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => toggleAccountConnection(acc.name)}
                        variant={acc.status === 'Connected' ? 'outline' : 'default'}
                        className={`text-xs h-8 px-3 rounded-xl ${
                          acc.status === 'Connected' ? 'bg-secondary border-border text-rose-400 hover:bg-rose-500/20' : 'bg-purple-600 text-white'
                        }`}
                      >
                        {acc.status === 'Connected' ? 'Disconnect' : 'Connect Account'}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

          </div>

          {/* Right Column (4 Cols) Appearance & Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Appearance Card (Light/Dark Mode & Accent Colors) */}
            <Card className="p-5 bg-card border-border rounded-2xl space-y-4 text-xs">
              <h3 className="text-sm font-bold text-foreground">Appearance</h3>

              {/* Theme Mode Toggle */}
              <div className="space-y-1.5">
                <span className="font-semibold text-foreground block">Theme Mode</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      theme === 'light' ? 'bg-purple-600/15 border-purple-500/50 text-purple-400 font-bold' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="text-[11px]">Light</span>
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      theme === 'dark' ? 'bg-purple-600/15 border-purple-500/50 text-purple-400 font-bold' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span className="text-[11px]">Dark</span>
                  </button>

                  <button
                    onClick={() => setTheme('system')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      theme === 'system' ? 'bg-purple-600/15 border-purple-500/50 text-purple-400 font-bold' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Laptop className="w-4 h-4" />
                    <span className="text-[11px]">System</span>
                  </button>
                </div>
              </div>

              {/* Accent Color Palette */}
              <div className="space-y-1.5 pt-2">
                <span className="font-semibold text-foreground block">Accent Color</span>
                <div className="flex items-center gap-2">
                  {accents.map((acc) => (
                    <button
                      key={acc.name}
                      onClick={() => setAccentColor(acc.name)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        accentColor === acc.name ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''
                      }`}
                      style={{ backgroundColor: acc.color }}
                    >
                      {accentColor === acc.name && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Quick Actions Card */}
            <Card className="p-5 bg-card border-border rounded-2xl space-y-3 text-xs">
              <h3 className="text-sm font-bold text-foreground">Quick Actions</h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setShowDataModal(true); setExportComplete(false); }}
                  className="flex items-center justify-between w-full p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2"><Download className="w-4 h-4 text-purple-400" /> Download My Data</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                <button
                  onClick={() => setShowReferralModal(true)}
                  className="flex items-center justify-between w-full p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2"><Share2 className="w-4 h-4 text-blue-400" /> Refer & Earn</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                <button
                  onClick={() => setShowSupportModal(true)}
                  className="flex items-center justify-between w-full p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-emerald-400" /> Help & Support</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              <div className="pt-2 border-t border-border">
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-2 w-full p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ==================== REFER & EARN MODAL ==================== */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowReferralModal(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Refer Friends & Earn Credits</h3>
                <p className="text-xs text-muted-foreground">Give $25 cloud credits, get $25 + 1 Month Pro for every referral.</p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-secondary/50 border border-border rounded-2xl">
                <span className="text-xs text-muted-foreground block font-medium">Referred</span>
                <span className="text-lg font-bold text-foreground font-mono">6 Users</span>
              </div>
              <div className="p-3 bg-secondary/50 border border-border rounded-2xl">
                <span className="text-xs text-muted-foreground block font-medium">Earned</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">$150.00</span>
              </div>
              <div className="p-3 bg-secondary/50 border border-border rounded-2xl">
                <span className="text-xs text-muted-foreground block font-medium">Pro Free</span>
                <span className="text-lg font-bold text-purple-400 font-mono">3 Months</span>
              </div>
            </div>

            {/* Referral Link Box */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-foreground">Your Exclusive Referral Link</label>
              <div className="flex items-center gap-2">
                <Input readOnly value={referralLink} className="bg-secondary border-border text-foreground text-xs h-10 font-mono" />
                <Button
                  onClick={handleCopyReferral}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-10 px-4 rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-900/30 shrink-0"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </Button>
              </div>
            </div>

            {/* How it Works */}
            <div className="space-y-2 text-xs border-t border-border pt-4">
              <span className="font-bold text-foreground block">How Referral Rewards Work</span>
              <ul className="space-y-1.5 text-muted-foreground list-disc pl-4">
                <li>Share your link with colleagues, researchers, or developers.</li>
                <li>They get <strong className="text-foreground">$25 in AI Cloud Credits</strong> upon email verification.</li>
                <li>You instantly unlock <strong className="text-purple-400">$25 credits + 30 days Pro access</strong> when they enroll in a course.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DOWNLOAD MY DATA MODAL ==================== */}
      {showDataModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowDataModal(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Download Account Data</h3>
                <p className="text-xs text-muted-foreground">Export your complete AI Nexus study logs and model benchmarks.</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <span className="font-bold text-foreground block">Select Data Categories to Export</span>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-secondary/50 border border-border rounded-xl cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                  <div>
                    <span className="font-semibold text-foreground block">Learning Logs & Quiz Scores</span>
                    <span className="text-[11px] text-muted-foreground">All completed modules, timestamps, and test attempts.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-secondary/50 border border-border rounded-xl cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                  <div>
                    <span className="font-semibold text-foreground block">Custom Prompt Templates & Projects</span>
                    <span className="text-[11px] text-muted-foreground">Saved prompts, workflow architectures, and datasets.</span>
                  </div>
                </label>
              </div>
            </div>

            {exportComplete ? (
              <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Export Archive Ready (4.2 MB)
                </span>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert('Downloading nexus-user-data-archive.json (4.2 MB)...'); setShowDataModal(false); }}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[11px] hover:bg-emerald-700"
                >
                  Download File
                </a>
              </div>
            ) : (
              <Button
                onClick={handleGenerateExport}
                disabled={isExporting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-10 rounded-xl shadow-md shadow-purple-900/30 flex items-center justify-center gap-2"
              >
                {isExporting ? <Sparkles className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                <span>{isExporting ? 'Generating JSON Archive...' : 'Generate Data Export'}</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ==================== HELP & SUPPORT MODAL ==================== */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowSupportModal(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Help & Engineering Support</h3>
                <p className="text-xs text-muted-foreground">Submit a ticket to our AI platform engineers or chat live.</p>
              </div>
            </div>

            {ticketSubmitted ? (
              <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-semibold space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Support Ticket #TICK-8942 Submitted!</span>
                </div>
                <p className="text-muted-foreground text-[11px] font-normal">
                  Our engineering team has received your inquiry. We typically reply within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-foreground mb-1.5">Issue Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full h-9 px-3 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                  >
                    <option>Technical Issue</option>
                    <option>Billing & Subscription</option>
                    <option>Feature Request</option>
                    <option>Model Benchmark Bug</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1.5">Subject</label>
                  <Input
                    required
                    placeholder="Brief description of the issue"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="bg-secondary border-border text-foreground text-xs h-9"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1.5">Description</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Explain what happened or what you need assistance with..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="w-full p-3 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowSupportModal(false)}
                    className="bg-secondary border-border text-foreground text-xs h-9 px-4 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-5 rounded-xl shadow-md shadow-emerald-900/30 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Ticket</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==================== MODAL: UPDATE PAYMENT METHOD ==================== */}
      {showUpdateCardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-foreground">Update Payment Method</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Secure 256-bit encrypted billing card and auto-renewal payment setup.
                </p>
              </div>
              <button
                onClick={() => setShowUpdateCardModal(false)}
                className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="flex items-center gap-2 bg-secondary/60 p-1.5 rounded-2xl border border-border">
              <button
                type="button"
                onClick={() => setNewPaymentType('card')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  newPaymentType === 'card'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Credit / Debit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setNewPaymentType('upi')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  newPaymentType === 'upi'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>UPI AutoPay (India)</span>
              </button>
            </div>

            {newPaymentType === 'card' ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const last4 = newCardNumber.replace(/\s/g, '').slice(-4) || '8821';
                  setPaymentMethodText(`${newCardBrand} ending in •••• ${last4}`);
                  setShowUpdateCardModal(false);
                  setCardUpdateSuccess(true);
                  setTimeout(() => setCardUpdateSuccess(false), 4000);
                }}
                className="space-y-4"
              >
                {/* Live Card Preview Graphic */}
                <div className="p-5 rounded-2xl bg-gradient-to-tr from-zinc-950 via-purple-950/80 to-indigo-950 border border-purple-500/30 text-white space-y-4 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-7 rounded-md bg-amber-400/80 border border-amber-300 flex items-center justify-center text-[9px] font-bold text-zinc-900 shadow-inner">
                      CHIP
                    </div>
                    <span className="text-xs font-extrabold tracking-wider uppercase font-mono px-2 py-0.5 bg-white/10 rounded-md border border-white/20">
                      {newCardBrand}
                    </span>
                  </div>

                  <div className="font-mono text-base tracking-widest text-zinc-100 font-bold">
                    {newCardNumber.padEnd(19, '•')}
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300">
                    <div>
                      <span className="text-[8px] text-zinc-400 block uppercase">Cardholder</span>
                      <span className="font-bold text-white uppercase truncate block max-w-[180px]">
                        {newCardHolderName || 'YOUR NAME'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-400 block uppercase">Expires</span>
                      <span className="font-bold text-white">{newCardExpiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Inputs */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground">Name on Card</label>
                    <Input
                      required
                      value={newCardHolderName}
                      onChange={(e) => setNewCardHolderName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl uppercase"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">Card Number</label>
                      <div className="flex items-center gap-1.5">
                        {(['Visa', 'Mastercard', 'RuPay'] as const).map((brand) => (
                          <button
                            key={brand}
                            type="button"
                            onClick={() => setNewCardBrand(brand)}
                            className={`px-1.5 py-0.2 text-[9px] font-bold rounded cursor-pointer border ${
                              newCardBrand === brand
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : 'bg-secondary text-muted-foreground border-transparent'
                            }`}
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Input
                      required
                      value={newCardNumber}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                        const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
                        setNewCardNumber(formatted);
                      }}
                      placeholder="4532 •••• •••• 8821"
                      className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl font-mono tracking-wider"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground">Expiry Date</label>
                      <Input
                        required
                        value={newCardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (val.length >= 3) {
                            val = `${val.slice(0, 2)}/${val.slice(2)}`;
                          }
                          setNewCardExpiry(val);
                        }}
                        placeholder="MM/YY"
                        className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-foreground">CVV / CVC</label>
                      <Input
                        required
                        type="password"
                        maxLength={4}
                        value={newCardCvv}
                        onChange={(e) => setNewCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUpdateCardModal(false)}
                    className="bg-secondary border-border text-foreground text-xs h-9 px-4 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-5 rounded-xl shadow-md shadow-purple-950/40 cursor-pointer gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Payment Method</span>
                  </Button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setPaymentMethodText(`UPI AutoPay (${newUpiId || 'user@upi'})`);
                  setShowUpdateCardModal(false);
                  setCardUpdateSuccess(true);
                  setTimeout(() => setCardUpdateSuccess(false), 4000);
                }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Instant Recurring UPI Mandate</span>
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Supports Google Pay, PhonePe, Paytm, BHIM, and all NPCI-supported UPI handles.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">UPI ID / VPA</label>
                  <Input
                    required
                    value={newUpiId}
                    onChange={(e) => setNewUpiId(e.target.value)}
                    placeholder="e.g. mobile@okhdfcbank or handle@paytm"
                    className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUpdateCardModal(false)}
                    className="bg-secondary border-border text-foreground text-xs h-9 px-4 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-5 rounded-xl shadow-md shadow-purple-950/40 cursor-pointer gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Authorize Mandate</span>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </NexusShell>
  );
}

export default function SettingsPage(props: SettingsPageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading Settings...</div>}>
      <SettingsPageInner {...props} />
    </Suspense>
  );
}
