'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Trash2,
  Edit3,
  Clock,
  Sparkles,
  ExternalLink,
  Code,
  AlertCircle,
  HelpCircle,
  Save,
  Check,
  Search,
  Eye,
  FolderPlus,
  FilePlus,
  Briefcase
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  RevBodhCourse,
  RevBodhModule,
  RevBodhLesson,
  ContentStatus,
  DifficultyLevel,
  RevBodhQuizQuestion,
  RevBodhInterviewQuestion
} from '@/types/revbodh-course';
import { RevBodhCourseService } from '@/services/revbodh-course-service';
import { REV_BODH_PYTHON_COURSE } from '@/lib/data/revbodh-python-course';

const STATUS_CONFIG: Record<ContentStatus, { label: string; color: string; bg: string; border: string }> = {
  DRAFT: { label: 'Draft', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  REVIEW: { label: 'In Review', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  PUBLISHED: { label: 'Published', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
};

export function RevBodhContentCMS() {
  const [courses, setCourses] = useState<RevBodhCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(REV_BODH_PYTHON_COURSE.id);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [selectedLesson, setSelectedLesson] = useState<RevBodhLesson | null>(null);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'editor'>('curriculum');
  const [editorSection, setEditorSection] = useState<'concept' | 'examples' | 'mistakes' | 'challenges' | 'quiz' | 'interview'>('concept');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ContentStatus>('ALL');

  // Load courses
  useEffect(() => {
    const list = RevBodhCourseService.getCourses();
    setCourses(list);
    if (list.length > 0 && !selectedCourseId) {
      setSelectedCourseId(list[0].id);
      if (list[0].modules.length > 0) {
        setSelectedModuleId(list[0].modules[0].id);
      }
    } else if (list.length > 0 && selectedCourseId) {
      const current = list.find((c) => c.id === selectedCourseId) || list[0];
      if (current.modules.length > 0 && !selectedModuleId) {
        setSelectedModuleId(current.modules[0].id);
      }
    }
  }, [selectedCourseId, selectedModuleId]);

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0] || REV_BODH_PYTHON_COURSE;
  const currentModule = currentCourse?.modules.find((m) => m.id === selectedModuleId) || currentCourse?.modules[0];

  const handleUpdateLessonStatus = (moduleId: string, lessonId: string, newStatus: ContentStatus) => {
    RevBodhCourseService.updateLessonStatus(currentCourse.id, moduleId, lessonId, newStatus);
    const updatedCourses = RevBodhCourseService.getCourses();
    setCourses(updatedCourses);

    if (selectedLesson && selectedLesson.id === lessonId) {
      setSelectedLesson({ ...selectedLesson, status: newStatus });
    }
  };

  const handleSelectLessonForEdit = (lesson: RevBodhLesson, moduleId: string) => {
    setSelectedModuleId(moduleId);
    setSelectedLesson(JSON.parse(JSON.stringify(lesson)));
    setActiveTab('editor');
  };

  const handleSaveLessonChanges = () => {
    if (!selectedLesson || !currentCourse || !selectedModuleId) return;

    const mod = currentCourse.modules.find((m) => m.id === selectedModuleId);
    if (!mod) return;

    const lIdx = mod.lessons.findIndex((l) => l.id === selectedLesson.id);
    if (lIdx >= 0) {
      mod.lessons[lIdx] = selectedLesson;
    } else {
      mod.lessons.push(selectedLesson);
      currentCourse.totalLessons += 1;
    }

    RevBodhCourseService.saveCourse(currentCourse);
    setCourses(RevBodhCourseService.getCourses());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleCreateNewLesson = (moduleId: string) => {
    const newLessonId = `lesson-${Date.now()}`;
    const newLesson: RevBodhLesson = {
      id: newLessonId,
      orderNumber: (currentModule?.lessons.length || 0) + 1,
      title: 'New Original RevBodh Lesson',
      slug: `new-lesson-${Date.now()}`,
      durationMinutes: 20,
      status: 'DRAFT',
      learningObjectives: ['Understand core terminology', 'Write first code block', 'Identify key industry usages'],
      conceptExplanation: {
        summary: 'Original explanation crafted specifically for RevBodh learners.',
        detailedMarkdown: `# Core Concept\n\nExplain the concept in simple, friendly, and pedagogically rich terms specifically for RevBodh learners.\n\n### Why this matters\nThis concept is a cornerstone of professional software engineering.`,
        keyTerms: [{ term: 'Core Concept', definition: 'Fundamental programming building block' }],
      },
      examples: [
        {
          title: 'Basic Example',
          description: 'Demonstrates straightforward variable assignment and printing.',
          language: 'python',
          code: `# RevBodh Original Example\nresult = 10 * 2\nprint(f"Calculated result: {result}")`,
          outputExplanation: 'Demonstrates straightforward variable assignment and f-string formatted printing.',
        },
      ],
      commonMistakes: [
        {
          mistake: 'Using uninitialized variables before assignment',
          whyItHappens: 'Forgetting to initialize state before looping or conditions',
          howToAvoid: 'Always declare base values prior to mutating them in conditional branches.',
          badCodeSnippet: 'count += 1',
          goodCodeSnippet: 'count = 0\ncount += 1',
        },
      ],
      realWorldApplication: {
        industryContext: 'Payment processors and financial platforms calculate fees and aggregates across transactions.',
        useCases: ['Streaming transaction aggregation', 'Audit trail generation'],
        productionTip: 'Prevents calculation drifts and maintains deterministic audit trails.',
      },
      practiceChallenge: {
        id: `ch-${Date.now()}`,
        title: 'Implement Core Transformation',
        difficulty: 'Beginner',
        problemStatement: 'Write a program that processes the input and prints the result.',
        requirements: ['Define function process(data)', 'Return the unmodified data as base requirement'],
        starterCode: '# Write your code here\ndef process(data):\n    return data\n',
        solutionCode: 'def process(data):\n    return data',
        testCases: [{ expectedOutput: 'OK', description: 'Core output verification' }],
        hints: ['Check your return type', 'Ensure no zero division'],
      },
      quizQuestions: [
        {
          id: `q-${Date.now()}`,
          question: 'What is the primary benefit of deterministic functions?',
          type: 'MULTIPLE_CHOICE',
          options: [
            'They always return the same output for given inputs',
            'They run at infinite speed',
            'They require no CPU memory',
            'They bypass type validation',
          ],
          correctAnswerIndex: 0,
          explanation: 'Deterministic functions ensure idempotent execution without hidden side effects.',
        },
      ],
      interviewQuestions: [
        {
          id: `iq-${Date.now()}`,
          question: 'How do you structure robust error boundaries in production?',
          exampleAnswer: 'By isolating exception scopes, logging structured telemetry, and gracefully failing over.',
          expectedConcepts: ['Use specific exception types', 'Clean up opened resources using context managers'],
          difficulty: 'Intermediate',
        },
      ],
    };

    RevBodhCourseService.addLesson(currentCourse.id, moduleId, newLesson);
    setCourses(RevBodhCourseService.getCourses());
    setSelectedLesson(newLesson);
    setSelectedModuleId(moduleId);
    setActiveTab('editor');
  };

  const handleCreateNewModule = () => {
    const modCount = currentCourse.modules.length;
    const newMod: RevBodhModule = {
      id: `mod-${Date.now()}`,
      orderNumber: modCount + 1,
      title: `Module ${modCount + 1}: Advanced Industry Focus`,
      description: 'Hands-on practical module crafted for career readiness.',
      status: 'DRAFT',
      lessons: [],
    };
    RevBodhCourseService.addModule(currentCourse.id, newMod);
    setCourses(RevBodhCourseService.getCourses());
    setSelectedModuleId(newMod.id);
  };

  const totalLessons = currentCourse?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0;
  const publishedLessons = currentCourse?.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.status === 'PUBLISHED').length,
    0
  ) || 0;
  const draftLessons = currentCourse?.modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.status === 'DRAFT').length,
    0
  ) || 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-purple-950/70 via-card to-card border border-purple-500/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              RevBodh Original Educational CMS
            </span>
            <span className="text-xs text-muted-foreground">• Zero YouTube Dependencies</span>
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight mt-1">
            Course Curriculum &amp; Content Management Studio
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Author and publish original RevBodh courseware following the pedagogical model:{' '}
            <span className="font-semibold text-purple-400">LEARN → UNDERSTAND → PRACTICE → BUILD → ASSESS → GET JOB READY</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/learn/${currentCourse.id}`} target="_blank">
            <Button variant="outline" className="text-xs h-9 gap-1.5 border-purple-500/40 text-purple-300 hover:bg-purple-500/10">
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Student View</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </Link>
          <Button
            onClick={handleCreateNewModule}
            className="text-xs h-9 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Add Module</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="text-xs text-muted-foreground font-medium">Total Modules</div>
          <div className="text-2xl font-black text-foreground mt-1">{currentCourse?.modules.length || 0}</div>
          <div className="text-[11px] text-purple-400 mt-1">Structured learning stages</div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="text-xs text-muted-foreground font-medium">Total Lessons</div>
          <div className="text-2xl font-black text-foreground mt-1">{totalLessons}</div>
          <div className="text-[11px] text-emerald-400 mt-1">{publishedLessons} Published live</div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="text-xs text-muted-foreground font-medium">Draft &amp; In-Review</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{draftLessons}</div>
          <div className="text-[11px] text-muted-foreground mt-1">Ready for content review</div>
        </Card>
        <Card className="p-4 bg-card border-border">
          <div className="text-xs text-muted-foreground font-medium">Interactive Sandboxes</div>
          <div className="text-2xl font-black text-blue-400 mt-1">100%</div>
          <div className="text-[11px] text-blue-400 mt-1">Every lesson has code + quiz</div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'curriculum'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            Curriculum &amp; Publishing Status
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            disabled={!selectedLesson}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'editor'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
          >
            Lesson Content Studio {selectedLesson ? `(${selectedLesson.title.slice(0, 20)}...)` : ''}
          </button>
        </div>

        {activeTab === 'curriculum' && (
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lessons or topics..."
                className="pl-8 h-8 text-xs bg-secondary/50 border-border"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              aria-label="Filter lessons by status"
              className="h-8 text-xs px-2.5 rounded-lg bg-secondary border border-border text-foreground"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="REVIEW">In Review</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        )}
      </div>

      {/* ─────────────────── TAB 1: CURRICULUM MANAGEMENT ─────────────────── */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          {currentCourse.modules.map((mod) => {
            const filteredLessons = mod.lessons.filter((l) => {
              if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
              if (searchQuery && !l.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
              return true;
            });

            return (
              <Card key={mod.id} className="p-5 bg-card border-border space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-400">
                        Module {mod.orderNumber}
                      </span>
                      <h3 className="text-base font-bold text-foreground">{mod.title}</h3>
                    </div>
                    {mod.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{mod.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {mod.lessons.length} lessons
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCreateNewLesson(mod.id)}
                      className="text-xs h-8 gap-1.5 border-border hover:bg-secondary text-foreground"
                    >
                      <FilePlus className="w-3.5 h-3.5 text-purple-400" />
                      <span>Add Lesson</span>
                    </Button>
                  </div>
                </div>

                {filteredLessons.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground italic bg-secondary/30 rounded-xl">
                    No lessons match the criteria in this module.
                  </div>
                ) : (
                  <div className="divide-y divide-border/40">
                    {filteredLessons.map((lesson) => {
                      const cfg = STATUS_CONFIG[lesson.status];
                      return (
                        <div
                          key={lesson.id}
                          className="py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:bg-secondary/20 px-2 rounded-lg transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <span className="font-mono text-xs text-muted-foreground w-6 pt-0.5">
                              {mod.orderNumber}.{lesson.orderNumber}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground hover:text-purple-300 cursor-pointer" onClick={() => handleSelectLessonForEdit(lesson, mod.id)}>
                                  {lesson.title}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                  {cfg.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {lesson.durationMinutes} mins
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Code className="w-3 h-3 text-blue-400" />
                                  {lesson.examples.length} Examples
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <HelpCircle className="w-3 h-3 text-amber-400" />
                                  {lesson.quizQuestions.length} Quiz Questions
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end md:self-auto">
                            {/* Fast status switcher */}
                            <select
                              value={lesson.status}
                              onChange={(e) => handleUpdateLessonStatus(mod.id, lesson.id, e.target.value as ContentStatus)}
                              aria-label="Update lesson status"
                              className="h-8 text-xs px-2 rounded-lg bg-secondary border border-border text-foreground font-semibold"
                            >
                              <option value="DRAFT">Draft</option>
                              <option value="REVIEW">In Review</option>
                              <option value="PUBLISHED">Published</option>
                            </select>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSelectLessonForEdit(lesson, mod.id)}
                              className="text-xs h-8 gap-1 border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Lesson Content</span>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* ─────────────────── TAB 2: LESSON CONTENT STUDIO ─────────────────── */}
      {activeTab === 'editor' && selectedLesson && (
        <div className="space-y-6">
          {/* Top Bar for Editor */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card border border-border rounded-xl">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('curriculum')}
                className="text-xs h-8 border-border hover:bg-secondary text-foreground"
              >
                Back to Curriculum
              </Button>
              <div>
                <div className="text-xs text-muted-foreground">Editing Lesson:</div>
                <div className="text-base font-bold text-foreground">{selectedLesson.title}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Status:</span>
                <select
                  value={selectedLesson.status}
                  onChange={(e) => setSelectedLesson({ ...selectedLesson, status: e.target.value as ContentStatus })}
                  aria-label="Edit selected lesson status"
                  className="h-8 text-xs px-2 rounded-lg bg-secondary border border-border text-foreground font-bold"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="REVIEW">In Review</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>

              <Button
                onClick={handleSaveLessonChanges}
                className="text-xs h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{saveSuccess ? 'Saved Successfully' : 'Save Changes'}</span>
              </Button>
            </div>
          </div>

          {/* Lesson Metadata Header Form */}
          <Card className="p-5 bg-card border-border space-y-4">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Lesson Metadata</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground font-semibold">Lesson Title</label>
                <Input
                  value={selectedLesson.title}
                  onChange={(e) => setSelectedLesson({ ...selectedLesson, title: e.target.value })}
                  className="text-xs h-9 bg-secondary border-border text-foreground mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground font-semibold">Estimated Minutes</label>
                <Input
                  type="number"
                  value={selectedLesson.durationMinutes}
                  onChange={(e) => setSelectedLesson({ ...selectedLesson, durationMinutes: Number(e.target.value) || 20 })}
                  className="text-xs h-9 bg-secondary border-border text-foreground mt-1"
                />
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <label className="text-xs text-foreground font-bold">Learning Objectives (What learner will master)</label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setSelectedLesson({
                      ...selectedLesson,
                      learningObjectives: [...selectedLesson.learningObjectives, 'New learning objective'],
                    })
                  }
                  className="text-[11px] h-7 border-border hover:bg-secondary text-foreground"
                >
                  + Add Objective
                </Button>
              </div>
              {selectedLesson.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-purple-400">{i + 1}.</span>
                  <Input
                    value={obj}
                    onChange={(e) => {
                      const next = [...selectedLesson.learningObjectives];
                      next[i] = e.target.value;
                      setSelectedLesson({ ...selectedLesson, learningObjectives: next });
                    }}
                    className="text-xs h-8 bg-secondary border-border text-foreground flex-1"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const next = selectedLesson.learningObjectives.filter((_, idx) => idx !== i);
                      setSelectedLesson({ ...selectedLesson, learningObjectives: next });
                    }}
                    className="text-rose-400 hover:text-rose-300 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Section Sub-Tabs */}
          <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
            <button
              onClick={() => setEditorSection('concept')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                editorSection === 'concept'
                  ? 'bg-purple-600 text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Concept Explanation</span>
            </button>
            <button
              onClick={() => setEditorSection('examples')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                editorSection === 'examples'
                  ? 'bg-purple-600 text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Code Examples</span>
            </button>
            <button
              onClick={() => setEditorSection('mistakes')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                editorSection === 'mistakes'
                  ? 'bg-purple-600 text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Common Mistakes</span>
            </button>
            <button
              onClick={() => setEditorSection('challenges')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                editorSection === 'challenges'
                  ? 'bg-purple-600 text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Practice Challenge</span>
            </button>
            <button
              onClick={() => setEditorSection('quiz')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                editorSection === 'quiz'
                  ? 'bg-purple-600 text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Quiz Questions</span>
            </button>
            <button
              onClick={() => setEditorSection('interview')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                editorSection === 'interview'
                  ? 'bg-purple-600 text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Interview Questions</span>
            </button>
          </div>

          {/* Section: Concept Explanation */}
          {editorSection === 'concept' && (
            <Card className="p-5 bg-card border-border space-y-4">
              <div>
                <h4 className="text-sm font-bold text-foreground">Pedagogical Concept Explanation (Markdown)</h4>
                <p className="text-xs text-muted-foreground">Original, clear explanation written specifically for RevBodh learners.</p>
              </div>
              <textarea
                rows={16}
                value={selectedLesson.conceptExplanation.detailedMarkdown}
                onChange={(e) =>
                  setSelectedLesson({
                    ...selectedLesson,
                    conceptExplanation: {
                      ...selectedLesson.conceptExplanation,
                      detailedMarkdown: e.target.value,
                    },
                  })
                }
                className="font-mono text-xs bg-[#09090c] border-border text-zinc-200 leading-relaxed"
                placeholder="# Concept Title&#10;&#10;Write clear, original explanation..."
              />
            </Card>
          )}

          {/* Section: Code Examples */}
          {editorSection === 'examples' && (
            <Card className="p-5 bg-card border-border space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">Executable Code Examples</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setSelectedLesson({
                      ...selectedLesson,
                      examples: [
                        ...selectedLesson.examples,
                        {
                          title: 'New Code Example',
                          description: 'Example walkthrough',
                          language: 'python',
                          code: '# Write code here\nprint("Hello RevBodh")',
                          outputExplanation: 'Explanation of what this code does step by step.',
                        },
                      ],
                    })
                  }
                  className="text-xs h-7 border-border hover:bg-secondary text-foreground"
                >
                  + Add Code Example
                </Button>
              </div>

              <div className="space-y-4">
                {selectedLesson.examples.map((ex, i) => (
                  <div key={i} className="p-4 bg-secondary/30 rounded-xl border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <Input
                        value={ex.title}
                        onChange={(e) => {
                          const next = [...selectedLesson.examples];
                          next[i].title = e.target.value;
                          setSelectedLesson({ ...selectedLesson, examples: next });
                        }}
                        placeholder="Example Title"
                        className="text-xs h-8 bg-card border-border text-foreground font-bold max-w-sm"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const next = selectedLesson.examples.filter((_, idx) => idx !== i);
                          setSelectedLesson({ ...selectedLesson, examples: next });
                        }}
                        className="text-rose-400 hover:text-rose-300 h-7 w-7 p-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <textarea
                      rows={6}
                      value={ex.code}
                      onChange={(e) => {
                        const next = [...selectedLesson.examples];
                        next[i].code = e.target.value;
                        setSelectedLesson({ ...selectedLesson, examples: next });
                      }}
                      className="font-mono text-xs bg-[#09090c] border-border text-emerald-300"
                    />
                    <textarea
                      rows={2}
                      value={ex.outputExplanation}
                      onChange={(e) => {
                        const next = [...selectedLesson.examples];
                        next[i].outputExplanation = e.target.value;
                        setSelectedLesson({ ...selectedLesson, examples: next });
                      }}
                      placeholder="Explain what the code does line-by-line..."
                      className="text-xs bg-card border-border text-foreground"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Section: Common Mistakes */}
          {editorSection === 'mistakes' && (
            <Card className="p-5 bg-card border-border space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">Common Student Mistakes &amp; Fixes</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setSelectedLesson({
                      ...selectedLesson,
                      commonMistakes: [
                        ...selectedLesson.commonMistakes,
                        {
                          mistake: 'Describe the common mistake',
                          whyItHappens: 'Explain why it happens or fails',
                          howToAvoid: 'Tip to avoid this trap in real code',
                          badCodeSnippet: '# Incorrect snippet',
                          goodCodeSnippet: '# Corrected snippet',
                        },
                      ],
                    })
                  }
                  className="text-xs h-7 border-border hover:bg-secondary text-foreground"
                >
                  + Add Mistake
                </Button>
              </div>

              <div className="space-y-4">
                {selectedLesson.commonMistakes.map((m, i) => (
                  <div key={i} className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <Input
                        value={m.mistake}
                        onChange={(e) => {
                          const next = [...selectedLesson.commonMistakes];
                          next[i].mistake = e.target.value;
                          setSelectedLesson({ ...selectedLesson, commonMistakes: next });
                        }}
                        placeholder="What is the mistake?"
                        className="text-xs h-8 bg-card border-border text-rose-300 font-bold"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const next = selectedLesson.commonMistakes.filter((_, idx) => idx !== i);
                          setSelectedLesson({ ...selectedLesson, commonMistakes: next });
                        }}
                        className="text-rose-400 hover:text-rose-300 h-7 w-7 p-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <textarea
                      rows={2}
                      value={m.whyItHappens}
                      onChange={(e) => {
                        const next = [...selectedLesson.commonMistakes];
                        next[i].whyItHappens = e.target.value;
                        setSelectedLesson({ ...selectedLesson, commonMistakes: next });
                      }}
                      placeholder="Why does it happen?"
                      className="text-xs bg-card border-border text-foreground"
                    />
                    <textarea
                      rows={2}
                      value={m.howToAvoid}
                      onChange={(e) => {
                        const next = [...selectedLesson.commonMistakes];
                        next[i].howToAvoid = e.target.value;
                        setSelectedLesson({ ...selectedLesson, commonMistakes: next });
                      }}
                      placeholder="How to avoid it?"
                      className="text-xs bg-card border-border text-foreground"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Section: Practice Challenge */}
          {editorSection === 'challenges' && (
            <Card className="p-5 bg-card border-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Interactive Practice Challenge (Sandbox Evaluated)</h4>
                  <p className="text-xs text-muted-foreground">Each lesson can have a dedicated interactive coding challenge.</p>
                </div>
              </div>

              {selectedLesson.practiceChallenge ? (
                <div className="p-4 bg-secondary/30 rounded-xl border border-border space-y-3">
                  <Input
                    value={selectedLesson.practiceChallenge.title}
                    onChange={(e) => {
                      if (!selectedLesson.practiceChallenge) return;
                      setSelectedLesson({
                        ...selectedLesson,
                        practiceChallenge: {
                          ...selectedLesson.practiceChallenge,
                          title: e.target.value,
                        },
                      });
                    }}
                    placeholder="Challenge Title"
                    className="text-xs h-8 bg-card border-border text-foreground font-bold"
                  />
                  <textarea
                    rows={3}
                    value={selectedLesson.practiceChallenge.problemStatement}
                    onChange={(e) => {
                      if (!selectedLesson.practiceChallenge) return;
                      setSelectedLesson({
                        ...selectedLesson,
                        practiceChallenge: {
                          ...selectedLesson.practiceChallenge,
                          problemStatement: e.target.value,
                        },
                      });
                    }}
                    placeholder="Problem statement..."
                    className="text-xs bg-card border-border text-foreground"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground">Starter Code</label>
                      <textarea
                        rows={4}
                        value={selectedLesson.practiceChallenge.starterCode}
                        onChange={(e) => {
                          if (!selectedLesson.practiceChallenge) return;
                          setSelectedLesson({
                            ...selectedLesson,
                            practiceChallenge: {
                              ...selectedLesson.practiceChallenge,
                              starterCode: e.target.value,
                            },
                          });
                        }}
                        className="font-mono text-xs bg-[#09090c] border-border text-zinc-300 mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground">Solution Code</label>
                      <textarea
                        rows={4}
                        value={selectedLesson.practiceChallenge.solutionCode || ''}
                        onChange={(e) => {
                          if (!selectedLesson.practiceChallenge) return;
                          setSelectedLesson({
                            ...selectedLesson,
                            practiceChallenge: {
                              ...selectedLesson.practiceChallenge,
                              solutionCode: e.target.value,
                            },
                          });
                        }}
                        className="font-mono text-xs bg-[#09090c] border-border text-emerald-300 mt-1"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center border border-dashed border-border rounded-xl">
                  <Button
                    onClick={() =>
                      setSelectedLesson({
                        ...selectedLesson,
                        practiceChallenge: {
                          id: `ch-${Date.now()}`,
                          title: 'Code Practice Challenge',
                          difficulty: 'Beginner',
                          problemStatement: 'Solve the algorithmic requirement and return the expected value.',
                          requirements: ['Define function solve()', 'Pass all test cases'],
                          starterCode: 'def solve():\n    return True\n',
                          testCases: [{ expectedOutput: 'True', description: 'Returns boolean truth' }],
                          hints: ['Check your logic carefully'],
                        },
                      })
                    }
                    className="text-xs bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    + Add Practice Challenge to Lesson
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Section: Quiz Questions */}
          {editorSection === 'quiz' && (
            <Card className="p-5 bg-card border-border space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">Interactive Quiz Questions</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setSelectedLesson({
                      ...selectedLesson,
                      quizQuestions: [
                        ...selectedLesson.quizQuestions,
                        {
                          id: `q-${Date.now()}`,
                          question: 'New Question Prompt',
                          type: 'MULTIPLE_CHOICE',
                          options: ['Option A', 'Option B', 'Option C', 'Option D'],
                          correctAnswerIndex: 0,
                          explanation: 'Explanation why Option A is correct.',
                        },
                      ],
                    })
                  }
                  className="text-xs h-7 border-border hover:bg-secondary text-foreground"
                >
                  + Add Quiz Question
                </Button>
              </div>

              <div className="space-y-4">
                {selectedLesson.quizQuestions.map((q, i) => (
                  <div key={q.id} className="p-4 bg-secondary/30 rounded-xl border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-purple-400">Question {i + 1}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const next = selectedLesson.quizQuestions.filter((_, idx) => idx !== i);
                          setSelectedLesson({ ...selectedLesson, quizQuestions: next });
                        }}
                        className="text-rose-400 hover:text-rose-300 h-7 w-7 p-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <Input
                      value={q.question}
                      onChange={(e) => {
                        const next = [...selectedLesson.quizQuestions];
                        next[i].question = e.target.value;
                        setSelectedLesson({ ...selectedLesson, quizQuestions: next });
                      }}
                      placeholder="Question prompt..."
                      className="text-xs bg-card border-border text-foreground font-semibold"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`quiz-correct-${q.id}`}
                            checked={q.correctAnswerIndex === optIdx}
                            onChange={() => {
                              const next = [...selectedLesson.quizQuestions];
                              next[i].correctAnswerIndex = optIdx;
                              setSelectedLesson({ ...selectedLesson, quizQuestions: next });
                            }}
                            className="text-purple-600 focus:ring-purple-500"
                          />
                          <Input
                            value={opt}
                            onChange={(e) => {
                              const next = [...selectedLesson.quizQuestions];
                              next[i].options[optIdx] = e.target.value;
                              setSelectedLesson({ ...selectedLesson, quizQuestions: next });
                            }}
                            className="text-xs h-8 bg-card border-border text-foreground flex-1"
                          />
                        </div>
                      ))}
                    </div>
                    <textarea
                      rows={2}
                      value={q.explanation}
                      onChange={(e) => {
                        const next = [...selectedLesson.quizQuestions];
                        next[i].explanation = e.target.value;
                        setSelectedLesson({ ...selectedLesson, quizQuestions: next });
                      }}
                      placeholder="Explanation displayed after student submits..."
                      className="text-xs bg-card border-border text-foreground"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Section: Interview Questions */}
          {editorSection === 'interview' && (
            <Card className="p-5 bg-card border-border space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">Industry Interview Questions</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setSelectedLesson({
                      ...selectedLesson,
                      interviewQuestions: [
                        ...selectedLesson.interviewQuestions,
                        {
                          id: `iq-${Date.now()}`,
                          question: 'Technical interview question prompt',
                          exampleAnswer: 'Comprehensive model answer expected in technical screening...',
                          expectedConcepts: ['Key principle 1', 'Key principle 2'],
                          difficulty: 'Intermediate',
                        },
                      ],
                    })
                  }
                  className="text-xs h-7 border-border hover:bg-secondary text-foreground"
                >
                  + Add Interview Question
                </Button>
              </div>

              <div className="space-y-4">
                {selectedLesson.interviewQuestions.map((iq, i) => (
                  <div key={iq.id} className="p-4 bg-secondary/30 rounded-xl border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <Input
                        value={iq.question}
                        onChange={(e) => {
                          const next = [...selectedLesson.interviewQuestions];
                          next[i].question = e.target.value;
                          setSelectedLesson({ ...selectedLesson, interviewQuestions: next });
                        }}
                        placeholder="Interview Question"
                        className="text-xs h-8 bg-card border-border text-foreground font-bold"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const next = selectedLesson.interviewQuestions.filter((_, idx) => idx !== i);
                          setSelectedLesson({ ...selectedLesson, interviewQuestions: next });
                        }}
                        className="text-rose-400 hover:text-rose-300 h-7 w-7 p-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <textarea
                      rows={3}
                      value={iq.exampleAnswer}
                      onChange={(e) => {
                        const next = [...selectedLesson.interviewQuestions];
                        next[i].exampleAnswer = e.target.value;
                        setSelectedLesson({ ...selectedLesson, interviewQuestions: next });
                      }}
                      placeholder="Model Answer..."
                      className="text-xs bg-card border-border text-foreground"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
