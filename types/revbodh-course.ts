export type ContentStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface RevBodhQuizQuestion {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SCENARIO';
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint?: string;
}

export interface RevBodhPracticeChallenge {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  problemStatement: string;
  requirements: string[];
  starterCode: string;
  solutionCode?: string;
  testCases: {
    input?: string;
    expectedOutput: string;
    description: string;
  }[];
  hints: string[];
}

export interface RevBodhInterviewQuestion {
  id: string;
  question: string;
  difficulty: DifficultyLevel;
  expectedConcepts: string[];
  exampleAnswer: string;
  scenarioContext?: string;
}

export interface RevBodhLesson {
  id: string;
  orderNumber: number;
  title: string;
  slug: string;
  durationMinutes: number;
  status: ContentStatus;
  
  // Section A: Learning Objectives
  learningObjectives: string[];
  
  // Section B: Concept Explanation (Original technical explanation)
  conceptExplanation: {
    summary: string;
    detailedMarkdown: string;
    keyTerms: { term: string; definition: string }[];
  };
  
  // Section C: Examples (Executable code & explanations)
  examples: {
    title: string;
    description: string;
    code: string;
    language: string;
    outputExplanation: string;
  }[];
  
  // Section D: Common Mistakes
  commonMistakes: {
    mistake: string;
    whyItHappens: string;
    howToAvoid: string;
    badCodeSnippet?: string;
    goodCodeSnippet?: string;
  }[];
  
  // Section E: Real-World Application
  realWorldApplication: {
    industryContext: string;
    useCases: string[];
    productionTip: string;
  };
  
  // Section F: Interactive Practice
  practiceChallenge?: RevBodhPracticeChallenge;
  
  // Section G: Quizzes (5–10 questions)
  quizQuestions: RevBodhQuizQuestion[];
  
  // Section H: Interview Questions
  interviewQuestions: RevBodhInterviewQuestion[];
}

export interface RevBodhMiniProject {
  id: string;
  title: string;
  problemStatement: string;
  requirements: string[];
  skillsTested: string[];
  expectedOutput: string;
  starterCode?: string;
  hints: string[];
  evaluationCriteria: string[];
}

export interface RevBodhModule {
  id: string;
  orderNumber: number;
  title: string;
  description: string;
  status: ContentStatus;
  lessons: RevBodhLesson[];
  miniProject?: RevBodhMiniProject;
  assessmentQuestions?: RevBodhQuizQuestion[]; // Module Assessment (20-30 questions)
}

export interface RevBodhCourseProject {
  id: string;
  title: string;
  tier: 'Beginner' | 'Intermediate' | 'Advanced';
  problemStatement: string;
  requirements: string[];
  recommendedTechnologies: string[];
  developmentMilestones: {
    milestone: string;
    deliverable: string;
  }[];
  expectedFeatures: string[];
  evaluationCriteria: string[];
  portfolioGuidance: string;
}

export interface RevBodhCourse {
  id: string;
  title: string;
  slug: string;
  headline: string;
  description: string;
  category: string;
  level: DifficultyLevel;
  totalModules: number;
  totalLessons: number;
  estimatedHours: string;
  status: ContentStatus;
  skillsAcquired: { skill: string; proficiencyPercent: number }[];
  whatYouWillLearn: string[];
  modules: RevBodhModule[];
  capstoneProjects: RevBodhCourseProject[];
  finalAssessment?: {
    totalQuestions: number;
    passingScorePercent: number;
    durationMinutes: number;
  };
}
