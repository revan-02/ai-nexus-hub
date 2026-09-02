'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AdminShell } from '@/components/layout/admin-shell';
import { NexusShell } from '@/components/nexus/nexus-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  GraduationCap,
  Plus,
  Upload,
  Download,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  MoreVertical,
  Brain,
  Network,
  Code,
  BarChart,
  Database,
  MessageSquare,
  Eye,
  Calculator,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Clock,
  Flame,
  Users,
  Play,
  Award,
  Sparkles,
  Layers,
  Star,
  Zap,
  Briefcase,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/api/use-courses';
import { CreateCourseModal } from '@/components/courses/create-course-modal';
import { CourseDetailModal } from '@/components/courses/course-detail-modal';
import { IndustryAIPlacementHighway } from '@/components/learning/industry-ai-placement-highway';
import {
  mockCoursesMetrics,
  mockCoursesList,
  CourseItem,
  CourseLevel,
  CourseStatus
} from '@/lib/mock-data/courses-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from 'next-auth/react';

const courseIconMap: Record<string, React.ElementType> = {
  Brain,
  Network,
  Code,
  BarChart,
  Database,
  MessageSquare,
  Eye,
  Calculator,
  Sparkles,
  Layers,
  BookOpen,
};

const levelBadgeStyles: Record<CourseLevel, string> = {
  Beginner: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Intermediate: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Advanced: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

const statusBadgeStyles: Record<CourseStatus, string> = {
  Published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Draft: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'In Review': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Archived: 'bg-zinc-800 text-zinc-400 border-zinc-700',
};

const difficultyConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  Beginner: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', label: 'Easy' },
  Intermediate: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', label: 'Medium' },
  Advanced: { color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/25', label: 'Hard' },
};

type ApiCourseData = Partial<CourseItem> & {
  id: string;
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  price?: string;
  students?: string;
  status: CourseStatus;
  updatedAt?: string;
  thumbnailIcon?: string;
  instructor?: { id?: string; name?: string; avatar?: string };
};

// ─────────────────────────────────────────────
// LEARNER COURSE CATALOG (TryHackMe-style)
// ─────────────────────────────────────────────
function LearnerCourseCatalog() {
  const { data: apiResponse, isLoading } = useCourses({ page: 1, limit: 100 });

  const courses: CourseItem[] = useMemo(() => {
    if (apiResponse?.data && apiResponse.data.length > 0) {
      return (apiResponse.data as ApiCourseData[]).map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        level: c.level as CourseLevel,
        instructor: {
          id: c.instructor?.id || 'usr-2',
          name: c.instructor?.name || 'Dr. Alex Morgan',
          avatar: c.instructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        },
        price: c.price || 'Free',
        students: c.students || '0',
        status: c.status as CourseStatus,
        updatedAt: c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : 'Recently',
        thumbnailIcon: c.thumbnailIcon || 'Brain',
      }));
    }
    return mockCoursesList;
  }, [apiResponse]);

  const publishedCourses = useMemo(() => courses.filter(c => c.status === 'Published'), [courses]);

  const [catalogMode, setCatalogMode] = useState<'courses' | 'industry_highway'>('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedDetailCourse, setSelectedDetailCourse] = useState<CourseItem | null>(null);
  const filterTabs = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = useMemo(() => {
    return publishedCourses.filter((c) => {
      if (activeFilter !== 'All' && c.level !== activeFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [publishedCourses, activeFilter, searchQuery]);

  const categoryGroups = useMemo(() => {
    const groups: Record<string, CourseItem[]> = {};
    filteredCourses.forEach((c) => {
      if (!groups[c.category]) groups[c.category] = [];
      groups[c.category].push(c);
    });
    return groups;
  }, [filteredCourses]);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <Card className="relative overflow-hidden rounded-2xl border-purple-500/20 bg-gradient-to-br from-purple-950/60 via-[#121217] to-indigo-950/40 p-6 sm:p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzMzZWEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6bTAtMzBWMEgydjRoMzR6TTIgMjBoMzR2NEgydi00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-purple-400" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Course Catalog & Placement Highway</h1>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Master real-world AI, Machine Learning, and Agentic Systems with structured courses built backwards from top industry job requirements.
            </p>
            <div className="flex items-center gap-4 pt-1 text-xs font-semibold flex-wrap">
              <span className="flex items-center gap-1.5 text-purple-400">
                <Layers className="w-3.5 h-3.5" />
                {publishedCourses.length} Courses
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Award className="w-3.5 h-3.5" />
                ISO 17024 Badges
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <Zap className="w-3.5 h-3.5" />
                120+ Hiring Partners
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/20 flex items-center justify-center">
              <GraduationCap className="w-12 h-12 sm:w-14 sm:h-14 text-purple-400/80" />
            </div>
          </div>
        </div>
      </Card>

      {/* Catalog Mode Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-[#121217] border border-[#272730] rounded-2xl flex-wrap">
        <button
          onClick={() => setCatalogMode('courses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            catalogMode === 'courses'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>All Structured Courses ({publishedCourses.length})</span>
        </button>
        <button
          onClick={() => setCatalogMode('industry_highway')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            catalogMode === 'industry_highway'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4 text-amber-400" />
          <span>Industry AI Pulse & Job Placement Highway (120+ Partners)</span>
        </button>
      </div>

      {catalogMode === 'industry_highway' ? (
        <IndustryAIPlacementHighway />
      ) : (
        <>
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    activeFilter === tab
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30 font-bold'
                      : 'bg-[#181820] border border-[#272730] text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
                  }`}
                >
                  {tab === 'All' ? 'All Levels' : tab}
                </button>
              ))}
            </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="pl-9 pr-4 py-2 h-9 text-xs bg-[#121217] border-[#272730] text-zinc-100 placeholder:text-zinc-500 rounded-xl focus:border-purple-500/40"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-[#121217] border-[#272730] rounded-2xl p-5 animate-pulse space-y-4">
              <div className="h-4 bg-[#1e1e28] rounded w-3/4" />
              <div className="h-3 bg-[#1e1e28] rounded w-full" />
              <div className="h-3 bg-[#1e1e28] rounded w-2/3" />
              <div className="h-8 bg-[#1e1e28] rounded-xl w-1/3 mt-4" />
            </Card>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card className="p-12 bg-[#121217] border-[#272730] rounded-2xl text-center space-y-3">
          <Search className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-300">No courses found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search or filter criteria to find what you&apos;re looking for.
          </p>
          <Button
            onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
            variant="outline"
            className="bg-[#181820] border-[#272730] text-zinc-300 text-xs h-8 px-4 rounded-xl mt-2"
          >
            Clear Filters
          </Button>
        </Card>
      ) : (
        Object.entries(categoryGroups).map(([category, categoryCourses]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h2 className="text-sm font-bold text-white">{category}</h2>
                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-mono font-bold rounded border border-purple-500/20">
                  {categoryCourses.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoryCourses.map((course) => {
                const Icon = courseIconMap[course.thumbnailIcon] || Brain;
                const diff = difficultyConfig[course.level] || difficultyConfig.Beginner;
                const progress = 0;
                const isStarted = progress > 0;
                const isCompleted = progress >= 100;

                return (
                  <Card
                    key={course.id}
                    className="group bg-[#121217] border border-[#272730] rounded-2xl overflow-hidden hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-900/10 transition-all duration-300"
                  >
                    {/* Card Header Accent */}
                    <div className={`h-1 w-full ${
                      course.level === 'Beginner' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                      course.level === 'Intermediate' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                      'bg-gradient-to-r from-rose-500 to-pink-600'
                    }`} />

                    <div className="p-5 space-y-4">
                      {/* Title Row */}
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${diff.bg} ${diff.border}`}>
                          <Icon className={`w-5 h-5 ${diff.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-zinc-100 leading-snug group-hover:text-purple-300 transition-colors line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                        </div>
                      </div>

                      {/* Meta Tags Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${diff.bg} ${diff.border} ${diff.color}`}>
                          <Flame className="w-3 h-3" />
                          {diff.label}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${levelBadgeStyles[course.level]}`}>
                          {course.level}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                          <Clock className="w-3 h-3 text-purple-400" />
                          {course.totalHours || '18.5 hrs'}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-secondary text-muted-foreground border border-border">
                          <BookOpen className="w-3 h-3 text-purple-400" />
                          {course.totalLectures || 38} lectures
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {course.rating || 4.9}
                        </span>
                        {course.price === 'Free' ? (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold rounded-md">
                            Free
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold rounded-md">
                            {course.price}
                          </span>
                        )}
                      </div>

                      {/* Instructor & Stats */}
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 h-5 border border-[#2e2e3a]">
                            <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                            <AvatarFallback className="text-[8px]">{course.instructor.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-zinc-300 truncate max-w-[120px]">{course.instructor.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {course.students}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar (only shown if started) */}
                      {isStarted && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-zinc-500 font-medium">Progress</span>
                            <span className="font-mono font-bold text-purple-400">{progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-purple-600'}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Action Buttons: Udemy Syllabus Modal + Start Course */}
                      <div className="pt-2 grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedDetailCourse(course)}
                          className="w-full bg-[#181820] hover:bg-secondary border-[#272730] text-zinc-300 hover:text-white text-[11px] font-bold h-9 rounded-xl gap-1.5 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                          <span>Syllabus & Times</span>
                        </Button>

                        {isCompleted ? (
                          <Link href={`/learn/${course.id}`} className="block">
                            <Button
                              variant="outline"
                              className="w-full bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-bold h-9 rounded-xl gap-1.5 transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Review
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/learn/${course.id}`} className="block">
                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold h-9 rounded-xl gap-1.5 shadow-md shadow-purple-900/30 transition-all group-hover:shadow-lg group-hover:shadow-purple-900/40">
                              <Play className="w-3.5 h-3.5" />
                              Start
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Bottom CTA Banner */}
      <Card className="p-6 bg-card border border-border hover:border-purple-500/40 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Earn Certificates</h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Complete courses and earn verified certificates to showcase your expertise.
            </p>
          </div>
        </div>
        <Link href="/roadmap">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-9 px-5 rounded-xl gap-2 shadow-md shadow-purple-900/30 cursor-pointer">
            <span>View Learning Path</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </Card>
      </>
      )}

      {/* Udemy-Grade Detailed Course Syllabus & Objectives Modal */}
      <CourseDetailModal
        course={selectedDetailCourse}
        isOpen={!!selectedDetailCourse}
        onClose={() => setSelectedDetailCourse(null)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// ADMIN COURSE MANAGEMENT (Original Table View)
// ─────────────────────────────────────────────
function AdminCoursesTable() {
  const searchParams = useSearchParams();
  const { data: apiResponse } = useCourses({ page: 1, limit: 100 });
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  const deleteCourseMutation = useDeleteCourse();

  const [localCourses, setLocalCourses] = useState<CourseItem[] | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const coursesList: CourseItem[] = useMemo(() => {
    if (localCourses) return localCourses;
    if (apiResponse?.data && apiResponse.data.length > 0) {
      return (apiResponse.data as ApiCourseData[]).map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        level: c.level as CourseLevel,
        instructor: {
          id: c.instructor?.id || 'usr-2',
          name: c.instructor?.name || 'Dr. Alex Morgan',
          avatar: c.instructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        },
        price: c.price || 'Free',
        students: c.students || '0',
        status: c.status as CourseStatus,
        updatedAt: c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : 'Recently',
        thumbnailIcon: c.thumbnailIcon || 'Brain',
      }));
    }
    return mockCoursesList;
  }, [apiResponse, localCourses]);

  const [activeTab, setActiveTab] = useState<string>(searchParams?.get('tab') || 'All Courses');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [levelFilter, setLevelFilter] = useState<string>('All Levels');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const availableCategories = useMemo(() => {
    return Array.from(new Set(coursesList.map((c) => c.category))).filter(Boolean);
  }, [coursesList]);

  const filteredCourses = useMemo(() => {
    return coursesList.filter((c) => {
      if (activeTab !== 'All Courses' && c.status !== activeTab) return false;
      if (categoryFilter !== 'All Categories' && c.category !== categoryFilter) return false;
      if (levelFilter !== 'All Levels' && c.level !== levelFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.instructor.name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [coursesList, activeTab, categoryFilter, levelFilter, searchQuery]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(filteredCourses.map((c) => c.id));
    else setSelectedIds([]);
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) setSelectedIds((prev) => [...prev, id]);
    else setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const handleCreateCourse = (newCourse: CourseItem) => {
    createCourseMutation.mutate({
      title: newCourse.title,
      description: newCourse.description,
      category: newCourse.category,
      level: newCourse.level,
      price: newCourse.price,
      status: newCourse.status,
      thumbnailIcon: newCourse.thumbnailIcon,
      instructorId: newCourse.instructor.id || 'usr-inst-1',
    });
    setLocalCourses((prev) => [newCourse, ...(prev || coursesList)]);
  };

  const handlePublishCourse = (id: string) => {
    updateCourseMutation.mutate({ id, data: { status: 'Published' } });
    setLocalCourses((prev) =>
      (prev || coursesList).map((c) => (c.id === id ? { ...c, status: 'Published' } : c))
    );
  };

  const handleDeleteCourse = (id: string) => {
    deleteCourseMutation.mutate(id);
    setLocalCourses((prev) => (prev || coursesList).filter((c) => c.id !== id));
  };

  const donutData = [
    { name: 'Published', value: 182, percentage: '71.1%', color: '#10b981' },
    { name: 'Drafts', value: 38, percentage: '14.8%', color: '#f59e0b' },
    { name: 'In Review', value: 16, percentage: '6.3%', color: '#3b82f6' },
    { name: 'Archived', value: 20, percentage: '7.8%', color: '#ef4444' },
  ];

  const topCategories = [
    { name: 'AI & ML', count: 78, percentage: '30.5%', width: 100 },
    { name: 'Data Science', count: 64, percentage: '25.0%', width: 82 },
    { name: 'Programming', count: 48, percentage: '18.8%', width: 61 },
    { name: 'Business', count: 32, percentage: '12.5%', width: 41 },
    { name: 'Design', count: 16, percentage: '6.3%', width: 20 },
  ];

  const recentActivities = [
    { id: 'act-1', text: 'Course "Deep Learning with Python" updated by Sarah Johnson', time: '2 hours ago', color: 'text-blue-400 bg-blue-500/10' },
    { id: 'act-2', text: 'New course "Statistics Essentials" created by David Wilson', time: '4 hours ago', color: 'text-purple-400 bg-purple-500/10' },
    { id: 'act-3', text: 'Course "SQL for Data Analysis" published by Michael Smith', time: '6 hours ago', color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 'act-4', text: 'Course "Computer Vision Basics" moved to Draft by Jessica Lee', time: '1 day ago', color: 'text-amber-400 bg-amber-500/10' },
  ];

  return (
    <div className="space-y-6 max-w-[1800px] mx-auto pb-12">
      {/* Create Course Modal */}
      <CreateCourseModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreateCourse={handleCreateCourse}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link href="/" className="hover:text-zinc-200 transition-colors">Dashboard</Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span>Content & Learning</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-purple-400 font-semibold">Courses</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Courses</h1>
            <GraduationCap className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Create, manage and organize all courses. Control curriculum, pricing, access and enrollments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl gap-1.5 shadow-sm shadow-purple-900/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </Button>

          <Button variant="outline" className="bg-[#181820] border-[#272730] hover:bg-[#20202b] text-zinc-200 text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5">
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span>Import</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </Button>

          <Button variant="outline" className="bg-[#181820] border-[#272730] hover:bg-[#20202b] text-zinc-200 text-xs font-semibold px-4 py-2 h-9 rounded-xl gap-1.5">
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {mockCoursesMetrics.map((metric) => (
          <Card key={metric.id} className="bg-[#121217] border border-[#272730] p-4 rounded-xl shadow-sm hover:border-[#3b3b47] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{metric.title}</span>
              <div className="w-8 h-8 rounded-lg border bg-purple-500/10 text-purple-400 border-purple-500/20 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-2xl font-bold tracking-tight text-white font-mono">{metric.value}</span>
              <div className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-md border text-purple-400 bg-purple-500/10 border-purple-500/20">
                {metric.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                <span>{metric.change}</span>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 mt-2 font-medium">{metric.period}</p>
          </Card>
        ))}
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Main Table (Span 3) */}
        <Card className="lg:col-span-3 bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
          {/* Tabs & Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#272730] pb-3">
            <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {['All Courses', 'Published', 'Drafts', 'In Review', 'Archived'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all relative ${
                    activeTab === tab
                      ? 'text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181820]'
                  }`}
                >
                  {tab}
                  {activeTab === tab && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-purple-500 rounded-full" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="pl-9 pr-4 py-1.5 h-8 text-xs bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 rounded-lg"
                />
              </div>

              <Button variant="outline" size="sm" className="h-8 text-xs border-[#272730] bg-[#181820] text-zinc-300 gap-1.5">
                <Filter className="w-3.5 h-3.5 text-purple-400" />
                <span>Filters</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              </Button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-3 bg-[#181820] border border-[#272730] rounded-xl text-xs flex flex-wrap items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none"
            >
              <option value="All Categories">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="h-8 px-2.5 bg-[#121217] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none"
            >
              <option value="All Levels">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <button
              onClick={() => {
                setCategoryFilter('All Categories');
                setLevelFilter('All Levels');
                setSearchQuery('');
              }}
              className="text-xs text-zinc-400 hover:text-white ml-auto cursor-pointer"
            >
              Clear
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="bg-[#181820] text-zinc-400 font-semibold border-b border-[#272730] uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={filteredCourses.length > 0 && selectedIds.length === filteredCourses.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-[#33333d] bg-[#121217] text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Level</th>
                  <th className="p-3">Instructor</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Students</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Updated</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23232b]">
                {filteredCourses.map((c) => {
                  const Icon = courseIconMap[c.thumbnailIcon] || Brain;
                  const isSelected = selectedIds.includes(c.id);

                  return (
                    <tr key={c.id} className={`hover:bg-[#181820]/60 transition-colors ${isSelected ? 'bg-purple-950/20' : ''}`}>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(c.id, e.target.checked)}
                          className="rounded border-[#33333d] bg-[#121217] text-purple-600 cursor-pointer"
                        />
                      </td>
                      <td className="p-3 max-w-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-zinc-100 text-xs truncate leading-tight">{c.title}</p>
                            <p className="text-[11px] text-zinc-500 truncate mt-0.5">{c.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="bg-[#181820] text-zinc-300 px-2 py-0.5 rounded border border-[#272730] text-[11px] font-medium">
                          {c.category}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${levelBadgeStyles[c.level]}`}>
                          {c.level}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6 border border-[#2e2e3a]">
                            <AvatarImage src={c.instructor.avatar} alt={c.instructor.name} />
                            <AvatarFallback>{c.instructor.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-zinc-200 text-xs">{c.instructor.name}</span>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono font-semibold text-zinc-200">{c.price}</td>
                      <td className="p-3 whitespace-nowrap font-mono font-bold text-zinc-300">{c.students}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusBadgeStyles[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono text-zinc-400">{c.updatedAt}</td>
                      <td className="p-3 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<button className="p-1 text-zinc-400 hover:text-white hover:bg-[#20202b] rounded-md transition-colors cursor-pointer" />}>
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44 bg-[#121217] border-[#272730] text-zinc-200 rounded-xl p-1">
                            <Link href={`/learn/${c.id}`}>
                              <DropdownMenuItem className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2">
                                <Eye className="w-3.5 h-3.5 text-zinc-400" /> View Course
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator className="bg-[#272730]" />
                            {c.status !== 'Published' && (
                              <DropdownMenuItem
                                onClick={() => handlePublishCourse(c.id)}
                                className="text-xs text-emerald-400 focus:bg-emerald-500/10 cursor-pointer gap-2"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Publish Live
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeleteCourse(c.id)}
                              className="text-xs text-rose-400 focus:bg-rose-500/10 cursor-pointer gap-2"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#23232b] text-xs text-zinc-400">
            <div>
              Showing <span className="font-semibold text-white font-mono">1</span> to{' '}
              <span className="font-semibold text-white font-mono">{filteredCourses.length}</span> of{' '}
              <span className="font-semibold text-white font-mono">{coursesList.length}</span> courses
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="icon" className="h-8 w-8 bg-[#181820] border-[#272730] text-zinc-300">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <button className="h-8 w-8 rounded-lg font-mono font-bold text-xs bg-purple-600 text-white">1</button>
              <button className="h-8 w-8 rounded-lg font-mono text-xs bg-[#181820] text-zinc-400 border border-[#272730]">2</button>
              <button className="h-8 w-8 rounded-lg font-mono text-xs bg-[#181820] text-zinc-400 border border-[#272730]">3</button>
              <span className="px-1 text-zinc-600">...</span>
              <button className="h-8 px-2 rounded-lg font-mono text-xs bg-[#181820] text-zinc-400 border border-[#272730]">26</button>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-[#181820] border-[#272730] text-zinc-300">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Analytics Sidebar (Span 1) */}
        <div className="space-y-6">
          {/* Overview Donut */}
          <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white">Course Overview</h3>
            <div className="relative h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                    {donutData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-mono text-white">{coursesList.length}</span>
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Total</span>
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-[#23232b]">
              {donutData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-zinc-300">{item.name}</span>
                  </div>
                  <span className="font-mono text-zinc-400">{item.value} ({item.percentage})</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Categories */}
          <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Top Categories</h3>
              <button className="text-xs font-semibold text-purple-400 hover:text-purple-300">View All</button>
            </div>
            <div className="space-y-3.5 text-xs">
              {topCategories.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-zinc-200">{cat.name}</span>
                    <span className="font-mono text-zinc-400 font-bold">{cat.count} ({cat.percentage})</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${cat.width}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Recent Activity</h3>
              <button className="text-xs font-semibold text-purple-400 hover:text-purple-300">View All</button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/5 mt-0.5 ${act.color}`}>
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-zinc-200 leading-snug">{act.text}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-[#23232b]">
              <button className="w-full text-center text-xs font-semibold text-zinc-300 hover:text-purple-400 flex items-center justify-center gap-1.5 transition-colors group">
                <span>Go to Course Analytics</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PAGE EXPORT — Role-Aware Shell & View
// ─────────────────────────────────────────────
const ADMIN_ROLES = ['Admin', 'Super Admin', 'Moderator', 'Editor'];

export default function CoursesPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string })?.role || 'User';
  const isAdmin = ADMIN_ROLES.includes(userRole);

  if (isAdmin) {
    return (
      <AdminShell>
        <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading courses...</div>}>
          <AdminCoursesTable />
        </Suspense>
      </AdminShell>
    );
  }

  return (
    <NexusShell>
      <LearnerCourseCatalog />
    </NexusShell>
  );
}
