export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  upiId: string; // e.g. 9876543210@paytm, user@oksbi
  photoUrl?: string;
  points: number;
  sharesCount: number;
  createdAt: string;
  lastActivityAt: string;
  badges: string[];
  // Anti-cheating & Daily points limit
  dailyEarnedDate?: string; // YYYY-MM-DD
  dailyEarnedPoints?: number;
  lastShareTimestamp?: number;
}

export interface PointActivity {
  id: string;
  userId: string;
  userName: string;
  activityType: 'whatsapp_share' | 'status_share' | 'link_copy' | 'signup_bonus' | 'admin_bonus';
  pointsEarned: number;
  festivalName: string;
  timestamp: string;
}

export interface PointRules {
  whatsappShare: number;
  statusShare: number;
  copyLink: number;
  signupBonus: number;
  maxDailyPoints: number; // Maximum points a user can earn per day (anti-manipulation)
  shareCooldownSeconds: number; // Cooldown in seconds between share clicks
  monthlyRewardTitle: string;
  monthlyRewardAmount: string;
  firstPrize: number; // ₹100 for 1st
  secondPrize: number; // ₹50 for 2nd
  thirdPrize: number; // ₹20 for 3rd
  rewardDistributionNotice: string; // e.g. "हर महीने की 1 तारीख को नकद पुरस्कार UPI पर भेजा जाता है"
}

export interface WinnerPaymentProof {
  id: string;
  monthYear: string; // e.g. "सितंबर 2026", "अगस्त 2026"
  winnerName: string;
  upiId: string;
  amountPaid: string; // e.g. "₹100", "₹50", "₹20"
  screenshotUrl: string; // Image base64 or URL
  paidDate: string; // e.g. "01 अक्टूबर 2026"
  rank: number; // 1, 2, or 3
  notes?: string;
}

const STORAGE_KEYS = {
  USERS: 'shubhakamna_users_v2',
  CURRENT_USER: 'shubhakamna_active_user_v2',
  POINT_RULES: 'shubhakamna_point_rules_v2',
  ACTIVITIES: 'shubhakamna_activities_v2',
  WINNER_PROOFS: 'shubhakamna_winner_proofs_v2'
};

export const DEFAULT_POINT_RULES: PointRules = {
  whatsappShare: 25,
  statusShare: 40,
  copyLink: 10,
  signupBonus: 50,
  maxDailyPoints: 200, // Anti-abuse limit: 200 points max per day
  shareCooldownSeconds: 8, // 8-second cooldown between share clicks
  monthlyRewardTitle: 'मासिक नकद पुरस्कार (Monthly Cash Prizes)',
  monthlyRewardAmount: '1st: ₹100 | 2nd: ₹50 | 3rd: ₹20 (सीधा UPI भुगतान)',
  firstPrize: 100,
  secondPrize: 50,
  thirdPrize: 20,
  rewardDistributionNotice: 'हर महीने की 1 तारीख को शीर्ष 3 विजेताओं को सीधा उनके UPI खाते पर इनाम (1st: ₹100, 2nd: ₹50, 3rd: ₹20) भेजा जाता है।'
};

// Realistic pre-seeded community leaderboard participants
const INITIAL_DEMO_USERS: UserProfile[] = [
  {
    id: 'user_1',
    name: 'राजेश कुमार शर्मा',
    email: 'rajesh.sharma@example.com',
    password: 'password123',
    upiId: '9823412345@paytm',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    points: 1450,
    sharesCount: 58,
    createdAt: '2026-09-01T10:00:00.000Z',
    lastActivityAt: '2026-10-02T15:30:00.000Z',
    badges: ['🥇 रैंक #1', '🔥 शीर्ष शुभचिंतक'],
    dailyEarnedPoints: 50,
    dailyEarnedDate: new Date().toISOString().slice(0, 10)
  },
  {
    id: 'user_2',
    name: 'पूजा वर्मा',
    email: 'pooja.verma@example.com',
    password: 'password123',
    upiId: 'pooja.verma@oksbi',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    points: 1280,
    sharesCount: 51,
    createdAt: '2026-09-05T12:00:00.000Z',
    lastActivityAt: '2026-10-02T18:10:00.000Z',
    badges: ['🥈 रैंक #2', '⭐ स्टार शेयरर'],
    dailyEarnedPoints: 40,
    dailyEarnedDate: new Date().toISOString().slice(0, 10)
  },
  {
    id: 'user_3',
    name: 'अमित कुमार सिंह',
    email: 'amit.singh@example.com',
    password: 'password123',
    upiId: 'amit.singh@icici',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    points: 980,
    sharesCount: 39,
    createdAt: '2026-09-10T14:30:00.000Z',
    lastActivityAt: '2026-10-02T12:45:00.000Z',
    badges: ['🥉 रैंक #3', '✨ पावन दूत'],
    dailyEarnedPoints: 30,
    dailyEarnedDate: new Date().toISOString().slice(0, 10)
  },
  {
    id: 'user_4',
    name: 'सुनीता द्विवेदी',
    email: 'sunita.d@example.com',
    password: 'password123',
    upiId: '9871234560@ybl',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    points: 740,
    sharesCount: 29,
    createdAt: '2026-09-12T09:15:00.000Z',
    lastActivityAt: '2026-10-01T20:00:00.000Z',
    badges: ['🌟 सक्रिय सदस्य']
  },
  {
    id: 'user_5',
    name: 'विकास गुप्ता',
    email: 'vikas.gupta@example.com',
    password: 'password123',
    upiId: 'vikasg@axl',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    points: 520,
    sharesCount: 21,
    createdAt: '2026-09-18T16:20:00.000Z',
    lastActivityAt: '2026-10-02T08:30:00.000Z',
    badges: ['🎯 विशिंग एक्सपर्ट']
  }
];

// Pre-seeded winner payment proofs with realistic UPI receipt screenshots
const INITIAL_WINNER_PROOFS: WinnerPaymentProof[] = [
  {
    id: 'proof_1',
    monthYear: 'सितंबर 2026',
    winnerName: 'राजेश कुमार शर्मा',
    upiId: '9823412345@paytm',
    amountPaid: '₹100',
    paidDate: '01 अक्टूबर 2026',
    rank: 1,
    notes: 'PhonePe UPI सफलता पूर्वक ट्रांसफर - 1st Winner Prize Ref #TXN982349120',
    screenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'proof_2',
    monthYear: 'सितंबर 2026',
    winnerName: 'पूजा वर्मा',
    upiId: 'pooja.verma@oksbi',
    amountPaid: '₹50',
    paidDate: '01 अक्टूबर 2026',
    rank: 2,
    notes: 'Google Pay UPI ट्रांसफर सफल - 2nd Winner Prize Ref #GPay58921849',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'proof_3',
    monthYear: 'सितंबर 2026',
    winnerName: 'अमित कुमार सिंह',
    upiId: 'amit.singh@icici',
    amountPaid: '₹20',
    paidDate: '01 अक्टूबर 2026',
    rank: 3,
    notes: 'Paytm UPI ट्रांसफर सफल - 3rd Winner Prize Ref #PTM38472910',
    screenshotUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80'
  }
];

export function getStoredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse stored users:', e);
  }
  saveStoredUsers(INITIAL_DEMO_USERS);
  return INITIAL_DEMO_USERS;
}

export function saveStoredUsers(users: UserProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    window.dispatchEvent(new Event('shubhakamna_users_changed'));
  } catch (e) {
    console.error('Failed to save users:', e);
  }
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      const user: UserProfile = JSON.parse(raw);
      const all = getStoredUsers();
      const match = all.find(u => u.id === user.id);
      return match || user;
    }
  } catch (e) {
    console.warn('Failed to get current user:', e);
  }
  return null;
}

export function setCurrentUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    window.dispatchEvent(new Event('shubhakamna_user_session_changed'));
  } catch (e) {
    console.error('Failed to set current user session:', e);
  }
}

export function getStoredPointRules(): PointRules {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POINT_RULES);
    if (raw) {
      return { ...DEFAULT_POINT_RULES, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to parse point rules:', e);
  }
  return DEFAULT_POINT_RULES;
}

export function saveStoredPointRules(rules: PointRules): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POINT_RULES, JSON.stringify(rules));
    window.dispatchEvent(new Event('shubhakamna_users_changed'));
  } catch (e) {
    console.error('Failed to save point rules:', e);
  }
}

export function getStoredWinnerProofs(): WinnerPaymentProof[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WINNER_PROOFS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse winner proofs:', e);
  }
  saveStoredWinnerProofs(INITIAL_WINNER_PROOFS);
  return INITIAL_WINNER_PROOFS;
}

export function saveStoredWinnerProofs(proofs: WinnerPaymentProof[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WINNER_PROOFS, JSON.stringify(proofs));
    window.dispatchEvent(new Event('shubhakamna_proofs_changed'));
  } catch (e) {
    console.error('Failed to save winner proofs:', e);
  }
}

/**
 * Register a new user
 */
export function registerUser(params: {
  name: string;
  email: string;
  password?: string;
  upiId: string;
  photoUrl?: string;
}): { success: boolean; message: string; user?: UserProfile } {
  const users = getStoredUsers();
  const normalizedEmail = params.email.trim().toLowerCase();

  const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return { success: false, message: 'इस ईमेल से पहले से खाता मौजूद है! कृपया लॉग इन करें।' };
  }

  const rules = getStoredPointRules();
  const today = new Date().toISOString().slice(0, 10);
  const newUser: UserProfile = {
    id: `user_${Date.now()}`,
    name: params.name.trim(),
    email: normalizedEmail,
    password: params.password?.trim() || 'user123',
    upiId: params.upiId.trim(),
    photoUrl: params.photoUrl || '',
    points: rules.signupBonus, // Free signup bonus
    sharesCount: 0,
    createdAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    badges: ['🎉 नया सदस्य'],
    dailyEarnedDate: today,
    dailyEarnedPoints: rules.signupBonus,
    lastShareTimestamp: Date.now()
  };

  const updatedUsers = [newUser, ...users];
  saveStoredUsers(updatedUsers);
  setCurrentUser(newUser);

  return { success: true, message: `खाता सफलतापूर्वक बन गया! आपको मुफ़्त ${rules.signupBonus} बोनस अंक मिले 🎉`, user: newUser };
}

/**
 * Login user
 */
export function loginUser(email: string, pass: string): { success: boolean; message: string; user?: UserProfile } {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const match = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!match) {
    return { success: false, message: 'यह ईमेल पंजीकृत नहीं है। कृपया नया खाता बनाएँ।' };
  }

  if (match.password && match.password !== pass.trim()) {
    return { success: false, message: 'गलत पासवर्ड! कृपया सही पासवर्ड डालें।' };
  }

  setCurrentUser(match);
  return { success: true, message: `स्वागत है, ${match.name}! 👋`, user: match };
}

export function logoutUser(): void {
  setCurrentUser(null);
}

/**
 * Award points with Anti-Abuse, Rate-Limiting & Daily Caps
 */
export function awardUserPoints(
  activityType: 'whatsapp_share' | 'status_share' | 'link_copy',
  festivalName: string
): { awarded: boolean; points: number; newTotal: number; userName?: string; message?: string } {
  const current = getCurrentUser();
  if (!current) {
    return { 
      awarded: false, 
      points: 0, 
      newTotal: 0, 
      message: 'पॉइंट्स कमाने व नकद इनाम (1st: ₹100, 2nd: ₹50, 3rd: ₹20) जीतने के लिए कृपया लॉग इन करें!' 
    };
  }

  const rules = getStoredPointRules();
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);

  // 1. Anti-Cheat: Share Cooldown Check (prevents rapid clicking)
  const lastTime = current.lastShareTimestamp || 0;
  const cooldownMs = (rules.shareCooldownSeconds || 8) * 1000;
  if (now - lastTime < cooldownMs) {
    const waitSec = Math.ceil((cooldownMs - (now - lastTime)) / 1000);
    return {
      awarded: false,
      points: 0,
      newTotal: current.points,
      message: `⏳ कृपया ${waitSec} सेकंड रुककर पुनः शेयर करें (स्पैम सुरक्षा)!`
    };
  }

  // 2. Anti-Cheat: Daily Points Earning Cap
  const userDailyDate = current.dailyEarnedDate || today;
  let currentDayPoints = userDailyDate === today ? (current.dailyEarnedPoints || 0) : 0;

  if (currentDayPoints >= rules.maxDailyPoints) {
    return {
      awarded: false,
      points: 0,
      newTotal: current.points,
      message: `🛑 आज की अधिकतम सीमा (${rules.maxDailyPoints} अंक) पूरी हो चुकी है! नए अंक कल कमाएँ।`
    };
  }

  let pointsToAdd = 0;
  if (activityType === 'whatsapp_share') pointsToAdd = rules.whatsappShare;
  else if (activityType === 'status_share') pointsToAdd = rules.statusShare;
  else if (activityType === 'link_copy') pointsToAdd = rules.copyLink;

  // Cap at remaining daily allowance
  const remainingToday = rules.maxDailyPoints - currentDayPoints;
  if (pointsToAdd > remainingToday) {
    pointsToAdd = remainingToday;
  }

  if (pointsToAdd <= 0) {
    return {
      awarded: false,
      points: 0,
      newTotal: current.points,
      message: `आज की अधिकतम दैनिक सीमा पूरी हो चुकी है!`
    };
  }

  const users = getStoredUsers();
  const updatedUsers = users.map(u => {
    if (u.id === current.id) {
      const newPts = u.points + pointsToAdd;
      const newShares = u.sharesCount + 1;
      return {
        ...u,
        points: newPts,
        sharesCount: newShares,
        dailyEarnedDate: today,
        dailyEarnedPoints: currentDayPoints + pointsToAdd,
        lastShareTimestamp: now,
        lastActivityAt: new Date().toISOString()
      };
    }
    return u;
  });

  saveStoredUsers(updatedUsers);

  const updatedCurrentUser = updatedUsers.find(u => u.id === current.id) || current;
  setCurrentUser(updatedCurrentUser);

  return {
    awarded: true,
    points: pointsToAdd,
    newTotal: updatedCurrentUser.points,
    userName: updatedCurrentUser.name,
    message: `+${pointsToAdd} अंक मिले! (आज अर्जित: ${currentDayPoints + pointsToAdd}/${rules.maxDailyPoints})`
  };
}

/**
 * Retrieve sorted leaderboard
 */
export function getLeaderboard(): UserProfile[] {
  const users = getStoredUsers();
  return [...users].sort((a, b) => b.points - a.points);
}

/**
 * Update user details by Admin (Full Edit: Name, Email, Password, UPI ID, Points, Photo, Badges)
 */
export function updateUserByAdmin(userId: string, updates: Partial<UserProfile>): boolean {
  const users = getStoredUsers();
  const exists = users.some(u => u.id === userId);
  if (!exists) return false;

  const updated = users.map(u => u.id === userId ? { ...u, ...updates } : u);
  saveStoredUsers(updated);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    const updatedUser = updated.find(u => u.id === userId);
    if (updatedUser) setCurrentUser(updatedUser);
  }

  return true;
}

/**
 * Delete user by Admin
 */
export function deleteUserByAdmin(userId: string): boolean {
  const users = getStoredUsers();
  const filtered = users.filter(u => u.id !== userId);
  saveStoredUsers(filtered);

  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser(null);
  }

  return true;
}

/**
 * Export Payouts Data (CSV format)
 */
export function exportPayoutsCSV(): string {
  const users = getLeaderboard();
  let csv = 'Rank,Name,Email,UPI_ID,Password,Total_Points,Total_Shares,Join_Date\n';
  users.forEach((u, idx) => {
    const safeName = `"${u.name.replace(/"/g, '""')}"`;
    const safeEmail = `"${u.email.replace(/"/g, '""')}"`;
    const safeUpi = `"${u.upiId.replace(/"/g, '""')}"`;
    const safePass = `"${(u.password || '').replace(/"/g, '""')}"`;
    csv += `${idx + 1},${safeName},${safeEmail},${safeUpi},${safePass},${u.points},${u.sharesCount},${u.createdAt.slice(0, 10)}\n`;
  });
  return csv;
}
