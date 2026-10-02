import React from 'react';
import { Wallpaper, Quote } from '../types';
import { WALLPAPERS } from '../data/wallpapers';
import { QUOTES } from '../data/quotes';
import { WallpaperCard } from './WallpaperCard';
import { Heart, Sparkles } from 'lucide-react';

interface FavoritesViewProps {
  favoriteWallpaperIds: string[];
  favoriteQuoteIds: string[];
  onToggleFavoriteWallpaper: (id: string) => void;
  onToggleFavoriteQuote: (id: string) => void;
  onPreviewWallpaper: (wallpaper: Wallpaper) => void;
  onOpenStudioWithWallpaper: (wallpaper: Wallpaper) => void;
  onOpenStudioWithQuote: (quote: Quote) => void;
  onGoToWallpapers: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteWallpaperIds,
  favoriteQuoteIds,
  onToggleFavoriteWallpaper,
  onToggleFavoriteQuote,
  onPreviewWallpaper,
  onOpenStudioWithWallpaper,
  onOpenStudioWithQuote,
  onGoToWallpapers
}) => {
  const favoriteWallpapers = WALLPAPERS.filter(wp => favoriteWallpaperIds.includes(wp.id));
  const favoriteQuotes = QUOTES.filter(q => favoriteQuoteIds.includes(q.id));

  const totalFavorites = favoriteWallpapers.length + favoriteQuotes.length;

  if (totalFavorites === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-stone-800 bg-stone-900/30 p-8 space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
          <Heart className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-display text-white">
            अभी कोई पसंदीदा संग्रह नहीं है
          </h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            वॉलपेपर अथवा अनमोल सुविचारों पर दिए गए हृदय (❤️) चिह्न पर क्लिक कर उन्हें अपने पसंदीदा संग्रह में सहेजें
          </p>
        </div>
        <button
          onClick={onGoToWallpapers}
          className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-500 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>वॉलपेपर देखें</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold font-display text-white">
          मेरा पसंदीदा संग्रह
        </h2>
        <p className="text-xs text-stone-400 mt-1">
          आपके द्वारा सहेजे गए दिव्य वॉलपेपर एवं प्रेरणादायी विचार
        </p>
      </div>

      {/* Favorite Wallpapers */}
      {favoriteWallpapers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
            <span>पसंदीदा वॉलपेपर ({favoriteWallpapers.length})</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {favoriteWallpapers.map(wp => (
              <WallpaperCard
                key={wp.id}
                wallpaper={wp}
                isFavorite={true}
                onToggleFavorite={onToggleFavoriteWallpaper}
                onPreview={onPreviewWallpaper}
                onOpenInStudio={onOpenStudioWithWallpaper}
              />
            ))}
          </div>
        </div>
      )}

      {/* Favorite Quotes */}
      {favoriteQuotes.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-stone-800">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
            <span>पसंदीदा सुविचार ({favoriteQuotes.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteQuotes.map(quote => (
              <div
                key={quote.id}
                className="flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-900/60 p-5 space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-amber-400">
                    <span>{quote.sourceHi}</span>
                    <button
                      onClick={() => onToggleFavoriteQuote(quote.id)}
                      className="text-rose-500 hover:text-stone-400"
                    >
                      <Heart className="h-4 w-4 fill-rose-500" />
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed text-stone-200">
                    "{quote.hindiText}"
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onOpenStudioWithQuote(quote)}
                    className="flex items-center gap-1 rounded-lg bg-amber-600/20 px-3 py-1.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-600 hover:text-white transition-colors"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>स्टेटस बनाएँ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
