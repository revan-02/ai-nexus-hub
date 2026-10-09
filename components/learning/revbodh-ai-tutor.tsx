'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bot,
  Send,
  Sparkles,
  User,
  Loader2,
  HelpCircle,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { RevBodhLesson } from '@/types/revbodh-course';
import { MarkdownRenderer } from '@/components/ai/markdown-renderer';

interface RevBodhAITutorProps {
  lesson: RevBodhLesson;
  moduleTitle: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function RevBodhAITutor({ lesson, moduleTitle }: RevBodhAITutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello! I'm **RevBodh AI**, your personalized learning tutor for **${lesson.title}**.\n\nStuck on a concept, syntax nuance, or challenge requirement? Ask me anything about this lesson, and I'll break it down step-by-step with practical examples!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput('');

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userQuery }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Connect to Ollama API or intelligent pedagogical fallback
      const response = await fetch('/api/ai/ollama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          prompt: `You are RevBodh AI, an expert Socratic programming and AI tutor.
Current Module: "${moduleTitle}"
Current Lesson: "${lesson.title}"
Lesson Objectives: ${lesson.learningObjectives.join('; ')}
Student Question: "${userQuery}"

Pedagogical Rules:
1. Explain simply with clear mental models.
2. Provide a short, runnable code snippet.
3. Ask a small follow-up question to check understanding.
4. DO NOT give direct answers to active quiz questions or bypass student thinking. Be encouraging and technically rigorous.`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.reply || data.response || data.message || '';
        if (reply) {
          setMessages([...newMessages, { role: 'assistant', content: reply }]);
          setLoading(false);
          return;
        }
      }
      throw new Error('API fallback');
    } catch {
      // Intelligent fallback response tailored to question
      setTimeout(() => {
        let simulatedReply = '';
        const qLower = userQuery.toLowerCase();

        if (qLower.includes('recursion') || qLower.includes('recursive')) {
          simulatedReply = `### Understanding Recursion

Recursion is simply a function that solves a problem by calling a smaller version of itself until it reaches a **Base Case** (stopping condition).

Imagine opening Russian nesting dolls:
1. **Base Case:** The smallest doll that cannot open further.
2. **Recursive Step:** Opening a doll to find another doll inside.

\`\`\`python
def countdown(n):
    if n <= 0:  # Base Case: Stop condition
        print("Blast off! 🚀")
        return
    print(n)
    countdown(n - 1)  # Recursive Call with smaller input

countdown(3)
\`\`\`

**Quick Check Question for You:**
What would happen if we deleted \`if n <= 0: return\` from the function above?`;
        } else if (qLower.includes('variable') || qLower.includes('type')) {
          simulatedReply = `### Variables in Python

In Python, a variable is like a sticky note pointing to an object in memory, not a fixed storage container.

\`\`\`python
# 'counter' is a reference to the integer object 10
counter = 10
print(type(counter))  # <class 'int'>

# We can rebind 'counter' to a string
counter = "Ten"
print(type(counter))  # <class 'str'>
\`\`\`

Python detects types dynamically at runtime.

**Quick Check Question:**
What does \`bool("")\` evaluate to, and why?`;
        } else {
          simulatedReply = `Great question about **${lesson.title}**!

In Python, this concept is designed to make your code both readable and predictable:

\`\`\`python
# Practical example for ${lesson.title}
def demonstrate_concept():
    status = "Active"
    return f"RevBodh Status: {status}"

print(demonstrate_concept())
\`\`\`

**Key Takeaway:**
Always focus on the data type and how CPython evaluates expressions from left to right.

Does this breakdown make sense, or would you like to explore an interactive scenario together?`;
        }

        setMessages([...newMessages, { role: 'assistant', content: simulatedReply }]);
        setLoading(false);
      }, 700);
    }
  };

  return (
    <Card className="p-6 bg-zinc-950/90 border-purple-500/20 rounded-2xl space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-500 text-white rounded-xl shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <span>Ask RevBodh AI Tutor</span>
              <span className="px-2 py-0.2 text-[10px] font-mono text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/20">
                Lesson Context Active
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Socratic learning guide for: <span className="text-purple-300 font-medium">{lesson.title}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1 select-text">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 text-xs leading-relaxed ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-purple-300" />
              </div>
            )}
            <div
              className={`p-3 rounded-2xl max-w-[85%] ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-tr-sm'
                  : 'bg-secondary/60 border border-border/50 text-foreground rounded-tl-sm'
              }`}
            >
              {msg.role === 'user' ? (
                <div>{msg.content}</div>
              ) : (
                <MarkdownRenderer content={msg.content} />
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-zinc-400" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-center text-xs text-purple-400 italic">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>RevBodh AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[10px] text-muted-foreground font-medium">Quick Prompts:</span>
        <button
          onClick={() => {
            setInput('Can you explain this concept using a beginner-friendly real-world analogy?');
          }}
          className="text-[10px] px-2 py-1 bg-secondary/80 hover:bg-secondary text-zinc-300 rounded-lg border border-border/50 transition-colors cursor-pointer"
        >
          💡 Beginner Analogy
        </button>
        <button
          onClick={() => {
            setInput('What is the most common bug developers make here and how do I avoid it?');
          }}
          className="text-[10px] px-2 py-1 bg-secondary/80 hover:bg-secondary text-zinc-300 rounded-lg border border-border/50 transition-colors cursor-pointer"
        >
          ⚠️ Common Pitfalls
        </button>
        <button
          onClick={() => {
            setInput('Give me a small check question to test my understanding.');
          }}
          className="text-[10px] px-2 py-1 bg-secondary/80 hover:bg-secondary text-zinc-300 rounded-lg border border-border/50 transition-colors cursor-pointer"
        >
          🎯 Test My Knowledge
        </button>
      </div>

      {/* Input Field */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-1">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${lesson.title}...`}
          className="h-9 text-xs bg-secondary/50 border-border focus-visible:ring-purple-500"
        />
        <Button
          type="submit"
          disabled={!input.trim() || loading}
          size="sm"
          className="h-9 px-3 bg-purple-600 hover:bg-purple-700 text-white shrink-0 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </Card>
  );
}
