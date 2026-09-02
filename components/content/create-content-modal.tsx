'use client';

import React, { useState } from 'react';
import { X, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContentType, ContentItem } from '@/lib/mock-data/content-data';
import { useSession } from 'next-auth/react';

interface CreateContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateContent?: (content: ContentItem) => void;
}

export function CreateContentModal({
  open,
  onOpenChange,
  onCreateContent,
}: CreateContentModalProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ContentType>('Course');
  const [category, setCategory] = useState('AI & ML');
  const [authorName, setAuthorName] = useState(session?.user?.name || 'Author');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    if (onCreateContent) {
      onCreateContent({
        id: `cnt-${Date.now()}`,
        title,
        description: description || 'Platform learning resource',
        type,
        category,
        subCategory: 'General',
        author: {
          id: `auth-${Date.now()}`,
          name: authorName,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        },
        status: 'Draft',
        views: '—',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        thumbnailIcon: 'BookOpen',
      });
    }

    setTitle('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />

      <div className="relative w-full max-w-lg bg-[#121217] border border-[#272730] text-zinc-100 p-6 shadow-2xl rounded-2xl z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#272730] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <FilePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create New Content</h3>
              <p className="text-xs text-zinc-400">Publish courses, articles, tutorials or datasets</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">Content Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep Reinforcement Learning Masterclass"
              required
              className="bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of content scope and objectives..."
              className="bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Content Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ContentType)}
                className="w-full h-9 px-3 bg-[#181820] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                <option value="Course">Course</option>
                <option value="Article">Article</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Dataset">Dataset</option>
                <option value="Video">Video</option>
                <option value="Quiz">Quiz</option>
                <option value="Guide">Guide</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-3 bg-[#181820] border border-[#272730] rounded-md text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                <option value="AI & ML">AI & ML</option>
                <option value="Deep Learning">Deep Learning</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Data Science">Data Science</option>
                <option value="Programming">Programming</option>
                <option value="Projects">Projects</option>
                <option value="Assessments">Assessments</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">Author</label>
            <Input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Dr. Alex Morgan"
              className="bg-[#181820] border-[#272730] text-zinc-100 text-xs"
            />
          </div>

          <div className="pt-3 border-t border-[#272730] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-xs text-zinc-400 hover:text-white hover:bg-[#181820]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2"
            >
              Create Content
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
