'use client';

import React from 'react';
import {
  MoreVertical,
  BookOpen,
  FileText,
  Code,
  Database,
  Video,
  HelpCircle,
  Compass,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Archive,
  Copy
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ContentTypeBadge } from './content-type-badge';
import { ContentStatusBadge } from './content-status-badge';
import { ContentItem } from '@/lib/mock-data/content-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const contentIconMap: Record<string, React.ElementType> = {
  BookOpen,
  FileText,
  Code,
  Database,
  Video,
  HelpCircle,
  Compass,
};

interface ContentTableProps {
  items: ContentItem[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onAction: (actionType: 'view' | 'edit' | 'duplicate' | 'publish' | 'archive' | 'delete', item: ContentItem) => void;
}

export function ContentTable({
  items,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onAction,
}: ContentTableProps) {
  const allSelected = items.length > 0 && items.every((i) => selectedIds.includes(i.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs text-left text-zinc-300">
        <thead className="bg-[#181820] text-zinc-400 font-semibold border-b border-[#272730] uppercase text-[10px] tracking-wider">
          <tr>
            <th className="p-3 w-10 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-[#33333d] bg-[#121217] text-purple-600 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
              />
            </th>
            <th className="p-3">Title</th>
            <th className="p-3">Type</th>
            <th className="p-3">Category</th>
            <th className="p-3">Author</th>
            <th className="p-3">Status</th>
            <th className="p-3">Views</th>
            <th className="p-3">Created On</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#23232b]">
          {items.length > 0 ? (
            items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const Icon = contentIconMap[item.thumbnailIcon] || FileText;

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-[#181820]/60 transition-colors ${
                    isSelected ? 'bg-purple-950/20' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectRow(item.id, e.target.checked)}
                      className="rounded border-[#33333d] bg-[#121217] text-purple-600 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
                    />
                  </td>

                  {/* Title & Custom Icon Thumbnail */}
                  <td className="p-3 max-w-sm">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold ${
                          item.type === 'Course'
                            ? 'bg-purple-950 text-purple-300 border-purple-500/40'
                            : item.type === 'Article' && item.category === 'Deep Learning'
                            ? 'bg-blue-950 text-blue-300 border-blue-500/40'
                            : item.type === 'Tutorial'
                            ? 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500/40'
                            : item.type === 'Dataset'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                            : item.type === 'Article'
                            ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                            : item.type === 'Video'
                            ? 'bg-rose-950 text-rose-300 border-rose-500/40'
                            : item.type === 'Quiz'
                            ? 'bg-yellow-950 text-yellow-300 border-yellow-500/40'
                            : 'bg-teal-950 text-teal-300 border-teal-500/40'
                        }`}
                      >
                        {item.type === 'Course' ? (
                          <span>AI</span>
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-zinc-100 text-xs truncate leading-tight">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Type Badge */}
                  <td className="p-3 whitespace-nowrap">
                    <ContentTypeBadge type={item.type} />
                  </td>

                  {/* Category */}
                  <td className="p-3 whitespace-nowrap">
                    <span className="bg-[#181820] text-zinc-300 px-2 py-0.5 rounded border border-[#272730] font-medium text-[11px]">
                      {item.category}
                    </span>
                  </td>

                  {/* Author */}
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6 border border-[#2e2e3a]">
                        <AvatarImage src={item.author.avatar} alt={item.author.name} />
                        <AvatarFallback className="bg-purple-950 text-purple-300 font-bold text-[10px]">
                          {item.author.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-zinc-200 text-xs">{item.author.name}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-3 whitespace-nowrap">
                    <ContentStatusBadge status={item.status} />
                  </td>

                  {/* Views */}
                  <td className="p-3 whitespace-nowrap font-mono font-bold text-zinc-300">
                    {item.views}
                  </td>

                  {/* Created On */}
                  <td className="p-3 whitespace-nowrap font-mono text-zinc-400">
                    {item.createdAt}
                  </td>

                  {/* Actions Dropdown Menu */}
                  <td className="p-3 whitespace-nowrap text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<button className="p-1 text-zinc-400 hover:text-white hover:bg-[#20202b] rounded-md transition-colors" />}>
                        <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-48 bg-[#121217] border-[#272730] text-zinc-200 rounded-xl shadow-xl p-1"
                      >
                        <DropdownMenuItem
                          onClick={() => onAction('view', item)}
                          className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2"
                        >
                          <Eye className="w-3.5 h-3.5 text-zinc-400" /> View Content
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onAction('edit', item)}
                          className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2"
                        >
                          <Edit className="w-3.5 h-3.5 text-zinc-400" /> Edit Content
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onAction('duplicate', item)}
                          className="text-xs focus:bg-[#1f1f27] focus:text-white cursor-pointer gap-2"
                        >
                          <Copy className="w-3.5 h-3.5 text-zinc-400" /> Duplicate
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-[#272730]" />

                        <DropdownMenuItem
                          onClick={() => onAction('publish', item)}
                          className="text-xs text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-300 cursor-pointer gap-2"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Publish Content
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onAction('archive', item)}
                          className="text-xs text-amber-400 focus:bg-amber-500/10 focus:text-amber-300 cursor-pointer gap-2"
                        >
                          <Archive className="w-3.5 h-3.5" /> Archive Content
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-[#272730]" />

                        <DropdownMenuItem
                          onClick={() => onAction('delete', item)}
                          className="text-xs text-rose-400 focus:bg-rose-500/10 focus:text-rose-300 cursor-pointer gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Content
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={9} className="p-8 text-center text-zinc-400">
                No content items found matching search or filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
