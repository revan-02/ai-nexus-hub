'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Key,
  KeyRound,
  Copy,
  Check,
  Eye,
  EyeOff,
  RotateCcw,
  Trash2,
  Plus,
  Shield,
  ShieldCheck,
  Zap,
  Code,
  Terminal,
  Server,
  Activity,
  AlertTriangle,
  Lock,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  getSeoMonetizationConfig,
  generateApiKey,
  regenerateApiKey,
  revokeApiKey,
  ApiKeyItem,
} from '@/services/seo-monetization-service';

export function ApiKeysTab() {
  const [keysList, setKeysList] = useState<ApiKeyItem[]>(() => getSeoMonetizationConfig().apiKeys);
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Create Key Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState<'public' | 'secret' | 'webhook'>('secret');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read:courses', 'read:challenges']);

  // Regenerate Confirmation Modal
  const [regeneratingKey, setRegeneratingKey] = useState<ApiKeyItem | null>(null);

  // Code Snippet Active Tab
  const [codeTab, setCodeTab] = useState<'curl' | 'javascript' | 'python'>('curl');

  const toggleSecretVisibility = (id: string) => {
    setVisibleSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyKey = (id: string, value: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(value);
    }
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const created = generateApiKey(newKeyName, newKeyType, newKeyPermissions);
    setKeysList([created, ...keysList]);
    setShowCreateModal(false);
    setNewKeyName('');
    setFeedbackMsg(`API Key "${created.name}" created successfully.`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleConfirmRegenerate = () => {
    if (!regeneratingKey) return;
    const updated = regenerateApiKey(regeneratingKey.id);
    if (updated) {
      setKeysList(keysList.map((k) => (k.id === updated.id ? updated : k)));
      setFeedbackMsg(`API Key "${updated.name}" has been regenerated. Previous token is now revoked.`);
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
    setRegeneratingKey(null);
  };

  const handleRevokeKey = (id: string, name: string) => {
    if (confirm(`Are you sure you want to revoke API Key "${name}"? Any active integrations using this key will immediately fail.`)) {
      revokeApiKey(id);
      setKeysList(keysList.filter((k) => k.id !== id));
      setFeedbackMsg(`API Key "${name}" has been permanently revoked.`);
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const activeKeySample = keysList.find((k) => k.type === 'secret') || keysList[0];
  const sampleKeyValue = activeKeySample?.keyValue || 'nexus_sec_live_99d4e21a7c83f4b0';

  const snippets = {
    curl: `curl -X GET "https://ainexus.platform.io/api/courses" \\
  -H "Authorization: Bearer ${sampleKeyValue}" \\
  -H "Content-Type: application/json"`,
    javascript: `// Node.js or Browser ES6
const response = await fetch("https://ainexus.platform.io/api/courses", {
  method: "GET",
  headers: {
    "Authorization": "Bearer ${sampleKeyValue}",
    "Content-Type": "application/json"
  }
});
const data = await response.json();
console.log(data);`,
    python: `# Python 3
import requests

url = "https://ainexus.platform.io/api/courses"
headers = {
    "Authorization": "Bearer ${sampleKeyValue}",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`,
  };

  const allAvailablePermissions = [
    { id: 'read:courses', label: 'Read Course Catalog & Curriculum' },
    { id: 'read:challenges', label: 'Read Daily Challenges & Rooms' },
    { id: 'submit:evaluations', label: 'Submit Code Submissions & Quizzes' },
    { id: 'syndicate:instant-articles', label: 'Trigger Instant Articles Syndication' },
    { id: 'admin:users', label: 'Manage Users & Permissions' },
    { id: 'admin:webhooks', label: 'Configure System Webhooks' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <Card className="p-6 bg-card border-border rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">API Keys &amp; Developer Interface</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                REST &amp; Webhooks
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Generate, manage, and inspect API credentials for external integrations, mobile client apps, and automated workflows.
            </p>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-md shadow-purple-950/40 gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New API Key</span>
          </Button>
        </div>

        {feedbackMsg && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </Card>

      {/* ── METRICS SUMMARY CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-card border-border rounded-2xl space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Active API Credentials</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-foreground">{keysList.length}</span>
            <span className="text-xs text-emerald-400 font-bold">100% Healthy</span>
          </div>
          <span className="text-[10px] text-muted-foreground">Public, Secret &amp; Webhooks</span>
        </Card>

        <Card className="p-4 bg-card border-border rounded-2xl space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Total Requests Today</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-purple-400">
              {keysList.reduce((acc, k) => acc + k.usedToday, 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-muted-foreground">/ 170,000 Quota</span>
          </div>
          <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: '12.4%' }} />
          </div>
        </Card>

        <Card className="p-4 bg-card border-border rounded-2xl space-y-1">
          <span className="text-[11px] text-muted-foreground font-semibold">Average Response Latency</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400">38 ms</span>
            <span className="text-[10px] text-zinc-400 font-mono">P95: 54ms</span>
          </div>
          <span className="text-[10px] text-muted-foreground">Global CDN &amp; API Edge Cache</span>
        </Card>
      </div>

      {/* ── ACTIVE API KEYS TABLE ── */}
      <Card className="p-6 bg-card border-border rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-foreground">Active API Credentials</h3>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Environment: Production (Live)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-muted-foreground font-semibold">
                <th className="p-3 pl-4">Name &amp; Type</th>
                <th className="p-3">API Key Token</th>
                <th className="p-3">Permissions</th>
                <th className="p-3">Daily Quota</th>
                <th className="p-3">Last Used</th>
                <th className="p-3 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {keysList.map((key) => {
                const isSecretVisible = visibleSecrets[key.id];
                const displayKey = isSecretVisible || key.type === 'public' ? key.keyValue : key.keyMasked;

                return (
                  <tr key={key.id} className="hover:bg-secondary/30 transition-colors">
                    {/* Name & Type */}
                    <td className="p-3 pl-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground block">{key.name}</span>
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase border ${
                            key.type === 'secret'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : key.type === 'webhook'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {key.type}
                        </span>
                      </div>
                    </td>

                    {/* Key Value & Copy */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-secondary rounded-lg font-mono text-xs text-foreground tracking-tight select-all">
                          {displayKey}
                        </code>

                        {key.type !== 'public' && (
                          <button
                            type="button"
                            onClick={() => toggleSecretVisibility(key.id)}
                            className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground cursor-pointer"
                            title={isSecretVisible ? 'Hide token' : 'Reveal token'}
                          >
                            {isSecretVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        )}

                        <Button
                          onClick={() => handleCopyKey(key.id, key.keyValue)}
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Copy API Key"
                        >
                          {copiedKeyId === key.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      </div>
                    </td>

                    {/* Permissions */}
                    <td className="p-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        {key.permissions.map((perm) => (
                          <span
                            key={perm}
                            className="px-1.5 py-0.5 bg-secondary text-muted-foreground text-[10px] font-mono rounded"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Quota */}
                    <td className="p-3">
                      <div className="space-y-0.5">
                        <span className="font-mono text-xs text-foreground">
                          {key.usedToday.toLocaleString('en-IN')} / {key.rateLimitDaily.toLocaleString('en-IN')}
                        </span>
                        <div className="w-20 bg-secondary h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-500 h-full rounded-full"
                            style={{
                              width: `${Math.min(100, (key.usedToday / key.rateLimitDaily) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Last Used */}
                    <td className="p-3 text-muted-foreground text-xs">{key.lastUsedAt}</td>

                    {/* Actions */}
                    <td className="p-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          onClick={() => setRegeneratingKey(key)}
                          variant="outline"
                          size="sm"
                          className="h-7 text-[11px] gap-1 px-2.5 rounded-lg text-amber-400 hover:bg-amber-500/10 border-border cursor-pointer"
                          title="Regenerate Token"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Regenerate</span>
                        </Button>

                        <Button
                          onClick={() => handleRevokeKey(key.id, key.name)}
                          variant="outline"
                          size="sm"
                          className="h-7 text-[11px] px-2 rounded-lg text-rose-400 hover:bg-rose-500/10 border-border cursor-pointer"
                          title="Revoke Key"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── CODE SNIPPETS / DEVELOPER QUICKSTART ── */}
      <Card className="p-6 bg-card border-border rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-foreground">Developer Quickstart &amp; cURL Snippets</h3>
          </div>

          <div className="flex rounded-xl bg-secondary p-1 border border-border">
            {(['curl', 'javascript', 'python'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setCodeTab(tab)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg uppercase font-mono transition-all cursor-pointer ${
                  codeTab === tab
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <pre className="p-4 rounded-xl bg-secondary/80 border border-border text-xs font-mono text-purple-200 overflow-x-auto">
          {snippets[codeTab]}
        </pre>
      </Card>

      {/* ── MODAL: CREATE NEW API KEY ── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Create New API Credential</h3>
                  <p className="text-[11px] text-muted-foreground">Select scope and permissions</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Key Name / Description</label>
                <Input
                  required
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Mobile App Client / Zapier Integration"
                  className="text-xs bg-secondary border-border"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Credential Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['public', 'secret', 'webhook'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewKeyType(t)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        newKeyType === t
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300 ring-1 ring-purple-500 font-bold'
                          : 'bg-secondary/40 border-border text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      <span className="text-xs capitalize block">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Permissions Scope</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto p-1">
                  {allAvailablePermissions.map((perm) => {
                    const isChecked = newKeyPermissions.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className="flex items-center gap-2 p-2 rounded-xl bg-secondary/40 border border-border text-xs cursor-pointer hover:bg-secondary/70"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setNewKeyPermissions((prev) =>
                              isChecked ? prev.filter((p) => p !== perm.id) : [...prev, perm.id]
                            );
                          }}
                          className="accent-purple-600 rounded"
                        />
                        <span className="text-foreground">{perm.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="h-8 text-xs px-3 rounded-xl cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold h-8 text-xs px-4 rounded-xl cursor-pointer"
                >
                  Generate Key
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CONFIRM REGENERATE KEY ── */}
      {regeneratingKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-foreground">Regenerate API Key?</h3>
              <p className="text-xs text-muted-foreground">
                Regenerating will permanently revoke the current token for <strong>{regeneratingKey.name}</strong>. Any services using the old token will immediately lose access.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setRegeneratingKey(null)}
                className="h-9 text-xs px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmRegenerate}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold h-9 text-xs px-4 rounded-xl cursor-pointer"
              >
                Yes, Regenerate Token
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
