import React, { useState, useEffect } from 'react';
import { WishCategory, HindiWish, getBreadcrumbTrail, getCategoryBySlug, getChildCategories } from '../data/wishesData';
import { Breadcrumbs } from './Breadcrumbs';
import { WishCardGenerator } from './WishCardGenerator';
import { updatePageSEO } from '../utils/seoManager';
import { 
  Copy, 
  Check, 
  MessageCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  HelpCircle,
  Share2
} from 'lucide-react';

interface SEOPageProps {
  category: WishCategory;
  onNavigate: (url: string) => void;
}

export const SEOPage: React.FC<SEOPageProps> = ({ category, onNavigate }) => {
  const [selectedWish, setSelectedWish] = useState<HindiWish>(category.wishes[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Sync selectedWish when category changes
  useEffect(() => {
    if (category.wishes.length > 0) {
      setSelectedWish(category.wishes[0]);
    }
  }, [category]);

  // Dynamic SEO Meta updates
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shubhakamna.in';
    const canonicalUrl = `${origin}/${category.slug}/`;

    updatePageSEO({
      title: category.seoTitle,
      description: category.metaDescription,
      keywords: category.keywords.join(', '),
      canonicalUrl,
      ogImage: category.heroImageUrl,
      ogType: 'article'
    });
  }, [category]);

  const handleCopyWish = (text: string, id: string) => {
    navigator.clipboard.writeText(`${text}\n\n— Shubhakamna.in`).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleShareWhatsAppWish = (text: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shubhakamna.in';
    const pageUrl = `${origin}/${category.slug}/`;
    const message = `${text}\n\n👇 अपने नाम का सुंदर कार्ड यहाँ बनाएं:\n${pageUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const breadcrumbs = getBreadcrumbTrail(category);
  const childCategories = getChildCategories(category.slug);

  return (
    <article className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* 1. Breadcrumbs for Google SEO hierarchy */}
      <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />

      {/* 2. Top Header & H1 */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <span>{category.theme.accentEmoji}</span>
          <span>{category.nameEn}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight font-serif">
          {category.h1}
        </h1>

        {/* Rich introductory text (Crawlable indexable content) */}
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
          {category.intro}
        </p>

        {/* Hero Banner Image */}
        <div className="relative rounded-3xl overflow-hidden aspect-[21/9] border border-stone-800 shadow-xl">
          <img
            src={category.heroImageUrl}
            alt={category.nameHi}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-300">
            <span className="font-semibold text-amber-300 flex items-center gap-1.5">
              <span>{category.theme.accentEmoji}</span>
              <span>{category.nameHi} विशेष संकलन</span>
            </span>
            <span className="text-[11px] text-stone-400 font-mono">
              अपडेटेड: {category.updatedAt}
            </span>
          </div>
        </div>
      </header>

      {/* 3. Subcategory Quick Links (Pillar to Cluster internal links) */}
      {childCategories.length > 0 && (
        <section className="bg-stone-900/60 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-3">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>संबंध-वार विशेष पृष्ठ (Explore by Relationship):</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {childCategories.map(child => (
              <button
                key={child.slug}
                type="button"
                onClick={() => onNavigate(`/${child.slug}/`)}
                className="px-3.5 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-700 hover:border-amber-400 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer group"
              >
                <span>{child.theme.accentEmoji}</span>
                <span className="group-hover:text-amber-300">{child.nameHi}</span>
                <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-amber-400 transition" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 4. Interactive Personalized Wish Card Generator (Embedded right here) */}
      <section aria-labelledby="card-generator-heading">
        <WishCardGenerator
          category={category}
          selectedWish={selectedWish}
          onSelectWish={w => setSelectedWish(w)}
        />
      </section>

      {/* 5. Crawlable Wishes & Shayari List with Quick Copy / Share */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white font-serif flex items-center gap-2">
            <span>सर्वश्रेष्ठ {category.nameHi} संदेश व शायरी</span>
            <span className="text-xs font-sans text-stone-400 font-normal">
              ({category.wishes.length} संदेश)
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {category.wishes.map((wish, index) => (
            <div
              key={wish.id}
              className={`p-4 sm:p-5 rounded-2xl border transition relative ${
                selectedWish.id === wish.id
                  ? 'bg-amber-950/20 border-amber-500/50 shadow-lg'
                  : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 font-mono">
                  #{index + 1} {wish.authorOrTone ? `· ${wish.authorOrTone}` : ''}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWish(wish);
                      document.getElementById('card-generator')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[11px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2 py-1 rounded-lg border border-amber-500/30 font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>कार्ड बनाएं</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyWish(wish.hindiText, wish.id)}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition cursor-pointer"
                    title="टेक्स्ट कॉपी करें"
                  >
                    {copiedId === wish.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareWhatsAppWish(wish.hindiText)}
                    className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition cursor-pointer"
                    title="WhatsApp पर भेजें"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-sm sm:text-base text-stone-100 leading-relaxed font-medium">
                "{wish.hindiText}"
              </p>

              {wish.tags && wish.tags.length > 0 && (
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  {wish.tags.map(t => (
                    <span
                      key={t}
                      className="text-[10px] bg-stone-950 text-stone-400 px-2 py-0.5 rounded border border-stone-800"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ Section (Compliant with Google Search Guidelines) */}
      {category.faqs && category.faqs.length > 0 && (
        <section className="space-y-4 pt-2" aria-labelledby="faq-heading">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h2 id="faq-heading" className="text-lg sm:text-xl font-bold text-white font-serif">
              अक्सर पूछे जाने वाले सवाल (FAQs)
            </h2>
          </div>

          <div className="space-y-2.5">
            {category.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-800 bg-stone-900/60 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-stone-800/40 transition cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-stone-200">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-stone-400 leading-relaxed border-t border-stone-800/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. Related Categories / Internal Linking Mesh */}
      <section className="space-y-3 pt-4 border-t border-stone-800">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
          अन्य संबंधित शुभकामनाएं व पर्व (Related Wishes):
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {category.relatedSlugs.map(rSlug => {
            const relCat = getCategoryBySlug(rSlug);
            if (!relCat) return null;

            return (
              <button
                key={relCat.slug}
                type="button"
                onClick={() => onNavigate(`/${relCat.slug}/`)}
                className="p-3 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-400/50 text-left transition cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{relCat.theme.accentEmoji}</span>
                  <span className="text-xs font-semibold text-stone-200 group-hover:text-amber-300 truncate">
                    {relCat.nameHi}
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 line-clamp-1">
                  {relCat.nameEn}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </article>
  );
};
