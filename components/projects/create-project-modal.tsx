'use client';

import React, { useState } from 'react';
import { X, FolderPlus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateProject } from '@/hooks/api/use-projects';

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateProjectModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateProjectModalProps) {
  const createProjectMutation = useCreateProject();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('AI & ML');
  const [level, setLevel] = useState('Intermediate');
  const [price, setPrice] = useState('$49');
  const [techInput, setTechInput] = useState('PyTorch, FastAPI, Docker');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    const technologies = techInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    createProjectMutation.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        category,
        level,
        price,
        technologies: technologies.length > 0 ? technologies : ['PyTorch', 'TypeScript'],
      },
      {
        onSuccess: () => {
          setName('');
          setDescription('');
          setPrice('$49');
          setTechInput('PyTorch, FastAPI, Docker');
          onOpenChange(false);
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />

      <div className="relative w-full max-w-lg bg-[#121217] border border-[#272730] text-zinc-100 p-6 shadow-2xl rounded-2xl z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#272730] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Post AI Project <Sparkles className="w-4 h-4 text-purple-400" />
              </h3>
              <p className="text-xs text-zinc-400">Publish a project codebase to the AI marketplace</p>
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
            <label className="block text-zinc-300 font-medium mb-1.5">Project Title</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Multimodal Medical Radiography Agent"
              required
              className="bg-[#181820] border-[#272730] text-zinc-100 placeholder:text-zinc-500 text-xs h-9"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the scope, objectives, architecture, or codebase features..."
              required
              rows={3}
              className="w-full p-3 bg-[#181820] border border-[#272730] rounded-xl text-zinc-100 placeholder:text-zinc-500 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-3 bg-[#181820] border border-[#272730] rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                <option value="AI & ML">AI & ML</option>
                <option value="Computer Vision">Computer Vision</option>
                <option value="Generative AI">Generative AI</option>
                <option value="NLP & LLMs">NLP & LLMs</option>
                <option value="MLOps">MLOps</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Difficulty</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full h-9 px-3 bg-[#181820] border border-[#272730] rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Pricing (Free / Paid)</label>
              <select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-9 px-3 bg-[#181820] border border-[#272730] rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-purple-500 font-bold font-mono"
              >
                <option value="Free">Free</option>
                <option value="₹2,499">₹2,499 (Rs. 2,499)</option>
                <option value="₹3,999">₹3,999 (Rs. 3,999)</option>
                <option value="₹6,499">₹6,499 (Rs. 6,499)</option>
                <option value="₹7,999">₹7,999 (Rs. 7,999)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1.5">Technologies (comma separated)</label>
            <Input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="e.g. PyTorch, FastAPI, Kubernetes, DICOM"
              className="bg-[#181820] border-[#272730] text-zinc-100 text-xs h-9"
            />
          </div>

          {createProjectMutation.isError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl">
              Failed to publish project. Please try again.
            </div>
          )}

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
              disabled={createProjectMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 h-9 rounded-xl shadow-md shadow-purple-900/30"
            >
              {createProjectMutation.isPending ? 'Publishing...' : 'Publish Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
