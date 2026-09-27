'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Tv,
  FileCode,
  CheckSquare,
  Trophy,
  Briefcase,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building2,
  Terminal,
  ExternalLink,
  Zap,
  Target
} from 'lucide-react';
import {
  getTopicCurriculum,
  TopicEducationalCurriculum,
  PracticeQuizQuestion
} from '@/lib/data/youtube-learning-resources';
import { YouTubeResourceCard } from '@/components/learning/youtube-resource-card';

interface TopicStructuredCurriculumProps {
  topicId: string;
  customCurriculum?: TopicEducationalCurriculum;
}

export function TopicStructuredCurriculum({
  topicId,
  customCurriculum,
}: TopicStructuredCurriculumProps) {
  const curriculum = customCurriculum || getTopicCurriculum(topicId);

  // 1. Objectives checked state
  const [checkedObjectives, setCheckedObjectives] = useState<Record<number, boolean>>({});

  // 2. Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});

  // 3. Code copy state
  const [copiedSnippetIndex, setCopiedSnippetIndex] = useState<number | null>(null);

  // 4. Solution reveal state
  const [showChallengeSolution, setShowChallengeSolution] = useState(false);

  // 5. Placement answers reveal
  const [revealedInterviewQuestions, setRevealedInterviewQuestions] = useState<Record<number, boolean>>({});

  const toggleObjective = (index: number) => {
    setCheckedObjectives((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSelectAnswer = (questionId: string, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleCopyCode = (code: string, idx: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedSnippetIndex(idx);
      setTimeout(() => setCopiedSnippetIndex(null), 2000);
    }
  };

  const toggleInterviewQuestion = (idx: number) => {
    setRevealedInterviewQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const completedObjectivesCount = Object.values(checkedObjectives).filter(Boolean).length;
  const totalObjectives = curriculum.learningObjectives.length;
  const objectiveProgress = totalObjectives > 0 ? Math.round((completedObjectivesCount / totalObjectives) * 100) : 0;

  return (
    <div className="space-y-8 select-none">
      {/* ─────────────────────────────────────────────────────────────────
          SECTION 1: TOPIC TITLE & COMPLIANCE BADGES
      ───────────────────────────────────────────────────────────────── */}
      <div className="p-6 bg-gradient-to-br from-purple-950/40 via-card to-card border border-purple-500/30 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 font-mono text-xs font-bold rounded-lg border border-purple-500/30 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>{curriculum.category}</span>
            </span>

            <span className={`px-2.5 py-1 text-xs font-bold font-mono rounded-lg border ${
              curriculum.level === 'Novice'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                : curriculum.level === 'Intermediate'
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
            }`}>
              {curriculum.level} Level
            </span>

            <span className="px-2.5 py-1 bg-secondary text-muted-foreground text-xs font-mono font-bold rounded-lg border border-border">
              Estimated Duration: {curriculum.estimatedHours}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Legal YouTube Embed Integration</span>
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            {curriculum.topicTitle}
          </h1>
        </div>

        {/* ─────────────────────────────────────────────────────────────────
            SECTION 2: SHORT AI NEXUS EXPLANATION (ORIGINAL PLATFORM IP)
        ───────────────────────────────────────────────────────────────── */}
        <div className="p-4 rounded-xl bg-secondary/50 border border-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Nexus Conceptual Synthesis:</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            {curriculum.aiNexusExplanation}
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 3: LEARNING OBJECTIVES
      ───────────────────────────────────────────────────────────────── */}
      <Card className="p-6 bg-card border-border rounded-2xl space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              Learning Objectives
            </h2>
          </div>
          <div className="text-xs font-mono text-purple-400 font-bold">
            {completedObjectivesCount} of {totalObjectives} Completed ({objectiveProgress}%)
          </div>
        </div>

        <div className="space-y-2.5">
          {curriculum.learningObjectives.map((obj, oIdx) => {
            const isChecked = !!checkedObjectives[oIdx];
            return (
              <button
                key={oIdx}
                onClick={() => toggleObjective(oIdx)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                  isChecked
                    ? 'bg-purple-950/20 border-purple-500/40 text-foreground'
                    : 'bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 flex-shrink-0 transition-colors ${
                  isChecked ? 'bg-purple-600 border-purple-500 text-white' : 'border-border bg-secondary'
                }`}>
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-xs sm:text-sm leading-relaxed ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                  {obj}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 4: RECOMMENDED YOUTUBE VIDEO(S) INSIDE ENTERPRISE CARDS
      ───────────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <Tv className="w-5 h-5 text-red-500" />
              <span>Recommended YouTube Educational Resources</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Curated masterclasses embedded using official YouTube player APIs with verified creator attribution.
            </p>
          </div>

          <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-mono text-xs font-bold self-start sm:self-auto">
            {curriculum.recommendedVideos.length} Curated Video{curriculum.recommendedVideos.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-6">
          {curriculum.recommendedVideos.map((video, vIdx) => (
            <YouTubeResourceCard
              key={video.id}
              resource={video}
              index={vIdx + 1}
            />
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 5: WHAT YOU SHOULD LEARN FROM THIS VIDEO
      ───────────────────────────────────────────────────────────────── */}
      <Card className="p-6 bg-card border-border rounded-2xl space-y-4 shadow-md">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <CheckSquare className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            What You Should Learn from These Resources
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
          {curriculum.whatYouShouldLearn.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-secondary/30 border border-border rounded-xl flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-foreground/90 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 6: AI NEXUS ORIGINAL NOTES / CODE WALKTHROUGH
      ───────────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <FileCode className="w-5 h-5 text-purple-400" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              AI Nexus Original Notes &amp; Code Walkthrough
            </h2>
            <p className="text-xs text-muted-foreground">
              Proprietary architectural blueprints, verified code snippets, and production considerations authored by AI Nexus.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {curriculum.aiNexusNotes.map((note, nIdx) => (
            <Card key={nIdx} className="p-6 bg-card border-border rounded-2xl space-y-4 shadow-md">
              <h3 className="text-sm sm:text-base font-bold text-purple-300">
                {note.title}
              </h3>

              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                {note.content}
              </div>

              {note.codeSnippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="font-mono text-purple-400 text-[11px] font-bold">
                      {note.codeLanguage?.toUpperCase() || 'PYTHON'} SOURCE
                    </span>
                    <button
                      onClick={() => handleCopyCode(note.codeSnippet!, nIdx)}
                      className="text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSnippetIndex === nIdx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 bg-black/80 border border-border rounded-xl font-mono text-xs text-purple-200 overflow-x-auto leading-relaxed">
                    <code>{note.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {note.keyPoints && note.keyPoints.length > 0 && (
                <div className="p-3.5 bg-secondary/40 border border-border rounded-xl space-y-1.5 text-xs">
                  <span className="font-bold text-foreground block">Key Architectural Takeaways:</span>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                    {note.keyPoints.map((pt, pIdx) => (
                      <li key={pIdx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 7: AI NEXUS PRACTICE / QUIZ CHECKPOINTS
      ───────────────────────────────────────────────────────────────── */}
      <Card className="p-6 bg-card border-border rounded-2xl space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                AI Nexus Practice &amp; Quiz Checkpoints
              </h2>
              <p className="text-xs text-muted-foreground">
                Instant self-assessment test with immediate verification and step-by-step rationale.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold rounded-lg">
            {curriculum.practiceQuestions.length} Checkpoints
          </span>
        </div>

        <div className="space-y-6">
          {curriculum.practiceQuestions.map((quiz, qIdx) => {
            const selectedOption = selectedAnswers[quiz.id];
            const isAnswered = !!selectedOption;
            const isCorrect = isAnswered && selectedOption === quiz.correctAnswer;
            const isHintShown = !!revealedHints[quiz.id];

            return (
              <div key={quiz.id} className="p-5 rounded-2xl bg-secondary/30 border border-border space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xs sm:text-sm font-bold text-foreground">
                    Question {qIdx + 1}: {quiz.question}
                  </h3>
                  {isAnswered && (
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
                      isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                    </span>
                  )}
                </div>

                {/* Options List */}
                <div className="space-y-2">
                  {quiz.options.map((option, optIdx) => {
                    const isOptionSelected = selectedOption === option;
                    let optionStyle = 'bg-card border-border text-muted-foreground hover:bg-secondary/60 hover:text-foreground';

                    if (isAnswered) {
                      if (option === quiz.correctAnswer) {
                        optionStyle = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold';
                      } else if (isOptionSelected) {
                        optionStyle = 'bg-rose-500/20 border-rose-500/40 text-rose-300';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(quiz.id, option)}
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-2 cursor-pointer ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {isAnswered && option === quiz.correctAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation & Hint */}
                <div className="pt-2 flex flex-col gap-2">
                  {quiz.hint && (
                    <div>
                      <button
                        onClick={() => setRevealedHints((prev) => ({ ...prev, [quiz.id]: !prev[quiz.id] }))}
                        className="text-xs text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{isHintShown ? 'Hide Hint' : 'Need a hint?'}</span>
                      </button>
                      {isHintShown && (
                        <div className="mt-2 p-3 bg-purple-950/30 border border-purple-500/30 text-purple-300 text-xs rounded-xl">
                          💡 <strong>Hint:</strong> {quiz.hint}
                        </div>
                      )}
                    </div>
                  )}

                  {isAnswered && (
                    <div className={`p-3.5 rounded-xl border text-xs ${
                      isCorrect ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                    }`}>
                      <strong>Explanation:</strong> {quiz.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 8: REAL-WORLD CHALLENGE (ENTERPRISE SCENARIO)
      ───────────────────────────────────────────────────────────────── */}
      <Card className="p-6 bg-gradient-to-br from-card via-card to-amber-950/20 border border-amber-500/30 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Real-World Enterprise Challenge
              </h2>
              <p className="text-xs text-amber-300 font-mono">
                Context: {curriculum.realWorldChallenge.companyContext}
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold rounded-lg self-start sm:self-auto">
            Production Engineering
          </span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-foreground">
          {curriculum.realWorldChallenge.title}
        </h3>

        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-secondary/30 p-4 rounded-xl border border-border">
          {curriculum.realWorldChallenge.problemStatement}
        </p>

        {/* Requirements */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            System Requirements:
          </h4>
          <div className="space-y-1.5">
            {curriculum.realWorldChallenge.requirements.map((req, rIdx) => (
              <div key={rIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="text-amber-400 font-bold">•</span>
                <span>{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Starter Code if available */}
        {curriculum.realWorldChallenge.starterCode && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-muted-foreground font-mono">Starter Architecture Template:</span>
            <pre className="p-4 bg-black/80 border border-border rounded-xl font-mono text-xs text-amber-200 overflow-x-auto leading-relaxed">
              <code>{curriculum.realWorldChallenge.starterCode}</code>
            </pre>
          </div>
        )}

        {/* Solution Guide Toggle */}
        <div className="pt-2">
          <Button
            onClick={() => setShowChallengeSolution((prev) => !prev)}
            variant="outline"
            className="w-full bg-secondary border-border text-foreground text-xs font-bold h-10 rounded-xl justify-between hover:bg-secondary/80"
          >
            <span>{showChallengeSolution ? 'Hide Recommended Solution Blueprint' : 'View Recommended Solution Blueprint'}</span>
            {showChallengeSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          {showChallengeSolution && (
            <div className="mt-3 p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs sm:text-sm text-emerald-200 space-y-2 leading-relaxed whitespace-pre-line animate-in fade-in duration-200">
              <h5 className="font-bold text-emerald-300">Enterprise Solution Blueprint:</h5>
              <p>{curriculum.realWorldChallenge.solutionGuide}</p>
            </div>
          )}
        </div>
      </Card>

      {/* ─────────────────────────────────────────────────────────────────
          SECTION 9: PLACEMENT & INTERVIEW PREPARATION
      ───────────────────────────────────────────────────────────────── */}
      <Card className="p-6 bg-card border-border rounded-2xl space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Placement &amp; Technical Interview Preparation
              </h2>
              <p className="text-xs text-muted-foreground">
                Targeted preparation for Tier-1 AI software engineering &amp; ML systems design roles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-muted-foreground font-semibold">Hiring Companies:</span>
            {curriculum.placementPrep.companyNames.map((company, cIdx) => (
              <span
                key={cIdx}
                className="px-2 py-0.5 bg-secondary text-foreground text-[10px] font-mono font-bold rounded-md border border-border"
              >
                {company}
              </span>
            ))}
          </div>
        </div>

        {/* Technical Questions Accordion */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Curated Systems Design &amp; Theory Questions:
          </h3>

          {curriculum.placementPrep.interviewQuestions.map((iq, iIdx) => {
            const isRevealed = !!revealedInterviewQuestions[iIdx];
            return (
              <div key={iIdx} className="border border-border rounded-xl overflow-hidden bg-secondary/20">
                <button
                  onClick={() => toggleInterviewQuestion(iIdx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-foreground hover:bg-secondary/40 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs flex-shrink-0">
                      Q{iIdx + 1}
                    </span>
                    <span>{iq.question}</span>
                  </span>
                  {isRevealed ? <ChevronUp className="w-4 h-4 text-purple-400" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                {isRevealed && (
                  <div className="p-4 border-t border-border bg-card/60 space-y-3 text-xs sm:text-sm animate-in fade-in duration-200">
                    <div>
                      <span className="font-bold text-purple-300 block mb-1">Model Answer:</span>
                      <p className="text-foreground/90 leading-relaxed">{iq.answer}</p>
                    </div>

                    <div className="p-3 bg-secondary/50 border border-border rounded-lg text-xs text-muted-foreground">
                      <strong className="text-amber-400">Interviewer Rubric:</strong> {iq.rubric}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Practical Placement Coding Task */}
        <div className="p-5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-xs sm:text-sm">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>Practical Coding Challenge: {curriculum.placementPrep.practicalCodingTask.title}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {curriculum.placementPrep.practicalCodingTask.description}
          </p>
          <div className="pt-1 flex items-center justify-between text-xs text-emerald-400 font-mono flex-wrap gap-2">
            <span>Expected Output: {curriculum.placementPrep.practicalCodingTask.expectedOutput}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
