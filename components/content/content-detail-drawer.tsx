'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Calendar,
  Eye,
  Layers,
  ThumbsUp,
  ThumbsDown,
  Star,
  Share2,
  MessageSquare,
  Send,
  Lock,
  Check,
  Sparkles
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ContentTypeBadge } from './content-type-badge';
import { ContentStatusBadge } from './content-status-badge';
import { ContentItem } from '@/lib/mock-data/content-data';
import { useSession } from 'next-auth/react';
import {
  useInteractionSummary,
  useToggleReaction,
  useRateContent,
  useComments,
  useAddComment
} from '@/hooks/api/use-interactions';

interface ContentDetailDrawerProps {
  open: boolean;
  content: ContentItem | null;
  onOpenChange: (open: boolean) => void;
}

export function ContentDetailDrawer({ open, content, onOpenChange }: ContentDetailDrawerProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id || 'usr-1';
  const isLoggedIn = !!session?.user;

  const contentId = content?.id || '';

  const { data: summaryResponse } = useInteractionSummary(contentId, userId);
  const { data: commentsResponse } = useComments(contentId);

  const toggleReactionMutation = useToggleReaction(contentId);
  const rateContentMutation = useRateContent(contentId);
  const addCommentMutation = useAddComment(contentId);

  const summary = summaryResponse?.data;
  const comments = commentsResponse?.data || [];

  const [commentText, setCommentText] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  if (!open || !content) return null;

  const handleLike = () => {
    if (!isLoggedIn) return;
    const newReaction = summary?.userReaction === 'LIKE' ? 'NONE' : 'LIKE';
    toggleReactionMutation.mutate({ reaction: newReaction, userId });
  };

  const handleDislike = () => {
    if (!isLoggedIn) return;
    const newReaction = summary?.userReaction === 'DISLIKE' ? 'NONE' : 'DISLIKE';
    toggleReactionMutation.mutate({ reaction: newReaction, userId });
  };

  const handleRate = (star: number) => {
    if (!isLoggedIn) return;
    rateContentMutation.mutate({ rating: star, userId });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !isLoggedIn) return;
    addCommentMutation.mutate(
      { text: commentText, userId },
      {
        onSuccess: () => setCommentText(''),
      }
    );
  };

  const currentRating = hoverRating || summary?.userRating || summary?.averageRating || 5;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={() => onOpenChange(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#121217] border-l border-[#272730] text-zinc-100 shadow-2xl flex flex-col justify-between z-10">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#272730] flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Content Engagement & Details
            </h3>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#181820] rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Overview Card */}
            <div className="p-4 bg-[#181820] border border-[#272730] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <ContentTypeBadge type={content.type} />
                <ContentStatusBadge status={content.status} />
              </div>
              <h4 className="text-lg font-bold text-white leading-snug">{content.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed bg-[#121217] p-3 rounded-xl border border-[#23232b]">
                {content.description}
              </p>
            </div>

            {/* ⭐ Ratings, Likes, Dislikes & Share Actions Bar */}
            <div className="p-4 bg-[#181820] border border-[#272730] rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">Ratings & Feedback</span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {summary?.averageRating || 5.0} ★ ({summary?.totalRatingsCount || 1} ratings)
                </span>
              </div>

              {/* Interactive 5-Star Rating */}
              <div className="flex items-center gap-1.5 justify-center py-2 bg-[#121217] rounded-xl border border-[#23232b]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={!isLoggedIn}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => handleRate(star)}
                    className="p-1 text-amber-400 hover:scale-125 transition-transform disabled:opacity-50"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= currentRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Likes, Dislikes, Share Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleLike}
                  disabled={!isLoggedIn}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    summary?.userReaction === 'LIKE'
                      ? 'bg-purple-600/30 text-purple-300 border-purple-500'
                      : 'bg-[#121217] border-[#272730] text-zinc-300 hover:bg-[#20202b]'
                  } disabled:opacity-50`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{summary?.likesCount || 0}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDislike}
                  disabled={!isLoggedIn}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    summary?.userReaction === 'DISLIKE'
                      ? 'bg-rose-600/30 text-rose-300 border-rose-500'
                      : 'bg-[#121217] border-[#272730] text-zinc-300 hover:bg-[#20202b]'
                  } disabled:opacity-50`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>{summary?.dislikesCount || 0}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-[#121217] border border-[#272730] text-zinc-300 hover:bg-[#20202b] transition-all"
                >
                  {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-blue-400" />}
                  <span>{copiedShare ? 'Copied!' : 'Share'}</span>
                </button>
              </div>

              {!isLoggedIn && (
                <div className="text-[11px] text-amber-400 text-center font-medium bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3" /> Sign in as a registered user to rate and react.
                </div>
              )}
            </div>

            {/* 💬 Live Comments Thread Section */}
            <div className="space-y-4 pt-2">
              <h5 className="font-bold text-white text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" /> Comments Thread ({comments.length})
                </span>
              </h5>

              {/* Comment Input Form */}
              {isLoggedIn ? (
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 bg-[#181820] border border-[#272730] rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim() || addCommentMutation.isPending}
                    className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-[#181820] border border-[#272730] rounded-xl text-xs text-zinc-400 text-center font-medium">
                  Please sign in to join the conversation.
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-[#181820] border border-[#23232b] rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-4 h-4">
                            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-zinc-200">{comment.user.name}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-medium">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 text-center py-4">No comments yet. Be the first to comment!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
