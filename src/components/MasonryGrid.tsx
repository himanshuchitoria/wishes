'use client';

import React from 'react';
import { GroupContribution } from '@/types';
import { MessageSquare, Heart, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import ImageModal from './ImageModal';

interface MasonryGridProps {
  contributions: GroupContribution[];
  accentColor?: string;
}

export default function MasonryGrid({ contributions }: MasonryGridProps) {
  const [modalImageUrl, setModalImageUrl] = React.useState<string | null>(null);

  if (contributions.length === 0) {
    return (
      <div className="p-8 rounded-2xl border border-dashed border-zinc-800 text-center space-y-2">
        <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto" />
        <h4 className="text-sm font-bold text-zinc-300">No group messages yet</h4>
        <p className="text-xs text-zinc-500">
          Be the first friend to drop a note or roast below!
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {contributions.map((contrib, idx) => {
        const bgAccents = [
          'from-rose-950/40 via-zinc-900 to-zinc-900 border-rose-500/20',
          'from-amber-950/40 via-zinc-900 to-zinc-900 border-amber-500/20',
          'from-purple-950/40 via-zinc-900 to-zinc-900 border-purple-500/20',
          'from-sky-950/40 via-zinc-900 to-zinc-900 border-sky-500/20',
          'from-emerald-950/40 via-zinc-900 to-zinc-900 border-emerald-500/20',
        ];
        const cardStyle = bgAccents[idx % bgAccents.length];

        return (
          <div
            key={contrib.id}
            className={`break-inside-avoid p-5 rounded-2xl bg-gradient-to-b ${cardStyle} border shadow-xl hover:scale-[1.02] transition-transform duration-200 space-y-3`}
          >
            {/* Contributor Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-bold text-xs text-white shadow-md">
                  {contrib.contributor_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {contrib.contributor_name}
                  </h4>
                  <span className="text-[10px] text-zinc-500">
                    {formatDate(contrib.created_at)}
                  </span>
                </div>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
            </div>

            {/* Optional Image */}
            {contrib.image_url && (
              <div 
                className="rounded-xl overflow-hidden border border-zinc-800 max-h-56 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setModalImageUrl(contrib.image_url || null)}
              >
                <img
                  src={contrib.image_url}
                  alt="Contribution photo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Message Body */}
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">
              &ldquo;{contrib.message}&rdquo;
            </p>

            <div className="pt-2 border-t border-white/5 flex items-center justify-end text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500/50" />
                Verified Friend Note
              </span>
            </div>
          </div>
        );
      })}
      
      <ImageModal 
        isOpen={!!modalImageUrl}
        imageUrl={modalImageUrl}
        onClose={() => setModalImageUrl(null)}
      />
    </div>
  );
}
