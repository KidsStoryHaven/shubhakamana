import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Search, 
  Play, 
  Music
} from 'lucide-react';
import { 
  NAVRATRI_GOOGLE_DRIVE_VIDEOS, 
  NavratriAiVideoItem 
} from '../data/navratriAiVideoData';
import { VideoStatusPlayer916 } from './VideoStatusPlayer916';
import { updatePageSEO } from '../utils/seoManager';

interface VideoStatusPageProps {
  onBackToPortal: () => void;
  onNavigateToPath?: (path: string) => void;
}

export const VideoStatusPage: React.FC<VideoStatusPageProps> = ({ 
  onBackToPortal, 
  onNavigateToPath 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [driveVideos, setDriveVideos] = useState<NavratriAiVideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('navratri_custom_drive_videos_v3');
      if (saved) return JSON.parse(saved);
    } catch {}
    return NAVRATRI_GOOGLE_DRIVE_VIDEOS;
  });

  const [selectedVideo, setSelectedVideo] = useState<NavratriAiVideoItem>(() => {
    return driveVideos[0];
  });
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(true);

  // Check URL query param ?v=...
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const vId = params.get('v');
      if (vId) {
        const found = driveVideos.find(v => v.id === vId);
        if (found) {
          setSelectedVideo(found);
          setIsStudioOpen(true);
        }
      }
    } catch {}
  }, [driveVideos]);

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://shubhakamna.in';
    updatePageSEO({
      title: '🎬 9:16 नवरात्रि वीडियो स्टेटस • अपना नाम व फोटो जोड़ें | Shubhakamna.in',
      description: 'WhatsApp स्टेटस के लिए पावन नवरात्रि वीडियो स्टेटस। अपना नाम, फोटो व शुभकामनाएं जोड़कर 1-क्लिक में HD वीडियो डाउनलोड व शेयर करें।',
      keywords: 'navratri video status, maa durga whatsapp 9:16, apna photo video status',
      canonicalUrl: `${origin}/video-status/`,
      ogType: 'website',
      ogImage: selectedVideo.imageUrl
    });
  }, [selectedVideo]);

  const filteredVideos = useMemo(() => {
    return driveVideos.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.avatarOrScene.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [driveVideos, searchQuery]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-20 selection:bg-amber-600 selection:text-white">
      
      {/* Top Header Navigation */}
      <div className="sticky top-0 z-30 bg-stone-950/95 backdrop-blur-md border-b border-amber-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          <button
            onClick={onBackToPortal}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-400 hover:text-amber-300 font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>होम पोर्टल</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500/15 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>9:16 स्टेटस स्टूडियो</span>
            </span>
          </div>

        </div>
      </div>

      {/* Hero Title */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-4 text-center space-y-3">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 tracking-tight leading-tight">
          नवरात्रि वीडियो स्टेटस (9:16 Reels)
        </h1>

        <p className="text-stone-300 text-xs sm:text-sm max-w-2xl mx-auto">
          वीडियो के ऊपर अपना नाम, बड़ी फोटो और पावन हिंदी शुभकामनाएँ जोड़ें। टेक्स्ट की स्पष्टता के लिए नीचे सुंदर बैकग्राउंड दिया गया है।
        </p>
      </div>

      {/* ============================================================ */}
      {/* 1. ACTIVE 9:16 STUDIO PLAYER & CUSTOMIZATION SECTION        */}
      {/* ============================================================ */}
      {isStudioOpen && selectedVideo && (
        <div className="max-w-5xl mx-auto px-3 sm:px-4 mb-10">
          <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-stone-900/95 via-stone-950/95 to-stone-900/95 p-3 sm:p-6 shadow-2xl backdrop-blur-xl">
            <VideoStatusPlayer916
              videoItem={selectedVideo}
              onSelectAnotherVideo={() => {
                const el = document.getElementById('drive-video-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. VIDEO GALLERY GRID                                        */}
      {/* ============================================================ */}
      <div id="drive-video-grid" className="max-w-6xl mx-auto px-4 pt-4 space-y-5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-amber-300 flex items-center gap-2">
              <span>🌺</span>
              <span>नवरात्रि वीडियो स्टेटस सूची (चुनें व कस्टमाइज़ करें)</span>
            </h2>
            <p className="text-xs text-stone-400">
              सभी वीडियो 9:16 वर्टिकल अनुपात में हैं। अपना नाम, फोटो और हिंदी शुभकामनाएँ जोड़कर डाउनलोड करें!
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="वीडियो खोजें..."
              className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredVideos.map((video) => {
            const isCurrentlySelected = selectedVideo.id === video.id;

            return (
              <div
                key={video.id}
                onClick={() => {
                  setSelectedVideo(video);
                  setIsStudioOpen(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 p-3.5 flex flex-col justify-between cursor-pointer bg-stone-900/80 hover:bg-stone-900 ${
                  isCurrentlySelected
                    ? 'border-amber-400 shadow-xl shadow-amber-500/20 ring-1 ring-amber-400/50'
                    : 'border-stone-800 hover:border-amber-500/50'
                }`}
              >
                <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-stone-950 border border-stone-800">
                  <img
                    src={video.imageUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40 pointer-events-none" />

                  <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-amber-500/40 text-[11px] font-black text-amber-300">
                    #{video.number}
                  </div>

                  <div className="absolute top-2 right-2 z-10 bg-red-600/90 text-white px-2 py-0.5 rounded-lg text-[10px] font-bold shadow">
                    {video.dayBadge}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-stone-900/90 border border-amber-400 text-amber-300 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-2 text-[10px] font-mono text-stone-300 bg-stone-950/80 px-2 py-0.5 rounded border border-stone-700">
                    9:16 WhatsApp Status
                  </div>
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold">
                      {video.avatarOrScene}
                    </span>
                    <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                      <Music className="w-3 h-3 text-amber-400" />
                      <span>भक्ति संगीत</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition line-clamp-2 leading-snug">
                    {video.title}
                  </h3>

                  <p className="text-[11px] text-stone-400 line-clamp-2">
                    {video.defaultBlessing}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <span>नाम व फोटो जोड़ें</span>
                    <span>→</span>
                  </span>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isCurrentlySelected
                      ? 'bg-amber-400 text-stone-950'
                      : 'bg-stone-800 text-stone-300'
                  }`}>
                    {isCurrentlySelected ? 'सक्रिय ✓' : 'चुनें'}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
