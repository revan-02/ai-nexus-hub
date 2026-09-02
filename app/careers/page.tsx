'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  ChevronRight,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Send,
  ExternalLink,
  Award,
  ShieldCheck,
  Zap,
  Bookmark,
  Share2,
  X,
  Plus
} from 'lucide-react';
import {
  JobPosting,
  JobApplication,
  calculateResumeMatchScore,
  INITIAL_JOB_DATABASE
} from '@/services/career-service';

export default function CareersPage() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications' | 'post-job'>('jobs');
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'India' | 'Abroad'>('All');
  const [selectedExperience, setSelectedExperience] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected job for detailed JD drawer/modal
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Application Form State
  const [candidateName, setCandidateName] = useState('Sarah Johnson');
  const [candidateEmail, setCandidateEmail] = useState('sarah.j@nexus.ai');
  const [candidatePhone, setCandidatePhone] = useState('+91 98765 43210');
  const [candidateExpYears, setCandidateExpYears] = useState(2);
  const [candidateSkillsInput, setCandidateSkillsInput] = useState('Python, PyTorch, Hugging Face, FastAPI, Docker, LangChain, Kubernetes');
  const [portfolioUrl, setPortfolioUrl] = useState('https://github.com/sarah-nexus');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [applicationSuccessMsg, setApplicationSuccessMsg] = useState('');

  // Recruiter Post Job State
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('Bengaluru, India');
  const [newJobSalary, setNewJobSalary] = useState('₹18,00,000 - ₹30,00,000 / yr');
  const [newJobExp, setNewJobExp] = useState<string>('1-2 Years');
  const [newJobTech, setNewJobTech] = useState('Python, PyTorch, vLLM, Docker');
  const [newJobDesc, setNewJobDesc] = useState('');

  // Initialized with full India & Abroad job database (all salaries in ₹)
  const [jobs, setJobs] = useState<JobPosting[]>(INITIAL_JOB_DATABASE);

  // Mock list of candidate's submitted applications
  const [myApplications, setMyApplications] = useState<JobApplication[]>([
    {
      id: 'app-prev-1',
      jobId: 'job-sec-1',
      jobTitle: 'Senior AI Threat Intelligence & Adversarial Defense Engineer',
      company: 'CrowdStrike AI Defense Labs',
      candidateName: 'Sarah Johnson',
      candidateEmail: 'sarah.j@nexus.ai',
      candidatePhone: '+91 98765 43210',
      experienceYears: 2,
      portfolioUrl: 'https://github.com/sarah-nexus',
      githubUrl: 'https://github.com/sarah-nexus',
      linkedInUrl: 'https://linkedin.com/in/sarah-johnson-ai',
      resumeFileName: 'Sarah_Johnson_AI_Resume.pdf',
      coverLetter: 'I have hands-on experience building adversarial machine learning defenses with PyTorch.',
      matchScore: 92,
      status: 'Shortlisted',
      appliedAt: 'Aug 29, 2026'
    }
  ]);

  // Filtered jobs with India, Abroad, Experience, Category & Workplace filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchRegion =
        selectedRegion === 'All' ||
        (selectedRegion === 'India' && (j.region === 'India' || j.location.toLowerCase().includes('india'))) ||
        (selectedRegion === 'Abroad' && (j.region === 'Abroad' || !j.location.toLowerCase().includes('india')));

      const matchExp =
        selectedExperience === 'All' ||
        j.experienceRange.includes(selectedExperience) ||
        (selectedExperience === '0-1 Years' && j.minExperienceYears === 0) ||
        (selectedExperience === '1-2 Years' && j.minExperienceYears <= 2 && j.maxExperienceYears >= 1) ||
        (selectedExperience === '2-4 Years' && j.maxExperienceYears >= 2);

      const matchCat = selectedCategory === 'All' || j.category === selectedCategory;
      const matchWork = selectedWorkplace === 'All' || j.workplaceType === selectedWorkplace;
      const matchSearch =
        !searchQuery ||
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.salaryRange.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchRegion && matchExp && matchCat && matchWork && matchSearch;
    });
  }, [jobs, selectedRegion, selectedExperience, selectedCategory, selectedWorkplace, searchQuery]);

  // Calculate live resume match score for the selected job
  const resumeMatchAnalysis = useMemo(() => {
    if (!selectedJob) return null;
    const skillsList = candidateSkillsInput.split(',').map((s) => s.trim()).filter(Boolean);
    return calculateResumeMatchScore(selectedJob, skillsList, candidateExpYears);
  }, [selectedJob, candidateSkillsInput, candidateExpYears]);

  const handleOpenApplyModal = (job: JobPosting) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
    setApplicationSuccessMsg('');
  };

  const handleSubmitApplication = () => {
    if (!selectedJob) return;
    setIsSubmittingApp(true);

    setTimeout(() => {
      const match = resumeMatchAnalysis?.matchScore || 85;
      const newApp: JobApplication = {
        id: `app-${Date.now()}`,
        jobId: selectedJob.id,
        jobTitle: selectedJob.title,
        company: selectedJob.company,
        candidateName,
        candidateEmail,
        candidatePhone,
        experienceYears: candidateExpYears,
        portfolioUrl,
        githubUrl: portfolioUrl,
        linkedInUrl: 'https://linkedin.com/in/sarah-johnson-ai',
        resumeFileName: 'Sarah_Johnson_AI_Resume.pdf',
        coverLetter: coverLetter || 'Excited to apply for this position!',
        matchScore: match,
        status: 'Applied',
        appliedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      setMyApplications([newApp, ...myApplications]);
      setIsSubmittingApp(false);
      setApplicationSuccessMsg('Your application and verified credential portfolio was delivered directly to the engineering hiring team!');
    }, 1200);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newJobCompany) return;

    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      title: newJobTitle,
      company: newJobCompany,
      companyLogo: '💼',
      location: newJobLocation,
      workplaceType: 'Remote',
      experienceRange: newJobExp,
      minExperienceYears: newJobExp === '0-1 Years' ? 0 : newJobExp === '1-2 Years' ? 1 : 2,
      maxExperienceYears: newJobExp === '0-1 Years' ? 1 : newJobExp === '1-2 Years' ? 2 : 4,
      salaryRange: newJobSalary,
      currency: 'INR',
      jobType: 'Full-time',
      category: 'Generative AI & LLMs',
      tags: ['Verified Opening', 'Recruiter Posted'],
      techStack: newJobTech.split(',').map((t) => t.trim()).filter(Boolean),
      description: newJobDesc || 'Exciting AI engineering role building production systems.',
      responsibilities: ['Build and deploy scalable AI pipelines', 'Collaborate with cross-functional teams'],
      requirements: ['Hands-on experience in machine learning and software development'],
      benefits: ['Competitive compensation', 'Comprehensive health benefits'],
      postedDate: 'Just now',
      applicantsCount: 0,
      featured: true
    };

    setJobs([newJob, ...jobs]);
    setActiveTab('jobs');
    setNewJobTitle('');
    setNewJobCompany('');
    setNewJobDesc('');
  };

  return (
    <NexusShell>
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Careers & Job Portal</span>
        </div>

        {/* Hero Header */}
        <Card className="relative overflow-hidden rounded-3xl border-purple-500/20 bg-gradient-to-br from-purple-950/70 via-card to-indigo-950/40 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Nexus AI Placement Network
                </span>
                <span className="text-xs text-muted-foreground font-mono">0–4 Yrs Experience Focused</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                AI & Machine Learning Careers & Job Portal
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Connect with top AI startups and enterprise tech leaders hiring Junior, Mid-Level, and Specialized AI Engineers. Apply with 1-Click using your verified Nexus credentials, AI resume match scorer, and project portfolios.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 bg-secondary/80 p-1.5 rounded-2xl border border-border flex-wrap">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'jobs'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Job Openings ({jobs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('applications')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'applications'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>My Applications ({myApplications.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('post-job')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'post-job'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post a Job</span>
              </button>
            </div>
          </div>
        </Card>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1: JOB OPENINGS CATALOG & FILTERING
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Filter Toolbar */}
            <Card className="p-4 bg-card border-border rounded-2xl space-y-4 shadow-md">
              {/* Region Filter Pills */}
              <div className="flex items-center gap-2 border-b border-border pb-3 flex-wrap">
                <span className="text-xs font-bold text-muted-foreground mr-1">Locations:</span>
                <button
                  onClick={() => setSelectedRegion('All')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedRegion === 'All'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  🌐 All Openings ({jobs.length})
                </button>
                <button
                  onClick={() => setSelectedRegion('India')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedRegion === 'India'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>🇮🇳 Jobs in India</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-950/80 text-purple-200">
                    {jobs.filter((j) => j.region === 'India' || j.location.toLowerCase().includes('india')).length}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedRegion('Abroad')}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedRegion === 'Abroad'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>🌍 Jobs Abroad & Global</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-950/80 text-purple-200">
                    {jobs.filter((j) => j.region === 'Abroad' || !j.location.toLowerCase().includes('india')).length}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {/* Search Bar */}
                <div className="relative sm:col-span-2">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by role, company, location, or tech (e.g. PyTorch, Bengaluru, USA, vLLM)..."
                    className="pl-9 bg-secondary border-border text-foreground text-xs h-9 rounded-xl"
                  />
                </div>

                {/* Category / Domain Filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-secondary border border-border text-foreground text-xs h-9 rounded-xl px-3 font-medium"
                  >
                    <option value="All">All Domains</option>
                    <option value="Cybersecurity & AI Defense">🛡️ Cybersecurity + AI</option>
                    <option value="Generative AI & LLMs">⚡ Generative AI & LLMs</option>
                    <option value="Machine Learning">🤖 Machine Learning</option>
                    <option value="MLOps & Infrastructure">🚀 MLOps & Infra</option>
                    <option value="Computer Vision">👁️ Computer Vision</option>
                    <option value="Data Science">📊 Data Science</option>
                  </select>
                </div>

                {/* Experience Filter */}
                <div>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full bg-secondary border border-border text-foreground text-xs h-9 rounded-xl px-3 font-medium"
                  >
                    <option value="All">All Experience (0-4 Yrs)</option>
                    <option value="0-1 Years">0–1 Years (Entry Level)</option>
                    <option value="1-2 Years">1–2 Years (Junior ML)</option>
                    <option value="2-4 Years">2–4 Years (Mid-Senior)</option>
                  </select>
                </div>

                {/* Workplace Filter */}
                <div>
                  <select
                    value={selectedWorkplace}
                    onChange={(e) => setSelectedWorkplace(e.target.value)}
                    className="w-full bg-secondary border border-border text-foreground text-xs h-9 rounded-xl px-3 font-medium"
                  >
                    <option value="All">All Workplace Types</option>
                    <option value="Remote">100% Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="p-6 bg-card border-border rounded-3xl space-y-4 hover:border-purple-500/40 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-3">
                    {/* Company, Logo, and Badge Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-secondary border border-border text-xl flex items-center justify-center shadow-inner">
                          {job.companyLogo}
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-foreground group-hover:text-purple-300 transition-colors leading-snug">
                            {job.title}
                          </h3>
                          <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                            {job.company} • <MapPin className="w-3 h-3 text-purple-400" /> {job.location} ({job.workplaceType})
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {job.featured && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Featured
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase border ${
                          job.region === 'India' || job.location.toLowerCase().includes('india')
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                            : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                        }`}>
                          {job.region === 'India' || job.location.toLowerCase().includes('india') ? '🇮🇳 India' : '🌍 Abroad / Global'}
                        </span>
                      </div>
                    </div>

                    {/* Salary & Experience Badges (Explicitly in Rupees ₹) */}
                    <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                      <div className="flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-mono">
                        <span className="text-emerald-400 font-extrabold">₹</span>
                        <span>{job.salaryRange}</span>
                      </div>

                      <div className="flex items-center gap-1 font-semibold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 font-mono text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>Exp: {job.experienceRange}</span>
                      </div>

                      <span className="text-[11px] text-muted-foreground px-2 py-0.5 bg-secondary rounded-md border border-border">
                        {job.jobType}
                      </span>
                    </div>

                    {/* Description Snippet */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {job.description}
                    </p>

                    {/* Required Tech Stack Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {job.techStack.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 bg-secondary text-foreground text-[10px] font-mono rounded-md border border-border">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-4 border-t border-border flex items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-muted-foreground">
                      Posted {job.postedDate} • <strong>{job.applicantsCount} applicants</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedJob(job)}
                        className="text-xs h-8 px-3 rounded-xl border-border hover:bg-secondary cursor-pointer"
                      >
                        View Full JD
                      </Button>

                      <Button
                        onClick={() => handleOpenApplyModal(job)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-8 px-4 rounded-xl gap-1.5 shadow-md shadow-purple-950/40 cursor-pointer"
                      >
                        <span>1-Click Apply</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2: MY APPLICATIONS TRACKER
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="border-b border-border pb-3">
              <h2 className="text-lg font-bold text-foreground">Submitted Job Applications</h2>
              <p className="text-xs text-muted-foreground">Track real-time candidate review status, interview invites, and recruiter feedback.</p>
            </div>

            {myApplications.length === 0 ? (
              <Card className="p-12 text-center text-muted-foreground bg-card border-border rounded-3xl space-y-3">
                <Briefcase className="w-12 h-12 text-purple-400 mx-auto" />
                <h3 className="text-base font-bold text-foreground">No active applications yet</h3>
                <p className="text-xs text-muted-foreground">Browse the job board and apply with 1-click using your verified Nexus credential portfolio.</p>
                <Button onClick={() => setActiveTab('jobs')} className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 px-4 rounded-xl">
                  Browse Jobs
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {myApplications.map((app) => (
                  <Card key={app.id} className="p-5 bg-card border-border rounded-2xl space-y-3">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">{app.company}</span>
                        <h3 className="text-base font-bold text-foreground mt-0.5">{app.jobTitle}</h3>
                        <span className="text-xs text-muted-foreground">
                          Applied on {app.appliedAt} • Attached: <strong className="text-foreground">{app.resumeFileName}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold rounded-lg">
                          Match Score: {app.matchScore}%
                        </span>

                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          app.status === 'Interview Scheduled'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse'
                            : 'bg-secondary text-foreground border-border'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 3: POST A JOB (RECRUITER / EMPLOYER PORTAL)
           ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'post-job' && (
          <Card className="p-6 sm:p-8 bg-card border-border rounded-3xl space-y-6 max-w-3xl mx-auto">
            <div className="border-b border-border pb-3">
              <h2 className="text-lg font-bold text-foreground">Post an AI & ML Job Opening</h2>
              <p className="text-xs text-muted-foreground">Publish career openings directly to vetted AI graduates and engineers.</p>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-foreground mb-1.5">Job Title</label>
                  <Input
                    required
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="e.g. Junior Applied ML Engineer"
                    className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1.5">Company Name</label>
                  <Input
                    required
                    value={newJobCompany}
                    onChange={(e) => setNewJobCompany(e.target.value)}
                    placeholder="e.g. OpenAI Partner Labs"
                    className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-foreground mb-1.5">Location</label>
                  <Input
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    placeholder="e.g. Bengaluru / Remote"
                    className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1.5">Experience Tier</label>
                  <select
                    value={newJobExp}
                    onChange={(e) => setNewJobExp(e.target.value as any)}
                    className="w-full bg-secondary border border-border text-foreground text-xs h-9 rounded-xl px-2 font-medium"
                  >
                    <option value="0-1 Years">0–1 Years (Entry Level)</option>
                    <option value="1-2 Years">1–2 Years (Junior)</option>
                    <option value="2-4 Years">2–4 Years (Mid-Senior)</option>
                    <option value="0-4 Years">0–4 Years (All Tiers)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1.5">Salary Package</label>
                  <Input
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    placeholder="e.g. ₹16,00,000 - ₹28,00,000 / yr"
                    className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1.5">Required Tech Stack (Comma-separated)</label>
                <Input
                  value={newJobTech}
                  onChange={(e) => setNewJobTech(e.target.value)}
                  placeholder="Python, PyTorch, vLLM, LangChain, Docker"
                  className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1.5">Job Description & Responsibilities</label>
                <textarea
                  rows={4}
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  placeholder="Outline key project deliverables, team structure, and qualifications..."
                  className="w-full p-3 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-6 rounded-xl shadow-md cursor-pointer"
                >
                  Publish Job Opening
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* ── MODAL: 1-CLICK RESUME & APPLICATION SUBMISSION WITH AI JD MATCH SCORER ── */}
        {isApplyModalOpen && selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">{selectedJob.company}</span>
                  <h3 className="text-base font-extrabold text-foreground mt-0.5">Apply for {selectedJob.title}</h3>
                </div>
                <button onClick={() => setIsApplyModalOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* AI Match Score Card */}
              {resumeMatchAnalysis && (
                <div className="p-4 bg-gradient-to-r from-purple-950/40 via-secondary/60 to-emerald-950/30 border border-purple-500/30 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold text-foreground">AI Resume & Profile Match Analysis</span>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-400 font-mono">
                      {resumeMatchAnalysis.matchScore}% Match
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-emerald-400 font-semibold block">Matching Skills:</span>
                      <span className="text-muted-foreground">{resumeMatchAnalysis.matchingSkills.join(', ') || 'General AI Foundations'}</span>
                    </div>
                    {resumeMatchAnalysis.missingSkills.length > 0 && (
                      <div>
                        <span className="text-amber-400 font-semibold block">Skill Recommendations:</span>
                        <span className="text-muted-foreground">{resumeMatchAnalysis.missingSkills.slice(0, 2).join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {applicationSuccessMsg ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-foreground">Application Submitted Successfully!</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{applicationSuccessMsg}</p>
                  <Button
                    onClick={() => {
                      setIsApplyModalOpen(false);
                      setActiveTab('applications');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-6 rounded-xl cursor-pointer"
                  >
                    View in Application Tracker
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-foreground mb-1">Full Name</label>
                      <Input
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-foreground mb-1">Email Address</label>
                      <Input
                        value={candidateEmail}
                        onChange={(e) => setCandidateEmail(e.target.value)}
                        className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-foreground mb-1">Contact Phone</label>
                      <Input
                        value={candidatePhone}
                        onChange={(e) => setCandidatePhone(e.target.value)}
                        className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-foreground mb-1">Years of Experience</label>
                      <Input
                        type="number"
                        value={candidateExpYears}
                        onChange={(e) => setCandidateExpYears(Number(e.target.value))}
                        className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-foreground mb-1">Your Skills (Comma-separated for AI Matcher)</label>
                    <Input
                      value={candidateSkillsInput}
                      onChange={(e) => setCandidateSkillsInput(e.target.value)}
                      placeholder="Python, PyTorch, vLLM, Docker, FastAPI..."
                      className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-foreground mb-1">GitHub / Project Showcase Portfolio URL</label>
                    <Input
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://github.com/your-username"
                      className="bg-secondary border-border text-foreground text-xs h-9 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-foreground mb-1">Quick Engineering Cover Note</label>
                    <textarea
                      rows={3}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Highlight your most relevant AI projects, open-source repos, or verified credentials..."
                      className="w-full p-3 bg-secondary border border-border rounded-xl text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                    />
                  </div>

                  {/* Attached Verified Credentials Notice */}
                  <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl flex items-center gap-2 text-[11px] text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Your verified <strong>ISO 17024 & Open Badges 3.0</strong> credentials will be automatically attached to this submission.</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                    <Button variant="outline" onClick={() => setIsApplyModalOpen(false)} className="text-xs h-9 px-4 rounded-xl">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitApplication}
                      disabled={isSubmittingApp}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-6 rounded-xl gap-1.5 shadow-md shadow-purple-950/40 cursor-pointer"
                    >
                      {isSubmittingApp ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>{isSubmittingApp ? 'Submitting Application...' : 'Confirm & Apply'}</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MODAL: FULL JD VIEWER DRAWER ── */}
        {selectedJob && !isApplyModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-secondary border border-border text-xl flex items-center justify-center">
                    {selectedJob.companyLogo}
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-foreground leading-snug">{selectedJob.title}</h3>
                    <span className="text-xs text-muted-foreground font-medium">
                      {selectedJob.company} • {selectedJob.location} ({selectedJob.workplaceType})
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedJob(null)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 bg-secondary/50 rounded-xl border border-border">
                  <span className="text-[10px] text-muted-foreground block font-bold uppercase">Salary Package</span>
                  <span className="font-bold text-emerald-400 font-mono">{selectedJob.salaryRange}</span>
                </div>
                <div className="p-3 bg-secondary/50 rounded-xl border border-border">
                  <span className="text-[10px] text-muted-foreground block font-bold uppercase">Experience Bracket</span>
                  <span className="font-bold text-purple-300 font-mono">{selectedJob.experienceRange}</span>
                </div>
                <div className="p-3 bg-secondary/50 rounded-xl border border-border">
                  <span className="text-[10px] text-muted-foreground block font-bold uppercase">Employment Type</span>
                  <span className="font-bold text-foreground font-mono">{selectedJob.jobType}</span>
                </div>
              </div>

              {/* Full Description & Responsibilities */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-foreground mb-1 text-sm">About the Role</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedJob.description}</p>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-1 text-sm">Key Responsibilities</h4>
                  <ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
                    {selectedJob.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-1 text-sm">Qualifications & Technical Skills</h4>
                  <ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-foreground mb-1 text-sm">Benefits & Perks</h4>
                  <ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
                    {selectedJob.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button variant="outline" onClick={() => setSelectedJob(null)} className="text-xs h-9 px-4 rounded-xl">
                  Close
                </Button>
                <Button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-9 px-6 rounded-xl gap-1.5 shadow-md shadow-purple-950/40 cursor-pointer"
                >
                  <span>Apply with Resume & Credentials</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </NexusShell>
  );
}
