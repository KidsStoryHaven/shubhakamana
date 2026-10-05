import React, { useState, useEffect } from 'react';
import { 
  getFestivalEngagement, 
  isFestivalLiked, 
  toggleFestivalLike, 
  recordFestivalShare, 
  formatEngagementCount, 
  formatFullCount,
  FestivalEngagement 
} from '../data/festivalEngagementStore';
import { festiveAudio } from '../utils/festiveAudio';
import { Eye, ThumbsUp, Share2, Flame, Heart } from 'lucide-react';

interface YouTubeStatsBarProps {
  festivalId: string;
  festivalTitle?: string;
  variant?: 'card' | 'page' | 'spotlight';
  onShareClick?: () => void;
  className?: string;
}

export const YouTubeStatsBar: React.FC<YouTubeStatsBarProps> = ({
  festivalId,
  festivalTitle,
  variant = 'card',
  onShareClick,
  className = ''
}) => {
  const [stats, setStats] = useState<FestivalEngagement>(() => getFestivalEngagement(festivalId));
  const [liked, setLiked] = useState<boolean>(() => isFestivalLiked(festivalId));
  const [likeAnimating, setLikeAnimating] = useState(false);

  useEffect(() => {
    setStats(getFestivalEngagement(festivalId));
    setLiked(isFestivalLiked(festivalId));

    const handleEngagementChange = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail || detail.festivalId === festivalId) {
        setStats(getFestivalEngagement(festivalId));
        setLiked(isFestivalLiked(festivalId));
      }
    };

    window.addEventListener('shubhakamna_engagement_changed', handleEngagementChange);
    return () => {
      window.removeEventListener('shubhakamna_engagement_changed', handleEngagementChange);
    };
  }, [festivalId]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 500);

    const result = toggleFestivalLike(festivalId);
    setStats(result.engagement);
    setLiked(result.isLiked);

    if (result.isLiked) {
      festiveAudio.playTempleBell();
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    recordFestivalShare(festivalId);
    if (onShareClick) {
      onShareClick();
    } else {
      // Default share trigger
      if (navigator.share) {
        navigator.share({
          title: festivalTitle ? `${festivalTitle} की पावन शुभकामनाएँ` : 'शुभकामना',
          url: window.location.href
        }).catch(() => {});
      } else {
        try {
          navigator.clipboard.writeText(window.location.href);
        } catch {}
      }
    }
  };

  // 1. CARD VARIANT (Home Page & Festival Grid)
  if (variant === 'card') {
    return (
      <div 
        className={`flex items-center justify-between text-xs text-stone-400 py-1.5 px-0.5 border-t border-stone-800/80 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Views */}
        <div 
          className="flex items-center gap-1 hover:text-stone-200 transition select-none"
          title={`कुल दृश्य: ${formatFullCount(stats.views)} Views`}
        >
          <Eye className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-[11px] text-stone-300">
            {formatEngagementCount(stats.views)}
          </span>
          <span className="text-[10px] text-stone-500">views</span>
        </div>

        {/* Action Buttons: Like & Share (YouTube style) */}
        <div className="flex items-center gap-1.5">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleLikeClick}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition cursor-pointer text-[11px] font-semibold active:scale-90 ${
              liked 
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm' 
                : 'hover:bg-stone-800 text-stone-400 hover:text-stone-200'
            } ${likeAnimating ? 'scale-125' : ''}`}
            title={liked ? 'पसंद किया गया (Liked)' : 'पसंद करें (Like)'}
          >
            <ThumbsUp className={`w-3 h-3 ${liked ? 'fill-current text-red-400' : ''}`} />
            <span>{formatEngagementCount(stats.likes)}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShareClick}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-amber-300 transition cursor-pointer text-[11px] font-semibold active:scale-95"
            title="शेयर करें (Share)"
          >
            <Share2 className="w-3 h-3 text-stone-400 hover:text-amber-300" />
            <span>{formatEngagementCount(stats.shares)}</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. SPOTLIGHT VARIANT (Featured Mega Event Banner)
  if (variant === 'spotlight') {
    return (
      <div className={`flex flex-wrap items-center gap-2 sm:gap-3 ${className}`}>
        <div 
          className="px-3 py-1.5 rounded-xl bg-black/60 border border-stone-800 text-xs text-stone-200 flex items-center gap-1.5"
          title={`कुल दृश्य: ${formatFullCount(stats.views)}`}
        >
          <Eye className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-bold text-white">{formatEngagementCount(stats.views)}</span>
          <span className="text-[10px] text-stone-400">Views</span>
        </div>

        <button
          type="button"
          onClick={handleLikeClick}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer active:scale-95 ${
            liked 
              ? 'bg-red-500/20 border-red-500/50 text-red-300' 
              : 'bg-black/60 border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-white'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-current text-red-400' : ''}`} />
          <span>{formatEngagementCount(stats.likes)}</span>
          <span className="text-[10px] font-normal opacity-80">Likes</span>
        </button>

        <button
          type="button"
          onClick={handleShareClick}
          className="px-3 py-1.5 rounded-xl bg-black/60 border border-stone-800 hover:border-amber-500/40 text-xs font-bold text-stone-300 hover:text-amber-300 flex items-center gap-1.5 transition cursor-pointer active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{formatEngagementCount(stats.shares)}</span>
          <span className="text-[10px] font-normal opacity-80">Shares</span>
        </button>

        <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
          <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>#1 Trending</span>
        </div>
      </div>
    );
  }

  // 3. FULL PAGE VARIANT (Festival Detail / Greeting Page)
  // Replicating YouTube's clean, modern video engagement action bar
  return (
    <div className={`my-3 p-2.5 sm:p-3 rounded-2xl bg-stone-900/90 border border-stone-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 shadow-xl ${className}`}>
      {/* Left: YouTube Views Count & Trending Tag */}
      <div className="flex items-center gap-2">
        <div 
          className="flex items-center gap-1.5 text-xs text-stone-200 bg-stone-950/80 px-3 py-1.5 rounded-xl border border-stone-800"
          title={`कुल दृश्य: ${formatFullCount(stats.views)} देखा गया`}
        >
          <Eye className="w-4 h-4 text-amber-400" />
          <span className="font-extrabold text-white text-xs sm:text-sm">
            {formatEngagementCount(stats.views)}
          </span>
          <span className="text-[11px] text-stone-400">व्यूज़ (Views)</span>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[10px] font-bold text-amber-300">
          <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>#1 Trending</span>
        </span>
      </div>

      {/* Right: YouTube Interactive Action Pills (Like + Share) */}
      <div className="flex items-center gap-2">
        {/* Like Button */}
        <button
          type="button"
          onClick={handleLikeClick}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-md active:scale-95 select-none ${
            liked 
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-red-900/40 border border-red-400' 
              : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 hover:border-amber-400/50'
          } ${likeAnimating ? 'scale-110' : ''}`}
          title={liked ? 'आपको यह पसंद आया! पुनः क्लिक कर अनलाइक करें' : 'पसंद करें (Like This Festival)'}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-current text-white' : 'text-stone-300'}`} />
          <span>{formatEngagementCount(stats.likes)}</span>
          <span className="text-[10px] font-normal">{liked ? 'Liked' : 'लाइक'}</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShareClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-stone-950 font-black text-xs transition cursor-pointer shadow-md shadow-amber-500/20 active:scale-95 select-none"
          title="व्हाट्सएप व दोस्तों को शेयर करें (Share to Friends)"
        >
          <Share2 className="w-3.5 h-3.5 text-stone-950" />
          <span>{formatEngagementCount(stats.shares)}</span>
          <span className="text-[10px] font-bold">शेयर</span>
        </button>
      </div>
    </div>
  );
};
