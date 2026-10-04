import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles, Coins, Gift, Flame, Share2, Download, UserPlus, CheckCircle } from 'lucide-react';
import { PointActivity, getCurrentUser, UserProfile } from '../data/userStore';
import { festiveAudio } from '../utils/festiveAudio';

interface LivePointsTickerBannerProps {
  onOpenLeaderboard: () => void;
}

// Initial realistic simulated community activities for continuous right-to-left ticker
const SAMPLE_LIVE_ACTIVITIES: PointActivity[] = [
  {
    id: 'act_1',
    userId: 'u1',
    userName: 'राहुल शर्मा',
    activityType: 'whatsapp_share',
    pointsEarned: 25,
    festivalName: 'दीपावली',
    timestamp: 'अभी'
  },
  {
    id: 'act_2',
    userId: 'u2',
    userName: 'पूजा वर्मा',
    activityType: 'signup_bonus',
    pointsEarned: 50,
    festivalName: 'Shubhakamna',
    timestamp: '1 मिनट पहले'
  },
  {
    id: 'act_3',
    userId: 'u3',
    userName: 'अमित कुमार सिंह',
    activityType: 'download_card',
    pointsEarned: 15,
    festivalName: 'महाशिवरात्रि',
    timestamp: '2 मिनट पहले'
  },
  {
    id: 'act_4',
    userId: 'u4',
    userName: 'नेहा पटेल',
    activityType: 'status_share',
    pointsEarned: 40,
    festivalName: 'होली',
    timestamp: '3 मिनट पहले'
  },
  {
    id: 'act_5',
    userId: 'u5',
    userName: 'विकास मिश्रा',
    activityType: 'whatsapp_share',
    pointsEarned: 25,
    festivalName: 'श्री कृष्ण जन्माष्टमी',
    timestamp: '4 मिनट पहले'
  },
  {
    id: 'act_6',
    userId: 'u6',
    userName: 'सुनीता देवी',
    activityType: 'download_card',
    pointsEarned: 15,
    festivalName: 'छठ पूजा',
    timestamp: '5 मिनट पहले'
  }
];

export const LivePointsTickerBanner: React.FC<LivePointsTickerBannerProps> = ({ onOpenLeaderboard }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getCurrentUser());
  const [activities, setActivities] = useState<PointActivity[]>(SAMPLE_LIVE_ACTIVITIES);
  const [activeFloatingBanner, setActiveFloatingBanner] = useState<PointActivity | null>(null);

  useEffect(() => {
    const handleSessionChange = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener('shubhakamna_user_session_changed', handleSessionChange);
    return () => window.removeEventListener('shubhakamna_user_session_changed', handleSessionChange);
  }, []);

  // Listen for real-time points earned events
  useEffect(() => {
    const handleNewActivity = (e: Event) => {
      const customEvent = e as CustomEvent<PointActivity>;
      if (customEvent.detail) {
        const newAct = customEvent.detail;
        setActivities(prev => [newAct, ...prev.slice(0, 15)]);
        
        // Trigger floating banner sliding in from right to left
        setActiveFloatingBanner(newAct);

        // Play celebratory audio chime
        try {
          festiveAudio.playTempleBell();
        } catch {}

        // Auto-dismiss floating banner after 6 seconds
        setTimeout(() => {
          setActiveFloatingBanner(current => current?.id === newAct.id ? null : current);
        }, 6000);
      }
    };

    window.addEventListener('shubhakamna_new_point_activity' as any, handleNewActivity);
    return () => window.removeEventListener('shubhakamna_new_point_activity' as any, handleNewActivity);
  }, []);

  // Periodic random activity simulator to keep the news ticker vibrant
  useEffect(() => {
    const names = ['सौरभ जोशी', 'प्रिया गुप्ता', 'रोहित यादव', 'संदीप पाटिल', 'अंजलि शर्मा', 'दीपक वर्मा', 'कविता राठौड़'];
    const tasks: Array<{ type: PointActivity['activityType']; pts: number; desc: string }> = [
      { type: 'whatsapp_share', pts: 25, desc: 'WhatsApp विश शेयर' },
      { type: 'status_share', pts: 40, desc: 'स्टेटस शेयर' },
      { type: 'download_card', pts: 15, desc: '8K कार्ड डाउनलोड' },
      { type: 'link_copy', pts: 10, desc: 'लिंक कॉपी' }
    ];
    const festivals = ['दीपावली', 'होली', 'महाशिवरात्रि', 'रक्षाबंधन', 'गणेश चतुर्थी', 'नवरात्रि'];

    const interval = setInterval(() => {
      // 30% chance to emit a live activity into ticker
      if (Math.random() < 0.4) {
        const randName = names[Math.floor(Math.random() * names.length)];
        const randTask = tasks[Math.floor(Math.random() * tasks.length)];
        const randFest = festivals[Math.floor(Math.random() * festivals.length)];

        const act: PointActivity = {
          id: `sim_${Date.now()}`,
          userId: `sim_u_${Date.now()}`,
          userName: randName,
          activityType: randTask.type,
          pointsEarned: randTask.pts,
          festivalName: randFest,
          timestamp: 'अभी-अभी'
        };

        setActivities(prev => [act, ...prev.slice(0, 15)]);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: PointActivity['activityType']) => {
    switch (type) {
      case 'signup_bonus':
        return <UserPlus className="w-3.5 h-3.5 text-emerald-400" />;
      case 'whatsapp_share':
        return <Share2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'status_share':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'download_card':
        return <Download className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Gift className="w-3.5 h-3.5 text-yellow-400" />;
    }
  };

  const getActivityDescription = (act: PointActivity) => {
    switch (act.activityType) {
      case 'signup_bonus':
        return 'नया अकाउंट बनाकर';
      case 'whatsapp_share':
        return `${act.festivalName} विश शेयर करके`;
      case 'status_share':
        return `${act.festivalName} स्टेटस शेयर करके`;
      case 'download_card':
        return '8K विश कार्ड डाउनलोड करके';
      case 'link_copy':
        return 'विश लिंक कॉपी करके';
      default:
        return 'टास्क पूरा करके';
    }
  };

  return (
    <>
      {/* 1. CONTINUOUS NEWS CHANNEL STYLE TICKER (Right to Left Marquee) */}
      <div 
        onClick={onOpenLeaderboard}
        className="w-full bg-stone-950/95 border-y border-amber-500/30 overflow-hidden py-1.5 px-2 flex items-center cursor-pointer hover:bg-stone-900/90 transition group select-none shadow-inner"
        title="क्लिक करके लीडरबोर्ड व नकद पुरस्कार देखें"
      >
        {/* Leading Live Badge (News Channel Header) */}
        <div className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-md mr-3 uppercase tracking-wider z-10">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>🏆 लाइव रिवॉर्ड्स</span>
        </div>

        {/* Marquee Content Sliding Smoothly Right to Left */}
        <div className="flex-1 overflow-hidden whitespace-nowrap relative">
          <div className="inline-flex items-center gap-8 animate-marquee">
            {activities.concat(activities).map((act, idx) => (
              <div 
                key={`${act.id}-${idx}`}
                className="inline-flex items-center gap-2 text-xs text-stone-200 hover:text-amber-300 transition"
              >
                <span className="text-amber-400">✨</span>
                <span className="font-bold text-white">{act.userName}</span>
                <span className="text-stone-400 text-[11px]">{getActivityDescription(act)}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold font-mono text-[10px] border border-amber-500/30">
                  <Coins className="w-2.5 h-2.5 text-yellow-400" />
                  <span>+{act.pointsEarned} PTS</span>
                </span>
                <span className="text-stone-600">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trailing View All CTA */}
        <div className="shrink-0 hidden md:flex items-center gap-1 text-[11px] text-amber-300 font-bold ml-3 z-10 group-hover:underline">
          <span>लीडरबोर्ड देखें →</span>
        </div>
      </div>

      {/* 2. HIGH-IMPACT FLOATING ACHIEVEMENT BANNER (Slides in from Right to Left when Points Earned!) */}
      {activeFloatingBanner && (
        <div 
          onClick={onOpenLeaderboard}
          className="fixed top-20 right-4 sm:right-6 z-50 animate-slide-in-right cursor-pointer"
        >
          <div className="relative rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-stone-950 via-amber-950/80 to-stone-950 p-3.5 sm:p-4 shadow-2xl shadow-amber-500/40 text-white flex items-center gap-3.5 max-w-sm sm:max-w-md overflow-hidden hover:scale-102 transition group">
            
            {/* Ambient Background Sparkle Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-400/20 to-transparent pointer-events-none animate-pulse" />

            {/* Glowing Medal / Icon */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-stone-950 shrink-0 shadow-lg shadow-amber-500/40 animate-bounce">
              <Coins className="w-6 h-6 text-stone-950 fill-stone-950" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                  <span>पॉइंट्स रिवॉर्ड अनलॉक!</span>
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {activeFloatingBanner.timestamp}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-extrabold text-white truncate mt-0.5">
                🎉 {activeFloatingBanner.userName}
              </h4>

              <p className="text-[11px] text-stone-300 truncate">
                {getActivityDescription(activeFloatingBanner)}
              </p>
            </div>

            {/* Points Badge */}
            <div className="text-right shrink-0">
              <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-1">
                <span>+{activeFloatingBanner.pointsEarned}</span>
                <span className="text-[10px]">अंक</span>
              </span>
              <span className="block text-[9px] text-amber-300 font-semibold mt-0.5">
                रैंक अपडेट 🏆
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
