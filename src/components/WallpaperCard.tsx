import React from 'react';
import { Wallpaper } from '../types';
import { Eye, Download, Sparkles, Heart } from 'lucide-react';

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onPreview: (wallpaper: Wallpaper) => void;
  onOpenInStudio: (wallpaper: Wallpaper) => void;
}

export const WallpaperCard: React.FC<WallpaperCardProps> = ({
  wallpaper,
  isFavorite,
  onToggleFavorite,
  onPreview,
  onOpenInStudio
}) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = wallpaper.imageUrl;
    link.download = `DivyaDarshan_${wallpaper.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onClick={() => onPreview(wallpaper)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-stone-800/80 bg-stone-900 transition-all duration-300 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5"
    >
      {/* Aspect Ratio 9:16 Container */}
      <div className="relative aspect-[9/16] w-full overflow-hidden bg-stone-950">
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.titleHi}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span className="text-[11px] font-medium tracking-wide text-stone-200 bg-stone-950/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
            {wallpaper.resolution}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(wallpaper.id);
            }}
            aria-label="पसंदीदा में जोड़ें"
            className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-stone-950/70 backdrop-blur-md border border-white/10 text-stone-300 hover:text-white transition-colors"
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-300'}`}
            />
          </button>
        </div>

        {/* Measured Scrim for Media Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />

        {/* Bottom Content Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 z-10">
          <div className="space-y-1">
            <h3 className="text-base font-bold font-display text-white tracking-tight line-clamp-1 group-hover:text-amber-300 transition-colors">
              {wallpaper.titleHi}
            </h3>
            <p className="text-xs text-stone-300 line-clamp-1 italic font-light">
              {wallpaper.mantraHi}
            </p>
          </div>

          {/* Clean Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-2 text-[11px] text-stone-400 pt-0.5">
            <span>{wallpaper.titleEn}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-mono">{(wallpaper.downloads).toLocaleString()} डाउनलोड</span>
          </div>

          {/* Quick Action Toolbar on Hover/Touch */}
          <div className="grid grid-cols-3 gap-1.5 pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPreview(wallpaper);
              }}
              className="flex items-center justify-center gap-1 rounded-lg bg-stone-800/90 py-1.5 text-[11px] font-medium text-stone-200 hover:bg-stone-700 hover:text-white transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>प्रिव्यू</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center justify-center gap-1 rounded-lg bg-amber-600/90 py-1.5 text-[11px] font-medium text-white hover:bg-amber-500 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>डाउनलोड</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenInStudio(wallpaper);
              }}
              className="flex items-center justify-center gap-1 rounded-lg bg-stone-800/90 py-1.5 text-[11px] font-medium text-amber-300 hover:bg-stone-700 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>स्टेटस</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
