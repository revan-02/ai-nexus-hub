'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { mockTopCategories } from '@/lib/mock-data/content-data';
import { FolderTree } from 'lucide-react';

export function TopCategoriesCard() {
  return (
    <Card className="bg-[#121217] border border-[#272730] p-5 rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
          <FolderTree className="w-4 h-4 text-purple-400" />
          <span>Top Categories</span>
        </h3>
        <Link href="/categories" className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
          Manage All
        </Link>
      </div>

      <div className="space-y-3.5 text-xs">
        {mockTopCategories.map((cat) => {
          const widthPct = Math.round((cat.count / cat.maxCount) * 100);

          return (
            <div key={cat.id} className="space-y-1.5">
              <div className="flex items-center justify-between font-medium">
                <span className="text-zinc-200">{cat.name}</span>
                <span className="font-mono text-zinc-400 font-bold">{cat.count}</span>
              </div>
              <div className="w-full h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
