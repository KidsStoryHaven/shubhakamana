import React, { useState } from 'react';
import { Quote, QuoteCategory } from '../types';
import { QUOTES } from '../data/quotes';
import { 
  Search, 
  Copy, 
  Check, 
  Volume2, 
  Share2, 
  Sparkles, 
  Heart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface QuotesSectionProps {
  favoriteQuoteIds: string[];
  onToggleFavoriteQuote: (id: string) => void;
  onOpenStudioWithQuote: (quote: Quote) => void;
}

const CATEGORIES: { id: QuoteCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'समस्त विचार', icon: '✨' },
  { id: 'gita', label: 'श्रीमद्भगवद्गीता', icon: '📖' },
  { id: 'bhakti', label: 'भक्ति व समर्पण', icon: '🕉️' },
  { id: 'prerna', label: 'प्रेरणा व कर्तव्य', icon: '⚡' },
  { id: 'shanti', label: 'शांति व ध्यान', icon: '🕊️' },
  { id: 'sankatmochan', label: 'संकटमोचन', icon: '🚩' },
  { id: 'suprabhat', label: 'सुप्रभात विचार', icon: '🌅' }
];

export const QuotesSection: React.FC<QuotesSectionProps> = ({
  favoriteQuoteIds,
  onToggleFavoriteQuote,
  onOpenStudioWithQuote
}) => {
  const [selectedCategory, setSelectedCategory] = useState<QuoteCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Filter quotes
  const filteredQuotes = QUOTES.filter(quote => {
    const matchesCategory = selectedCategory === 'all' || quote.category === selectedCategory;
    const matchesSearch = 
      quote.hindiText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quote.sanskritShloka && quote.sanskritShloka.toLowerCase().includes(searchQuery.toLowerCase())) ||
      quote.sourceHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyQuote = (quote: Quote) => {
    const textToCopy = `${quote.sanskritShloka ? quote.sanskritShloka + '\n\n' : ''}${quote.hindiText}\n\n- ${quote.sourceHi}\n(दिव्य दर्शन)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsAppShare = (quote: Quote) => {
    const text = encodeURIComponent(
      `🚩 *दिव्य सुविचार*\n\n${quote.sanskritShloka ? quote.sanskritShloka + '\n\n' : ''}"${quote.hindiText}"\n\n— *${quote.sourceHi}*\n\n📲 *दिव्य दर्शन - सनातन वॉलपेपर एवं सुविचार*`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleSpeak = (quote: Quote) => {
    if (speakingId === quote.id) {
      soundEngine.stopSpeech();
      setSpeakingId(null);
    } else {
      setSpeakingId(quote.id);
      const text = `${quote.sanskritShloka ? quote.sanskritShloka + '. ' : ''}${quote.hindiText}`;
      soundEngine.speakHindi(text);
      // Auto reset after rough estimate
      setTimeout(() => {
        setSpeakingId(null);
      }, 7000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            अनमोल सुविचार एवं वैदिक श्लोक
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            श्रीमद्भगवद्गीता, वेद, पुराण एवं संत वाणियों से संकलित प्रेरणादायी विचार
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="सुविचार या श्लोक खोजें..."
            className="w-full rounded-xl border border-stone-800 bg-stone-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400/40'
                  : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quotes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuotes.map(quote => {
          const isFav = favoriteQuoteIds.includes(quote.id);
          const isCopied = copiedId === quote.id;
          const isExpanded = expandedId === quote.id;
          const isSpeaking = speakingId === quote.id;

          return (
            <div
              key={quote.id}
              className="flex flex-col justify-between rounded-2xl border border-stone-800/80 bg-stone-900/60 p-5 backdrop-blur-sm transition-all hover:border-amber-500/40 hover:bg-stone-900/80"
            >
              <div className="space-y-3">
                {/* Source & Actions */}
                <div className="flex items-center justify-between text-[11px] text-amber-400 font-medium">
                  <span className="line-clamp-1">{quote.sourceHi}</span>
                  <button
                    onClick={() => onToggleFavoriteQuote(quote.id)}
                    aria-label="पसंदीदा"
                    className="text-stone-400 hover:text-rose-500 transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Sanskrit Shloka if available */}
                {quote.sanskritShloka && (
                  <div className="rounded-lg bg-stone-950/60 border border-amber-600/20 p-2.5">
                    <p className="text-xs font-serif text-amber-200/90 leading-relaxed italic">
                      {quote.sanskritShloka}
                    </p>
                  </div>
                )}

                {/* Primary Hindi Text */}
                <p className="text-sm font-medium leading-relaxed text-stone-100 font-sans">
                  "{quote.hindiText}"
                </p>

                {/* Expandable Meaning & English Translation */}
                {isExpanded && (
                  <div className="space-y-2 pt-2 border-t border-stone-800 text-xs">
                    {quote.hindiMeaning && (
                      <div>
                        <span className="font-semibold text-amber-400">सरल भावार्थ: </span>
                        <span className="text-stone-300">{quote.hindiMeaning}</span>
                      </div>
                    )}
                    {quote.englishTranslation && (
                      <div>
                        <span className="font-semibold text-stone-400">English: </span>
                        <span className="text-stone-400 italic">{quote.englishTranslation}</span>
                      </div>
                    )}
                  </div>
                )}

                {(quote.hindiMeaning || quote.englishTranslation) && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : quote.id)}
                    className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-200 transition-colors"
                  >
                    <span>{isExpanded ? 'संक्षिप्त करें' : 'विस्तृत भावार्थ देखें'}</span>
                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-800/80">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyQuote(quote)}
                    title="सुविचार कॉपी करें"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors"
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>

                  <button
                    onClick={() => handleSpeak(quote)}
                    title="उच्चारण सुनें"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      isSpeaking
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
                    }`}
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => handleWhatsAppShare(quote)}
                    title="WhatsApp पर शेयर करें"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700/30 text-emerald-400 border border-emerald-600/30 hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onOpenStudioWithQuote(quote)}
                  className="flex items-center gap-1 rounded-lg bg-amber-600/20 border border-amber-500/30 px-2.5 py-1.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-600 hover:text-white transition-all"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>पोस्टर बनाएँ</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-stone-800 bg-stone-900/40 p-8 space-y-2">
          <p className="text-base text-stone-300 font-medium">कोई सुविचार नहीं मिला</p>
          <p className="text-xs text-stone-500">कृपया अन्य शब्द या श्रेणी खोजें</p>
        </div>
      )}
    </div>
  );
};
