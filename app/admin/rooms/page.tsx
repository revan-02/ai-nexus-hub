'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminShell } from '@/components/layout/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Layers,
  Zap,
  Globe,
  Lock,
  ChevronRight,
  X,
  Code,
  Check,
  RotateCcw
} from 'lucide-react';
import { useRooms } from '@/hooks/api/use-rooms';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export default function AdminRoomsPage() {
  const queryClient = useQueryClient();
  const { data: roomsResponse, isLoading, refetch } = useRooms({ limit: 100 });
  const rooms = roomsResponse?.data || [];

  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // New Room Form State
  const [roomTitle, setRoomTitle] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const [roomLevel, setRoomLevel] = useState('Novice');
  const [roomTier, setRoomTier] = useState('Free');
  const [roomCategory, setRoomCategory] = useState('AI Foundations');
  const [roomXp, setRoomXp] = useState(200);

  // New Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskInstructions, setTaskInstructions] = useState('');
  const [taskType, setTaskType] = useState('MULTIPLE_CHOICE');
  const [taskQuestion, setTaskQuestion] = useState('');
  const [taskOptions, setTaskOptions] = useState('Option A, Option B, Option C, Option D');
  const [taskCorrect, setTaskCorrect] = useState('Option A');
  const [taskHint, setTaskHint] = useState('');
  const [taskExplanation, setTaskExplanation] = useState('');
  const [taskXp, setTaskXp] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomTitle || !roomDesc) return;
    setIsSubmitting(true);

    try {
      await apiClient.post('/api/admin/rooms', {
        title: roomTitle,
        description: roomDesc,
        level: roomLevel,
        tier: roomTier,
        category: roomCategory,
        xpReward: Number(roomXp),
        isPublished: true,
      });

      setRoomTitle('');
      setRoomDesc('');
      setIsRoomModalOpen(false);
      refetch();
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['learner-dashboard'] });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !taskTitle || !taskInstructions) return;
    setIsSubmitting(true);

    const optionsArray = taskOptions.split(',').map((o) => o.trim()).filter((o) => o.length > 0);

    try {
      await apiClient.post(`/api/admin/rooms/${selectedRoom.id}/tasks`, {
        orderNumber: (selectedRoom.tasks?.length || 0) + 1,
        title: taskTitle,
        instructions: taskInstructions,
        taskType,
        questionText: taskQuestion,
        options: optionsArray,
        correctAnswer: taskCorrect,
        correctData: { answer: taskCorrect, matches: {}, acceptedAnswers: [taskCorrect] },
        hint: taskHint,
        explanation: taskExplanation,
        xpReward: Number(taskXp),
      });

      setTaskTitle('');
      setTaskInstructions('');
      setTaskQuestion('');
      setIsTaskModalOpen(false);
      refetch();
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['learner-dashboard'] });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this learning room and all its tasks?')) return;
    try {
      await apiClient.delete(`/api/admin/rooms/${roomId}`);
      refetch();
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['learner-dashboard'] });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete room');
    }
  };

  return (
    <AdminShell>
      <div className="space-y-6 max-w-[1700px] mx-auto pb-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/admin/dashboard" className="hover:text-foreground">Admin</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-purple-400 font-semibold">Learning Rooms Content Management</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Rooms & Tasks Builder</h1>
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Author database-driven learning rooms, tasks, questions, games, validation rules, and reward XP.
            </p>
          </div>

          <Button
            onClick={() => setIsRoomModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 py-2 h-9 rounded-xl gap-1.5 shadow-sm shadow-purple-900/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Learning Room
          </Button>
        </div>

        {/* Rooms Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 bg-card border-border rounded-2xl animate-pulse space-y-4">
                <div className="h-4 bg-secondary rounded w-1/2" />
                <div className="h-3 bg-secondary rounded w-full" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms.map((room: any) => (
              <Card key={room.id} className="p-6 bg-card border-border rounded-2xl space-y-4 flex flex-col justify-between hover:border-purple-500/40 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold rounded-lg">
                      {room.level} • {room.tier}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <Zap className="w-3 h-3 fill-amber-400" /> +{room.xpReward} XP
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground leading-snug">{room.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{room.description}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1 font-mono"><Layers className="w-3.5 h-3.5 text-purple-400" /> {room.tasksCount || room.tasks?.length || 0} Tasks</span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><Globe className="w-3 h-3" /> Published</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <Button
                    onClick={() => {
                      setSelectedRoom(room);
                      setIsTaskModalOpen(true);
                    }}
                    variant="outline"
                    className="bg-secondary border-border text-foreground text-xs h-8 px-3 rounded-xl gap-1 hover:bg-purple-600 hover:text-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Task
                  </Button>
                  <Button
                    onClick={() => handleDeleteRoom(room.id)}
                    variant="ghost"
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-8 px-2 rounded-xl cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* CREATE ROOM MODAL */}
        {isRoomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="fixed inset-0" onClick={() => setIsRoomModalOpen(false)} />
            <div className="relative w-full max-w-lg bg-[#121217] border border-[#272730] text-zinc-100 p-6 shadow-2xl rounded-2xl z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-[#272730] pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" /> Create Learning Room
                </h3>
                <button onClick={() => setIsRoomModalOpen(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Room Title</label>
                  <Input value={roomTitle} onChange={(e) => setRoomTitle(e.target.value)} placeholder="e.g. Advanced Transformer Architectures" required className="bg-[#181820] border-[#272730] text-zinc-100 h-9" />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Description</label>
                  <textarea value={roomDesc} onChange={(e) => setRoomDesc(e.target.value)} placeholder="Describe room objectives..." rows={3} required className="w-full p-2 bg-[#181820] border border-[#272730] rounded-xl text-zinc-100 text-xs focus:outline-none focus:border-purple-500" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">Level</label>
                    <select value={roomLevel} onChange={(e) => setRoomLevel(e.target.value)} className="w-full h-9 px-2 bg-[#181820] border border-[#272730] rounded-xl text-xs text-zinc-200">
                      <option value="Novice">Novice</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">Tier</label>
                    <select value={roomTier} onChange={(e) => setRoomTier(e.target.value)} className="w-full h-9 px-2 bg-[#181820] border border-[#272730] rounded-xl text-xs text-zinc-200">
                      <option value="Free">Free</option>
                      <option value="Pro">Pro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">Reward XP</label>
                    <Input type="number" value={roomXp} onChange={(e) => setRoomXp(Number(e.target.value))} className="bg-[#181820] border-[#272730] text-zinc-100 h-9 font-bold" />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#272730] flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsRoomModalOpen(false)} className="text-xs text-zinc-400">Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2">
                    {isSubmitting ? 'Saving...' : 'Save Room'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD TASK MODAL */}
        {isTaskModalOpen && selectedRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="fixed inset-0" onClick={() => setIsTaskModalOpen(false)} />
            <div className="relative w-full max-w-lg bg-[#121217] border border-[#272730] text-zinc-100 p-6 shadow-2xl rounded-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#272730] pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" /> Add Task to &quot;{selectedRoom.title}&quot;
                </h3>
                <button onClick={() => setIsTaskModalOpen(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Task Title</label>
                  <Input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="e.g. Task 1: Self-Attention Mechanics" required className="bg-[#181820] border-[#272730] text-zinc-100 h-9" />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Instructions / Lesson Text</label>
                  <textarea value={taskInstructions} onChange={(e) => setTaskInstructions(e.target.value)} placeholder="Explain the concept step-by-step..." rows={3} required className="w-full p-2 bg-[#181820] border border-[#272730] rounded-xl text-zinc-100 text-xs focus:outline-none focus:border-purple-500" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">Task Type</label>
                    <select value={taskType} onChange={(e) => setTaskType(e.target.value)} className="w-full h-9 px-2 bg-[#181820] border border-[#272730] rounded-xl text-xs text-zinc-200 font-bold">
                      <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                      <option value="TRUE_FALSE">True / False</option>
                      <option value="FILL_BLANK">Fill in Blank</option>
                      <option value="MATCHING">Matching Game</option>
                      <option value="ORDERING">Ordering Sequence</option>
                      <option value="IMAGE_IDENTIFICATION">Image Identification</option>
                      <option value="MEMORY_GAME">Memory Card Game</option>
                      <option value="DRAG_DROP">Drag & Drop Zone</option>
                      <option value="CODE_TASK">Python Code Lab</option>
                      <option value="READ">Read & Complete</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-300 font-medium mb-1">XP Reward</label>
                    <Input type="number" value={taskXp} onChange={(e) => setTaskXp(Number(e.target.value))} className="bg-[#181820] border-[#272730] text-zinc-100 h-9 font-bold" />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Question / Prompt</label>
                  <Input value={taskQuestion} onChange={(e) => setTaskQuestion(e.target.value)} placeholder="e.g. What matrix operation calculates attention scores?" className="bg-[#181820] border-[#272730] text-zinc-100 h-9" />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Options (comma separated)</label>
                  <Input value={taskOptions} onChange={(e) => setTaskOptions(e.target.value)} placeholder="Option A, Option B, Option C" className="bg-[#181820] border-[#272730] text-zinc-100 h-9" />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Correct Answer (Server Validation Rule)</label>
                  <Input value={taskCorrect} onChange={(e) => setTaskCorrect(e.target.value)} placeholder="Option A" required className="bg-[#181820] border-[#272730] text-zinc-100 h-9 font-bold text-emerald-400" />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Hint (Shown on retry)</label>
                  <Input value={taskHint} onChange={(e) => setTaskHint(e.target.value)} placeholder="Think about dot products..." className="bg-[#181820] border-[#272730] text-zinc-100 h-9" />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Explanation (Shown after correct pass)</label>
                  <Input value={taskExplanation} onChange={(e) => setTaskExplanation(e.target.value)} placeholder="Great job! Dot products compute query-key similarity..." className="bg-[#181820] border-[#272730] text-zinc-100 h-9" />
                </div>

                <div className="pt-3 border-t border-[#272730] flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setIsTaskModalOpen(false)} className="text-xs text-zinc-400">Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2">
                    {isSubmitting ? 'Saving...' : 'Add Task to Database'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
