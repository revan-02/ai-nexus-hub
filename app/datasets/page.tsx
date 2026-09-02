'use client';

import React, { useState } from 'react';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Database, Download, Search, ChevronRight, FileSpreadsheet, Image as ImageIcon, FileText, Music, Eye } from 'lucide-react';
import Link from 'next/link';

export default function DatasetsPage() {
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const types = ['All', 'Tabular', 'Image', 'Text', 'Audio', 'Time Series', 'Multimodal'];

  const datasets = [
    {
      id: 'ds-1',
      name: 'OpenMedical 3D CT Cancer Imaging Corpus',
      type: 'Image',
      domain: 'Healthcare',
      records: '124,000 Scans',
      size: '42.8 GB',
      license: 'CC BY 4.0',
      downloads: '18,420',
      desc: 'Annotated 3D CT scan volumetric images for tumor segmentation and early-stage nodule classification.',
      features: ['patient_id', 'dicom_volume', 'lesion_bbox', 'histology_type', 'stage_class'],
    },
    {
      id: 'ds-2',
      name: 'Global Financial Micro-Transactions Stream',
      type: 'Tabular',
      domain: 'Finance',
      records: '12.5 Million Records',
      size: '8.4 GB',
      license: 'MIT',
      downloads: '32,100',
      desc: 'High-frequency algorithmic trading logs and credit card transactions labeled for anomaly & fraud detection.',
      features: ['timestamp', 'amount_usd', 'merchant_id', 'geo_lat_long', 'is_fraud'],
    },
    {
      id: 'ds-3',
      name: 'Multilingual STEM Reasoning & Code Benchmark',
      type: 'Text',
      domain: 'NLP & Code',
      records: '500,000 Instructions',
      size: '2.1 GB',
      license: 'Apache 2.0',
      downloads: '45,200',
      desc: 'Chain-of-Thought (CoT) mathematical proofs and Python/C++ code pairs across 24 natural languages.',
      features: ['query_id', 'prompt', 'reasoning_chain', 'python_solution', 'test_cases'],
    },
  ];

  const filtered = datasets.filter((ds) => {
    if (selectedType !== 'All' && ds.type !== selectedType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return ds.name.toLowerCase().includes(q) || ds.domain.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <NexusShell>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Datasets Hub</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">AI Dataset Hub</h1>
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Curated, benchmarked datasets across image segmentation, text corpora, financial streams, and multimodal audio.
            </p>
          </div>

          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl gap-1.5 shadow-sm shadow-purple-900/30">
            <Download className="w-4 h-4" /> Download Selected
          </Button>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  selectedType === t
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search datasets..."
              className="pl-9 pr-4 py-1.5 h-8 text-xs bg-secondary border-border text-foreground rounded-xl"
            />
          </div>
        </div>

        {/* Datasets Cards Grid */}
        <div className="space-y-4">
          {filtered.map((ds) => (
            <Card key={ds.id} className="p-6 bg-card border-border rounded-2xl space-y-4 hover:border-purple-500/40 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-400 font-mono text-xs font-bold rounded-lg border border-purple-500/30">
                    {ds.type}
                  </span>
                  <h3 className="text-base font-bold text-foreground">{ds.name}</h3>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                  <span>Records: <strong className="text-foreground">{ds.records}</strong></span>
                  <span>Size: <strong className="text-purple-400">{ds.size}</strong></span>
                  <span className="px-2 py-0.5 bg-secondary text-foreground font-bold rounded border border-border">{ds.license}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{ds.desc}</p>

              {/* Schema Features */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-foreground">Schema Feature Keys:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {ds.features.map((f) => (
                    <span key={f} className="px-2 py-0.5 bg-secondary text-foreground text-[10px] font-mono rounded border border-border">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-muted-foreground font-mono">Downloads: <strong className="text-foreground">{ds.downloads}</strong></span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="bg-secondary border-border text-foreground text-xs h-8 px-3 rounded-xl gap-1">
                    <Eye className="w-3.5 h-3.5" /> Preview Schema
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-8 px-3 rounded-xl gap-1 shadow-sm shadow-purple-900/30">
                    <Download className="w-3.5 h-3.5" /> Download (.parquet)
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </NexusShell>
  );
}
