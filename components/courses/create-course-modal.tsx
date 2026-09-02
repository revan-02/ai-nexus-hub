'use client';

import React, { useState } from 'react';
import { X, GraduationCap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CourseItem, CourseLevel, CourseStatus } from '@/lib/mock-data/courses-data';
import { useSession } from 'next-auth/react';

interface CreateCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCourse?: (course: CourseItem) => void;
}

export function CreateCourseModal({
  open,
  onOpenChange,
  onCreateCourse,
}: CreateCourseModalProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('AI & ML');
  const [customCategory, setCustomCategory] = useState('');
  const [level, setLevel] = useState<CourseLevel>('Beginner');
  const [status, setStatus] = useState<CourseStatus>('Published');
  const [price, setPrice] = useState('Free');
  const [thumbnailIcon, setThumbnailIcon] = useState('Brain');
  const [instructorName, setInstructorName] = useState(session?.user?.name || 'Dr. Alex Morgan');

  if (!open) return null;

  const finalCategory = category === 'Custom' ? (customCategory.trim() || 'General AI') : category;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (onCreateCourse) {
      onCreateCourse({
        id: `crs-${Date.now()}`,
        title: title.trim(),
        description: description.trim() || 'Comprehensive course module on modern AI engineering and fundamentals.',
        category: finalCategory,
        level,
        status,
        price,
        students: '0',
        instructor: {
          id: session?.user ? (session.user as any).id || 'usr-inst-1' : 'usr-inst-1',
          name: instructorName,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        },
        updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        thumbnailIcon,
      });
    }

    setTitle('');
    setDescription('');
    setCustomCategory('');
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />

      <div className="relative w-full max-w-lg bg-[#121217] border border-[#272730] text-zinc-100 p-6 shadow-2xl rounded-2xl z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#272730] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Create New Course</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </h3>
              <p className="text-xs text-zinc-400">Add course to the catalog with category, level, and curriculum</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">Course Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. LLM Fine-Tuning & Quantization with QLoRA"
              required
              className="bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 text-xs rounded-xl"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed syllabus and learning outcomes for this course..."
              rows={3}
              className="w-full p-3 bg-[#181820] border border-[#272730] text-zinc-100 placeholder:text-zinc-500 text-xs rounded-xl focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-3 bg-[#181820] border border-[#272730] rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                <option value="AI & ML">AI & ML</option>
                <option value="Generative AI & LLMs">Generative AI & LLMs</option>
                <option value="Data Science">Data Science</option>
                <option value="Deep Learning">Deep Learning</option>
                <option value="Programming">Programming</option>
                <option value="AI Security & Red-Teaming">AI Security & Red-Teaming</option>
                <option value="Custom">+ Custom Category...</option>
              </select>
            </div>

            {category === 'Custom' ? (
              <div>
                <label className="block text-zinc-300 font-medium mb-1.5">Custom Category Name</label>
                <Input
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="e.g. Autonomous Agents"
                  required
                  className="bg-[#181820] border-[#272730] text-zinc-100 text-xs rounded-xl"
                />
              </div>
            ) : (
              <div>
                <label className="block text-zinc-300 font-medium mb-1.5">Difficulty Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as CourseLevel)}
                  className="w-full h-9 px-3 bg-[#181820] border border-[#272730] rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="Beginner">Beginner (Easy)</option>
                  <option value="Intermediate">Intermediate (Medium)</option>
                  <option value="Advanced">Advanced (Hard)</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CourseStatus)}
                className="w-full h-9 px-3 bg-[#181820] border border-[#272730] rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                <option value="Published">Published (Live)</option>
                <option value="Draft">Draft</option>
                <option value="In Review">In Review</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Pricing</label>
              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-9 px-3 bg-[#181820] border border-[#272730] rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500 font-mono"
              >
                <option value="Free">Free</option>
                <option value="₹2,499">₹2,499 (Rs. 2,499)</option>
                <option value="₹3,999">₹3,999 (Rs. 3,999)</option>
                <option value="₹7,999">₹7,999 (Rs. 7,999)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Icon Theme</label>
              <select
                value={thumbnailIcon}
                onChange={(e) => setThumbnailIcon(e.target.value)}
                className="w-full h-9 px-3 bg-[#181820] border border-[#272730] rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                <option value="Brain">Brain</option>
                <option value="Sparkles">Sparkles</option>
                <option value="Network">Network</option>
                <option value="Code">Code</option>
                <option value="Layers">Layers</option>
                <option value="Calculator">Calculator</option>
                <option value="Database">Database</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">Lead Instructor</label>
            <Input
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              placeholder="Instructor Name"
              className="bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 text-xs rounded-xl"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#272730]">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-[#181820] border-[#272730] text-zinc-300 hover:text-white rounded-xl text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold h-9 px-5 shadow-md shadow-purple-900/30 cursor-pointer"
            >
              Publish &amp; Create Course
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
