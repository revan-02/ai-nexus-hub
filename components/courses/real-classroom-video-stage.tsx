'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Camera,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Subtitles,
  Share2,
  Download,
  Sparkles,
  Smartphone,
  Apple,
  Calculator,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Award,
  Users,
  Compass,
  MapPin,
  Clock,
  BookOpen,
  Languages,
  Activity,
  Check,
  ChevronRight,
  Tv
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface ClassroomScene {
  sceneId: string;
  sceneNumber: number;
  timeRange: string;
  startSec: number;
  endSec: number;
  title: string;
  setting: string;
  teacherDialogue: string[];
  studentDialogue?: { speaker: string; text: string; atSec?: number }[];
  smartboardContent: {
    headline: string;
    subtext: string;
    diagramType: 'face_unlock' | 'ai_definition' | 'everyday_ai' | 'apples_oranges' | 'calculator_vs_ai' | 'real_world_benefits' | 'safety_protocol' | 'quiz_recap';
    bulletPoints?: string[];
    propName?: string;
  };
}

export const CHAPTER_1_CLASSROOM_SCENES: ClassroomScene[] = [
  {
    sceneId: 'scene-1',
    sceneNumber: 1,
    timeRange: '0:00–1:00',
    startSec: 0,
    endSec: 60,
    title: 'Scene 1 — Welcome to the World of AI',
    setting: 'Wide shot. Teacher stands near the smartboard. Students are seated.',
    teacherDialogue: [
      'Good morning, everyone!',
      'Today, we are going to learn something really interesting. Something that you might already be using every single day, without even knowing it!',
      'Tell me something. Have you ever unlocked a phone just by showing your face?',
      'Yes! And have you noticed that YouTube sometimes recommends videos similar to the ones you enjoy watching?',
      'Now, here is my question: How does the phone recognise your face? And how does YouTube decide which videos you might like?',
      'One important technology behind these features is called Artificial Intelligence. We usually call it AI.',
      'By the end of today\'s class, you will know what AI is, how it learns, where we use it, and why we must use it carefully.'
    ],
    studentDialogue: [
      { speaker: 'Students', text: 'Good morning, ma\'am!', atSec: 5 },
      { speaker: 'Students', text: 'Yes, ma\'am! (nods enthusiastically)', atSec: 25 },
    ],
    smartboardContent: {
      headline: 'WELCOME TO THE WORLD OF AI',
      subtext: 'Class 8-A • Indian Central Academy • Teacher: Ms. Ananya Rao',
      diagramType: 'face_unlock',
      bulletPoints: [
        'Smartphone Face Unlock Target Scan',
        'YouTube Video Recommendation Patterns',
        'Core Technology: Artificial Intelligence (AI)'
      ],
      propName: 'Smartphone'
    }
  },
  {
    sceneId: 'scene-2',
    sceneNumber: 2,
    timeRange: '1:00–2:15',
    startSec: 60,
    endSec: 135,
    title: 'Scene 2 — What is Artificial Intelligence?',
    setting: 'Smartboard displays: Artificial Intelligence = AI.',
    teacherDialogue: [
      'Let\'s understand the name first.',
      'Artificial means something made by people, rather than occurring naturally.',
      'Intelligence means the ability to learn, understand information, solve problems and make decisions.',
      'So, Artificial Intelligence is technology that allows computers to perform certain tasks that normally need human intelligence.',
      'Look at this picture. What animal is this?',
      'Correct! You recognised it because you have seen dogs before.',
      'Now imagine showing a computer thousands of pictures of different animals. A specially trained AI system can learn patterns in those pictures and try to identify a dog in a new picture.',
      'Does that mean the computer thinks exactly like you? No. AI does not need to understand the world in the same way humans do. It uses information and mathematical patterns to produce results.',
      'That\'s our first important idea: AI helps computers perform tasks such as recognising pictures, understanding speech and making predictions.'
    ],
    studentDialogue: [
      { speaker: 'Student', text: 'A dog, ma\'am!', atSec: 90 }
    ],
    smartboardContent: {
      headline: 'ARTIFICIAL INTELLIGENCE = AI',
      subtext: 'Artificial (Man-made) + Intelligence (Ability to learn & decide)',
      diagramType: 'ai_definition',
      bulletPoints: [
        'Humans recognize a dog through real-life memory',
        'Computers identify dogs through mathematical pixel patterns',
        'Key Capabilities: Vision, Speech, Prediction'
      ]
    }
  },
  {
    sceneId: 'scene-3',
    sceneNumber: 3,
    timeRange: '2:15–3:40',
    startSec: 135,
    endSec: 220,
    title: 'Scene 3 — AI Around Us',
    setting: 'Teacher walks towards the students for an interactive game.',
    teacherDialogue: [
      'Let\'s play a small game. I\'ll describe a situation, and you tell me where AI might be helping.',
      'Situation number one: You pick up your parent\'s phone, and it recognises their face to unlock. Face recognition can use AI to compare facial features with stored information.',
      'Situation number two: You watch three cricket videos. Later, a video platform suggests more cricket highlights. Recommendation systems can learn from viewing patterns to suggest content.',
      'Situation number three: You say, "Set an alarm for six o\'clock tomorrow morning," and a voice assistant responds. AI can help the assistant understand your spoken request.',
      'Situation number four: Your family uses a maps app to travel from Bengaluru to Mysuru. Some navigation features use AI to predict traffic and travel time.',
      'So, is AI only about robots?',
      'Exactly! AI can work quietly inside apps and devices. You may not even notice it.'
    ],
    studentDialogue: [
      { speaker: 'Students', text: 'No, ma\'am!', atSec: 210 }
    ],
    smartboardContent: {
      headline: 'AI AROUND US: 4 EVERYDAY SITUATIONS',
      subtext: 'AI is not just walking robots; it is inside your pocket!',
      diagramType: 'everyday_ai',
      bulletPoints: [
        '1. Face Recognition: Biometric feature matching',
        '2. Cricket Highlights: Recommendation algorithms',
        '3. Voice Assistant: Speech-to-text NLP',
        '4. Bengaluru → Mysuru (NH 275): Live traffic prediction'
      ]
    }
  },
  {
    sceneId: 'scene-4',
    sceneNumber: 4,
    timeRange: '3:40–5:20',
    startSec: 220,
    endSec: 320,
    title: 'Scene 4 — How Does AI Learn?',
    setting: 'Teacher places an apple and an orange on the table. Green apple demonstration.',
    teacherDialogue: [
      'Now comes my favourite part. How does an AI system learn?',
      'Suppose we want to build a computer program that recognises apples and oranges.',
      'First, we collect many example pictures. Some are apples. Some are oranges.',
      'Next, we label them correctly. We tell the system which pictures show apples and which show oranges.',
      'During training, a machine-learning system adjusts its internal numbers to find useful patterns in the pictures.',
      'It might learn patterns related to shape, colour and texture. But colour alone is not enough. Apples can be green, and oranges can sometimes look green too!',
      'Now let\'s give our trained system a picture it has never seen before: a green apple! Will it recognise the fruit correctly?',
      'Maybe yes. Maybe no. We need to test it.',
      'Very good! In this example, the system got it right: Predicted Label = Apple.',
      'But what if it calls an apple an orange? Then we examine the mistake. We may need better examples, better training or a different model.',
      'Remember these four words: Examples. Training. Testing. Improvement.',
      'That is a simple introduction to machine learning, one important way of building AI.'
    ],
    smartboardContent: {
      headline: 'HOW DOES AI LEARN? (MACHINE LEARNING)',
      subtext: 'The 4 Golden Pillars of Machine Learning',
      diagramType: 'apples_oranges',
      bulletPoints: [
        '1. Examples: 1,000 photos of apples & oranges',
        '2. Training: Mathematical pattern & weight tuning',
        '3. Testing: Green Apple Challenge (Unseen Data)',
        '4. Improvement: Error analysis & retraining'
      ],
      propName: 'Red Apple, Orange & Green Apple'
    }
  },
  {
    sceneId: 'scene-5',
    sceneNumber: 5,
    timeRange: '5:20–6:35',
    startSec: 320,
    endSec: 395,
    title: 'Scene 5 — AI and Ordinary Computer Programs',
    setting: 'Teacher stands beside two board panels: Calculator and Image Recognition.',
    teacherDialogue: [
      'Here\'s another question. Is every computer program AI?',
      'No! Let\'s take a calculator. If I enter five plus three, it gives eight.',
      'It follows mathematical rules to calculate the answer. That alone does not make it AI.',
      'Now imagine a program that looks at a photograph and tries to identify whether it contains a cat or a dog.',
      'That is a task for which we might train an AI model using many examples.',
      'So here\'s the difference: Traditional software often follows rules written directly by programmers. Machine-learning software can learn useful patterns from data.',
      'Both are important. In fact, many applications combine ordinary programming and AI.',
      'Now tell me: does a basic light switch need AI to turn on a bulb?',
      'Correct. Smart technology and AI are not always the same thing.'
    ],
    studentDialogue: [
      { speaker: 'Students', text: 'No, ma\'am!', atSec: 385 }
    ],
    smartboardContent: {
      headline: 'ORDINARY CODE VS ARTIFICIAL INTELLIGENCE',
      subtext: 'Rule-Based Execution vs Data-Driven Pattern Learning',
      diagramType: 'calculator_vs_ai',
      bulletPoints: [
        'Ordinary Program (Calculator): 5 + 3 = 8 (Fixed rules)',
        'AI Model (Image Classifier): Cat vs Dog (Learned patterns)',
        'Takeaway: Light switches & basic circuits are NOT AI!'
      ],
      propName: 'Digital Calculator'
    }
  },
  {
    sceneId: 'scene-6',
    sceneNumber: 6,
    timeRange: '6:35–7:45',
    startSec: 395,
    endSec: 465,
    title: 'Scene 6 — How AI Helps People',
    setting: 'Smartboard displays four familiar examples: Education, Farming, Healthcare, Languages.',
    teacherDialogue: [
      'Let\'s look at how AI can help us in the real world.',
      'First, education. Some learning apps can suggest practice questions based on the topics you find difficult.',
      'Second, farming. AI systems can analyse photographs of plant leaves and help identify possible crop diseases.',
      'Third, healthcare. Doctors can use AI tools to help examine medical images. But trained healthcare professionals must check important decisions.',
      'Fourth, languages. AI translation tools can help convert English sentences into Kannada, Hindi or other languages. Look at the screen: Good morning → ಶುಭೋದಯ.',
      'AI is useful because it can help people work with large amounts of information, recognise patterns and save time.',
      'But remember, AI is a tool. People still need to think and make responsible decisions.'
    ],
    smartboardContent: {
      headline: 'HOW AI EMPOWERS HUMANITY',
      subtext: 'Real-world impact across Indian society and global industry',
      diagramType: 'real_world_benefits',
      bulletPoints: [
        '📚 Education: Personalized adaptive quizzes',
        '🌾 Agriculture: Crop leaf disease detection via camera',
        '🩺 Healthcare: Doctor-assisted MRI & CT scan analysis',
        '🌐 Multilingual: English to Kannada (ಶುಭೋದಯ) & Hindi'
      ]
    }
  },
  {
    sceneId: 'scene-7',
    sceneNumber: 7,
    timeRange: '7:45–8:45',
    startSec: 465,
    endSec: 525,
    title: 'Scene 7 — Can We Trust Every AI Answer?',
    setting: 'Teacher displays question mark on smartboard. Safety protocol.',
    teacherDialogue: [
      'Now, an important question. Is AI always correct?',
      'Exactly. AI can make mistakes.',
      'Imagine asking an AI chatbot a history question. It gives you an answer that sounds very confident. Does that mean the answer must be correct?',
      'Not necessarily! Sometimes AI systems produce incorrect information.',
      'So, if an AI gives you an important fact, check it using your textbook, a reliable source or your teacher.',
      'There\'s one more safety rule: Never share passwords, home addresses or other private information with an unfamiliar AI app.',
      'Look at the board: THINK — CHECK — PROTECT.',
      'And don\'t use AI just to copy homework. Use it to understand ideas, practise questions and become a better learner.'
    ],
    studentDialogue: [
      { speaker: 'Students', text: 'No, ma\'am!', atSec: 472 }
    ],
    smartboardContent: {
      headline: 'CAN WE TRUST EVERY AI ANSWER? (SAFETY RULE)',
      subtext: 'Critical Thinking & Digital Privacy for 13-Year-Old Explorers',
      diagramType: 'safety_protocol',
      bulletPoints: [
        'THINK: Confident tone does not mean 100% accuracy',
        'CHECK: Verify important facts with school textbooks & teachers',
        'PROTECT: Never share passwords, OTPs, or addresses with bots'
      ]
    }
  },
  {
    sceneId: 'scene-8',
    sceneNumber: 8,
    timeRange: '8:45–10:30',
    startSec: 525,
    endSec: 630,
    title: 'Scene 8 — Quick Quiz and Recap',
    setting: 'Teacher smiles and walks to the centre of the classroom for quiz.',
    teacherDialogue: [
      'Alright, everyone! Let\'s see how much you\'ve learnt.',
      'Question one: What does AI stand for? A: Automatic Internet, B: Artificial Intelligence, C: Advanced Information.',
      'The correct answer is B — Artificial Intelligence!',
      'Question two: Which of these could use AI? A: Recognising a face in a photograph, B: A basic pencil sharpener, C: A simple wooden ruler.',
      'The answer is A — recognising a face in a photograph.',
      'Question three: If an AI chatbot gives you an answer, should you believe it without checking?',
      'No! We must check important information.',
      'Wonderful! Today we learnt that AI helps computers perform tasks such as recognising images, understanding speech and making predictions.',
      'We also learnt that some AI systems improve by training on examples, and that AI is used in education, farming, healthcare and many other areas.',
      'And most importantly, AI can make mistakes, so we should use it thoughtfully.',
      'Before our next class, here\'s a little challenge for you: Find three examples of AI that you see at home, at school or while travelling. Write down what each one does.',
      'In our next chapter, we\'ll explore how machines learn from data, with a fun classroom activity. Thank you, everyone. See you in the next class!'
    ],
    studentDialogue: [
      { speaker: 'Students', text: 'Thank you, ma\'am!', atSec: 625 }
    ],
    smartboardContent: {
      headline: 'CLASSROOM RECAP & 3-QUESTION CHALLENGE',
      subtext: 'Next Chapter: How Machines Learn from Data',
      diagramType: 'quiz_recap',
      bulletPoints: [
        'Q1: What does AI stand for? → Artificial Intelligence (B)',
        'Q2: Which could use AI? → Face Recognition in Photo (A)',
        'Q3: Believe chatbots blindly? → No, always verify! (No)',
        '📝 Homework: Spot 3 real AI examples in your daily life!'
      ]
    }
  }
];

interface RealClassroomVideoStageProps {
  currentTimeSec: number;
  durationSec: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  playbackSpeed: number;
  onSetSpeed: (spd: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  showCaptions: boolean;
  onToggleCaptions: () => void;
  onShareVideo: () => void;
  onDownloadVideo: () => void;
  shareCopied: boolean;
  onJumpToScene: (sec: number) => void;
}

export function RealClassroomVideoStage({
  currentTimeSec,
  durationSec,
  isPlaying,
  onTogglePlay,
  onSeek,
  playbackSpeed,
  onSetSpeed,
  isMuted,
  onToggleMute,
  showCaptions,
  onToggleCaptions,
  onShareVideo,
  onDownloadVideo,
  shareCopied,
  onJumpToScene,
}: RealClassroomVideoStageProps) {
  const [cameraAngle, setCameraAngle] = useState<'wide' | 'teacher' | 'smartboard' | 'demo_desk'>('wide');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Quiz state for Scene 8
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: string }>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Active Scene based on currentTimeSec
  const currentScene =
    CHAPTER_1_CLASSROOM_SCENES.slice().reverse().find((s) => currentTimeSec >= s.startSec) ||
    CHAPTER_1_CLASSROOM_SCENES[0];

  // Active dialogue line based on progress inside the scene
  const sceneElapsed = currentTimeSec - currentScene.startSec;
  const sceneDuration = Math.max(1, currentScene.endSec - currentScene.startSec);
  const dialogueRatio = Math.min(1, Math.max(0, sceneElapsed / sceneDuration));
  const activeDialogueIndex = Math.min(
    currentScene.teacherDialogue.length - 1,
    Math.floor(dialogueRatio * currentScene.teacherDialogue.length)
  );
  const currentTeacherSpeech = currentScene.teacherDialogue[activeDialogueIndex] || currentScene.teacherDialogue[0];

  // Active Student Voice Callout
  const activeStudentSpeech = currentScene.studentDialogue?.find(
    (sd) => sd.atSec !== undefined && Math.abs(currentTimeSec - sd.atSec) <= 4
  );

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleAnswerClick = (qNum: number, choice: string) => {
    setSelectedAnswers((prev) => {
      const next = { ...prev, [qNum]: choice };
      let score = 0;
      if (next[1] === 'B') score += 1;
      if (next[2] === 'A') score += 1;
      if (next[3] === 'No') score += 1;
      setQuizScore(score);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Real Classroom Video Studio Frame */}
      <div
        ref={containerRef}
        className="relative aspect-video rounded-2xl bg-[#09090e] border border-[#262638] overflow-hidden flex flex-col justify-between shadow-2xl group select-none"
      >
        {/* ── 1. BACKGROUND REALISTIC CLASSROOM ENVIRONMENT ── */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-b from-[#131320] via-[#0d0d16] to-[#07070b]">
          {/* Subtle Classroom Architectural Ambient Lighting */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-500/10 via-purple-500/5 to-transparent pointer-events-none" />
          <div className="absolute -top-10 -left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Perspective: Realistic Classroom Elements */}
          <div className="relative w-full h-full flex flex-col justify-between p-3 sm:p-5">
            {/* Top Classroom Studio Broadcast Ticker */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600/90 text-white text-[10px] font-bold tracking-wider uppercase shadow-md shadow-rose-950/40">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  Live Classroom Feed
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-900/80 border border-white/10 text-zinc-300 text-[10px] font-mono hidden sm:inline-block">
                  CAM: {cameraAngle.toUpperCase()} • 1080p 60FPS
                </span>
                <span className="px-2 py-0.5 rounded-md bg-zinc-900/80 border border-white/10 text-amber-300 text-[10px] font-mono hidden md:inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Period 2 • Class 8-A (Bengaluru)
                </span>
              </div>

              {/* Camera Switcher Buttons (Live Angle Switcher) */}
              <div className="flex items-center gap-1 p-0.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-[10px]">
                <button
                  type="button"
                  onClick={() => setCameraAngle('wide')}
                  className={`px-2 py-1 rounded font-semibold transition-all cursor-pointer ${
                    cameraAngle === 'wide' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Wide Classroom View"
                >
                  Wide
                </button>
                <button
                  type="button"
                  onClick={() => setCameraAngle('teacher')}
                  className={`px-2 py-1 rounded font-semibold transition-all cursor-pointer ${
                    cameraAngle === 'teacher' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Teacher Close-up Cam"
                >
                  Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setCameraAngle('smartboard')}
                  className={`px-2 py-1 rounded font-semibold transition-all cursor-pointer ${
                    cameraAngle === 'smartboard' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Smartboard HD View"
                >
                  Smartboard
                </button>
                <button
                  type="button"
                  onClick={() => setCameraAngle('demo_desk')}
                  className={`px-2 py-1 rounded font-semibold transition-all cursor-pointer ${
                    cameraAngle === 'demo_desk' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Demo Table Cam"
                >
                  Props Desk
                </button>
              </div>
            </div>

            {/* ── 2. DYNAMIC LIVE CLASSROOM STAGE (Teacher + Smartboard + Props) ── */}
            <div className="grid grid-cols-12 gap-3 flex-1 my-2 items-center z-10 min-h-0">
              {/* TEACHER PODIUM (Indian Female Educator - Ms. Ananya Rao) */}
              {(cameraAngle === 'wide' || cameraAngle === 'teacher') && (
                <div
                  className={`${
                    cameraAngle === 'teacher' ? 'col-span-12 sm:col-span-6' : 'col-span-12 sm:col-span-4'
                  } h-full flex flex-col justify-end transition-all`}
                >
                  <div className="relative rounded-2xl bg-gradient-to-t from-purple-950/40 to-transparent p-2 border border-purple-500/20 flex flex-col items-center">
                    {/* Teacher Live Portrait Graphic */}
                    <div className="relative mb-2">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ring-purple-500/40 overflow-hidden shadow-2xl bg-zinc-800">
                        {/* Realistic Indian Teacher Avatar */}
                        <img
                          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
                          alt="Ms. Ananya Rao (Teacher)"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Teacher Live Microphone / Speaking Indicator */}
                      <span className="absolute bottom-0 right-0 px-2 py-0.5 rounded-full bg-emerald-500 text-[9px] font-bold text-black border border-white flex items-center gap-1 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                        Speaking
                      </span>
                    </div>

                    {/* Teacher Name & School Plate */}
                    <div className="text-center">
                      <div className="text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1">
                        <span>Ms. Ananya Rao</span>
                        <span className="text-[10px] text-purple-300 font-normal">(Age 32)</span>
                      </div>
                      <div className="text-[10px] text-zinc-300 font-mono">
                        Senior AI Educator • Indian English
                      </div>
                    </div>

                    {/* Prop in Teacher's Hand when active */}
                    {currentScene.smartboardContent.propName && (
                      <div className="mt-2 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 text-[10px] font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Holding: {currentScene.smartboardContent.propName}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SMARTBOARD DIGITAL SLIDE DISPLAY */}
              <div
                className={`${
                  cameraAngle === 'smartboard'
                    ? 'col-span-12'
                    : cameraAngle === 'teacher'
                    ? 'col-span-12 sm:col-span-6'
                    : cameraAngle === 'demo_desk'
                    ? 'col-span-12 sm:col-span-7'
                    : 'col-span-12 sm:col-span-8'
                } h-full flex flex-col justify-center transition-all`}
              >
                <div className="relative h-full rounded-2xl bg-[#0d0d17] border-2 border-indigo-500/40 p-3 sm:p-4 flex flex-col justify-between shadow-2xl overflow-hidden">
                  {/* Smartboard Header Bar */}
                  <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] sm:text-xs font-bold text-indigo-300 tracking-wide font-mono uppercase">
                        SMARTBOARD • {currentScene.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">{currentScene.timeRange}</span>
                  </div>

                  {/* Smartboard Content Body based on Scene Diagram Type */}
                  <div className="flex-1 flex flex-col justify-center py-1 overflow-y-auto">
                    <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide mb-1">
                      {currentScene.smartboardContent.headline}
                    </h3>
                    <p className="text-[11px] text-indigo-200 mb-2 leading-relaxed">
                      {currentScene.smartboardContent.subtext}
                    </p>

                    {/* Scene Specific Graphical Demonstration */}
                    {currentScene.smartboardContent.diagramType === 'face_unlock' && (
                      <div className="grid grid-cols-2 gap-2 my-1">
                        <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                            <Smartphone className="w-5 h-5 animate-bounce" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-white">Face Recognition</div>
                            <div className="text-[9px] text-zinc-400">Match score: 99.8% (Biometric)</div>
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300">
                            <Tv className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-white">YouTube Recommender</div>
                            <div className="text-[9px] text-zinc-400">Viewing patterns analysis</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentScene.smartboardContent.diagramType === 'ai_definition' && (
                      <div className="p-2.5 rounded-xl bg-[#141424] border border-indigo-500/30 flex items-center justify-between text-xs my-1">
                        <div className="text-center flex-1">
                          <span className="font-bold text-amber-300 block">HUMAN</span>
                          <span className="text-[10px] text-zinc-300">Sees real dog → Remembers memory</span>
                        </div>
                        <span className="text-indigo-400 font-bold px-2">VS</span>
                        <div className="text-center flex-1">
                          <span className="font-bold text-purple-300 block">AI COMPUTER</span>
                          <span className="text-[10px] text-zinc-300">Sees 10,000 photos → Finds pixel math</span>
                        </div>
                      </div>
                    )}

                    {currentScene.smartboardContent.diagramType === 'everyday_ai' && (
                      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                        <div className="p-1.5 rounded-lg bg-zinc-900/70 border border-white/5 text-zinc-200">
                          📱 <strong className="text-white">Face ID:</strong> Feature vectors
                        </div>
                        <div className="p-1.5 rounded-lg bg-zinc-900/70 border border-white/5 text-zinc-200">
                          🏏 <strong className="text-white">Cricket Feed:</strong> Watch history
                        </div>
                        <div className="p-1.5 rounded-lg bg-zinc-900/70 border border-white/5 text-zinc-200">
                          🗣️ <strong className="text-white">Voice Assistant:</strong> Audio to text
                        </div>
                        <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300">
                          🗺️ <strong className="text-white">BLR → Mysuru:</strong> Traffic AI (NH275)
                        </div>
                      </div>
                    )}

                    {currentScene.smartboardContent.diagramType === 'apples_oranges' && (
                      <div className="p-2 rounded-xl bg-[#12121f] border border-amber-500/30 space-y-1.5 my-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <Apple className="w-3.5 h-3.5" /> 500 Apples (Red/Green)
                          </span>
                          <span className="text-indigo-300 font-mono">→ Training Box →</span>
                          <span className="text-amber-400 font-bold">500 Oranges (Bumpy)</span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-500/20 text-[10px] text-center text-purple-200 font-mono">
                          Green Apple Test: Predicted Label = <strong>Apple (Confidence: 96%)</strong> ✅
                        </div>
                      </div>
                    )}

                    {currentScene.smartboardContent.diagramType === 'calculator_vs_ai' && (
                      <div className="grid grid-cols-2 gap-2 my-1 text-xs">
                        <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-700">
                          <div className="font-bold text-amber-300 flex items-center gap-1">
                            <Calculator className="w-3.5 h-3.5" /> Calculator: 5 + 3 = 8
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-1">
                            Fixed rules written by humans. (NOT AI)
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/40">
                          <div className="font-bold text-purple-300 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> Image Recognizer
                          </div>
                          <div className="text-[10px] text-zinc-300 mt-1">
                            Learns patterns from 10,000 photos. (AI)
                          </div>
                        </div>
                      </div>
                    )}

                    {currentScene.smartboardContent.diagramType === 'real_world_benefits' && (
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] my-1">
                        <div className="p-1.5 rounded-lg bg-blue-950/40 border border-blue-500/20 text-blue-200">
                          📚 Education: Adaptive practice questions
                        </div>
                        <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-200">
                          🌾 Farming: Crop leaf disease detection
                        </div>
                        <div className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-500/20 text-rose-200">
                          🩺 Healthcare: Doctor-assist image scans
                        </div>
                        <div className="p-1.5 rounded-lg bg-purple-950/40 border border-purple-500/20 text-purple-200 flex items-center justify-between">
                          <span>🌐 Kannada:</span>
                          <span className="font-bold text-amber-300">ಶುಭೋದಯ</span>
                        </div>
                      </div>
                    )}

                    {currentScene.smartboardContent.diagramType === 'safety_protocol' && (
                      <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-1 my-1 text-xs">
                        <div className="font-bold text-rose-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-rose-400" />
                          <span>THINK — CHECK — PROTECT</span>
                        </div>
                        <div className="text-[10px] text-zinc-200 leading-snug">
                          Chatbots can sound confident while being wrong. Always verify with textbooks & never share passwords!
                        </div>
                      </div>
                    )}

                    {currentScene.smartboardContent.diagramType === 'quiz_recap' && (
                      <div className="space-y-1.5 my-1 text-xs">
                        {/* Interactive Quiz in Scene 8 */}
                        <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/40">
                          <div className="font-bold text-purple-200 text-[11px] mb-1">
                            Q1: What does AI stand for?
                          </div>
                          <div className="grid grid-cols-3 gap-1 text-[10px]">
                            {['A: Automatic Internet', 'B: Artificial Intelligence', 'C: Advanced Information'].map((opt, idx) => {
                              const letter = ['A', 'B', 'C'][idx];
                              const isSelected = selectedAnswers[1] === letter;
                              const isCorrect = letter === 'B';
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleAnswerClick(1, letter)}
                                  className={`p-1 rounded text-center font-bold border transition-all cursor-pointer ${
                                    isSelected
                                      ? isCorrect
                                        ? 'bg-emerald-600 border-emerald-400 text-white'
                                        : 'bg-rose-600 border-rose-400 text-white'
                                      : 'bg-black/40 border-white/10 text-zinc-300 hover:text-white'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Homework Challenge Box */}
                        <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-200 flex items-center justify-between">
                          <span>📝 Homework: Spot 3 AI examples in your daily life!</span>
                          <span className="font-mono text-zinc-400">Class 8-A Assignment</span>
                        </div>
                      </div>
                    )}

                    {/* Bullet Points */}
                    {currentScene.smartboardContent.bulletPoints && (
                      <ul className="space-y-0.5 mt-1 text-[10px] text-zinc-300 list-disc pl-4">
                        {currentScene.smartboardContent.bulletPoints.map((bp, i) => (
                          <li key={i}>{bp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── 3. STUDENT CALLOUT FLOATING TOAST ── */}
            {activeStudentSpeech && (
              <div className="absolute top-16 right-6 z-20 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xl border border-indigo-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-200" />
                  <span>{activeStudentSpeech.speaker}: "{activeStudentSpeech.text}"</span>
                </div>
              </div>
            )}

            {/* ── 4. LIVE CLOSED CAPTIONS / TELEPROMPTER OVERLAY ── */}
            {showCaptions && (
              <div className="relative z-10 mx-auto max-w-2xl text-center pb-1">
                <span className="inline-block px-4 py-1.5 rounded-xl bg-black/85 backdrop-blur-md text-white text-xs sm:text-sm font-medium border border-white/10 shadow-2xl leading-relaxed">
                  <strong className="text-purple-300">Ms. Ananya:</strong> "{currentTeacherSpeech}"
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── 5. BOTTOM OVERLAY VIDEO SCRIM & CONTROLS ── */}
        <div className="relative z-20 px-4 py-2.5 bg-[#0a0a10]/95 border-t border-[#1e1e2c] space-y-1.5">
          {/* Timeline Scrubber */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-zinc-400 w-10">{formatTime(currentTimeSec)}</span>
            <input
              type="range"
              min={0}
              max={durationSec}
              value={currentTimeSec}
              onChange={onSeek}
              aria-label="Seek slider"
              className="flex-1 h-1.5 bg-[#252535] accent-purple-500 rounded-lg cursor-pointer hover:h-2 transition-all"
            />
            <span className="text-[10px] font-mono text-zinc-400 w-10 text-right">{formatTime(durationSec)}</span>
          </div>

          {/* Action Control Buttons */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={onTogglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="w-8 h-8 p-0 rounded-lg text-white hover:bg-purple-600/30 hover:text-purple-300 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onJumpToScene(0)}
                title="Replay from start"
                className="w-8 h-8 p-0 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a1a25]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="w-8 h-8 p-0 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a1a25]"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleCaptions}
                title={showCaptions ? 'Hide Captions' : 'Show Captions'}
                className={`w-8 h-8 p-0 rounded-lg transition-colors cursor-pointer ${
                  showCaptions ? 'text-purple-400 bg-purple-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#1a1a25]'
                }`}
              >
                <Subtitles className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Playback Speed Toggles and Fullscreen */}
            <div className="flex items-center gap-1.5">
              {[0.75, 1, 1.25, 1.5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => onSetSpeed(spd)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-900/40'
                      : 'text-zinc-400 hover:text-zinc-200 bg-[#161622]'
                  }`}
                >
                  {spd}x
                </button>
              ))}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleToggleFullscreen}
                title="Toggle Fullscreen"
                className="w-7 h-7 p-0 ml-1 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1a1a25]"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 6. REAL CLASSROOM ACTION BAR (Download & Share & Scene Jumpers) ── */}
      <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Video className="w-3.5 h-3.5 text-emerald-400" />
            <span>Classroom Masterclass Video • Ms. Ananya Rao</span>
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            {formatTime(currentTimeSec)} / {formatTime(durationSec)} • 1080p Studio Audio
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShareVideo}
            className="bg-[#14141e] hover:bg-[#1e1e2c] border-[#29293d] text-zinc-300 hover:text-white text-xs font-semibold h-8 rounded-xl gap-1.5 cursor-pointer"
            title="Share Classroom Video"
          >
            {shareCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-purple-400" />}
            <span>{shareCopied ? 'Link Copied!' : 'Share Video'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadVideo}
            className="bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/40 text-purple-300 hover:text-white text-xs font-semibold h-8 rounded-xl gap-1.5 cursor-pointer shadow-sm shadow-purple-900/20"
            title="Download Classroom Lesson MP4"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Download Classroom MP4</span>
          </Button>
        </div>
      </div>

      {/* ── 7. ALL 8 CLASSROOM SCENES TIMELINE JUMPERS ── */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
            Classroom Video Scenes ({CHAPTER_1_CLASSROOM_SCENES.length} Scenes • 10:30 Total)
          </span>
          <span className="text-[11px] text-purple-400 font-mono">
            Active: {currentScene.title}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CHAPTER_1_CLASSROOM_SCENES.map((scene) => {
            const isActive = currentScene.sceneId === scene.sceneId;
            return (
              <button
                key={scene.sceneId}
                onClick={() => onJumpToScene(scene.startSec)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600/25 border-purple-500 shadow-lg shadow-purple-950/40 ring-1 ring-purple-400/30'
                    : 'bg-[#12121a] border-[#222230] hover:bg-[#181824]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mb-1">
                  <span>Scene {scene.sceneNumber}</span>
                  <span className={isActive ? 'text-purple-300 font-bold' : ''}>{scene.timeRange}</span>
                </div>
                <div className="text-xs font-bold text-white truncate">{scene.title.replace(/^Scene \d+ — /, '')}</div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">{scene.setting}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
