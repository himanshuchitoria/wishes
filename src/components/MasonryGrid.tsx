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
      <div className="p-8 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center space-y-2">
        <MessageSquare className="w-8 h-8 text-black mx-auto" />
        <h4 className="text-sm font-black text-black uppercase">No group messages yet</h4>
        <p className="text-xs text-black font-bold">
          Be the first friend to drop a note or roast below!
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {contributions.map((contrib, idx) => {
        const bgAccents = [
          'bg-rose-400',
          'bg-yellow-400',
          'bg-cyan-400',
          'bg-fuchsia-400',
          'bg-emerald-400',
        ];
        const cardStyle = bgAccents[idx % bgAccents.length];

        return (
          <div
            key={contrib.id}
            className={`break-inside-avoid p-5 ${cardStyle} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all space-y-3`}
          >
            {/* Contributor Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center font-black text-xs text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {contrib.contributor_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-black text-black">
                    {contrib.contributor_name}
                  </h4>
                  <span className="text-[10px] font-bold text-black/70">
                    {formatDate(contrib.created_at)}
                  </span>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-black" />
            </div>

            {/* Optional Image */}
            {contrib.image_url && (
              <div 
                className="overflow-hidden border-2 border-black max-h-56 cursor-pointer hover:opacity-90 transition-opacity"
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
            <p className="text-xs sm:text-sm text-black font-bold leading-relaxed">
              &ldquo;{contrib.message}&rdquo;
            </p>

            <div className="pt-2 border-t-2 border-black flex items-center justify-end text-[10px] text-black font-black uppercase">
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-black fill-black" />
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
