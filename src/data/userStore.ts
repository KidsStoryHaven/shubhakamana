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
  monthlyRewardTitle: string;
  monthlyRewardAmount: string;
}

const STORAGE_KEYS = {
  USERS: 'shubhakamna_users_v2',
  CURRENT_USER: 'shubhakamna_active_user_v2',
  POINT_RULES: 'shubhakamna_point_rules_v2',
  ACTIVITIES: 'shubhakamna_activities_v2'
};

export const DEFAULT_POINT_RULES: PointRules = {
  whatsappShare: 25,
  statusShare: 40,
  copyLink: 10,
  signupBonus: 50,
  monthlyRewardTitle: 'मासिक महा-पुरस्कार (Monthly Grand Prize)',
  monthlyRewardAmount: '₹5,100 + विशेष सम्मान प्रमाणपत्र'
};

// Realistic pre-seeded community leaderboard participants
const INITIAL_DEMO_USERS: UserProfile[] = [
  {
    id: 'user_1',
    name: 'राजेश कुमार शर्मा',
    email: 'rajesh.sharma@example.com',
    upiId: '9823412345@paytm',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    points: 1450,
    sharesCount: 58,
    createdAt: '2026-09-01T10:00:00.000Z',
    lastActivityAt: '2026-10-02T15:30:00.000Z',
    badges: ['🥇 रैंक #1', '🔥 शीर्ष शुभचिंतक']
  },
  {
    id: 'user_2',
    name: 'पूजा वर्मा',
    email: 'pooja.verma@example.com',
    upiId: 'pooja.verma@oksbi',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    points: 1280,
    sharesCount: 51,
    createdAt: '2026-09-05T12:00:00.000Z',
    lastActivityAt: '2026-10-02T18:10:00.000Z',
    badges: ['🥈 रैंक #2', '⭐ स्टार शेयरर']
  },
  {
    id: 'user_3',
    name: 'अमित कुमार सिंह',
    email: 'amit.singh@example.com',
    upiId: 'amit.singh@icici',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    points: 980,
    sharesCount: 39,
    createdAt: '2026-09-10T14:30:00.000Z',
    lastActivityAt: '2026-10-02T12:45:00.000Z',
    badges: ['🥉 रैंक #3', '✨ पावन दूत']
  },
  {
    id: 'user_4',
    name: 'सुनीता द्विवेदी',
    email: 'sunita.d@example.com',
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
    upiId: 'vikasg@axl',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    points: 520,
    sharesCount: 21,
    createdAt: '2026-09-18T16:20:00.000Z',
    lastActivityAt: '2026-10-02T08:30:00.000Z',
    badges: ['🎯 विशिंग एक्सपर्ट']
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
  // Initialize with initial demo community members
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
      // Fetch latest points/data from all users list
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
  const newUser: UserProfile = {
    id: `user_${Date.now()}`,
    name: params.name.trim(),
    email: normalizedEmail,
    password: params.password?.trim() || '',
    upiId: params.upiId.trim(),
    photoUrl: params.photoUrl || '',
    points: rules.signupBonus, // Free signup bonus
    sharesCount: 0,
    createdAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
    badges: ['🎉 नया सदस्य']
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
 * Award points to active logged-in user
 */
export function awardUserPoints(
  activityType: 'whatsapp_share' | 'status_share' | 'link_copy',
  festivalName: string
): { awarded: boolean; points: number; newTotal: number; userName?: string } {
  const current = getCurrentUser();
  if (!current) {
    return { awarded: false, points: 0, newTotal: 0 };
  }

  const rules = getStoredPointRules();
  let pointsToAdd = 0;
  if (activityType === 'whatsapp_share') pointsToAdd = rules.whatsappShare;
  else if (activityType === 'status_share') pointsToAdd = rules.statusShare;
  else if (activityType === 'link_copy') pointsToAdd = rules.copyLink;

  const users = getStoredUsers();
  const updatedUsers = users.map(u => {
    if (u.id === current.id) {
      const newPts = u.points + pointsToAdd;
      const newShares = u.sharesCount + 1;
      return {
        ...u,
        points: newPts,
        sharesCount: newShares,
        lastActivityAt: new Date().toISOString()
      };
    }
    return u;
  });

  saveStoredUsers(updatedUsers);

  // Update current session
  const updatedCurrentUser = updatedUsers.find(u => u.id === current.id) || current;
  setCurrentUser(updatedCurrentUser);

  return {
    awarded: true,
    points: pointsToAdd,
    newTotal: updatedCurrentUser.points,
    userName: updatedCurrentUser.name
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
 * Update user details by Admin
 */
export function updateUserByAdmin(userId: string, updates: Partial<UserProfile>): boolean {
  const users = getStoredUsers();
  const exists = users.some(u => u.id === userId);
  if (!exists) return false;

  const updated = users.map(u => u.id === userId ? { ...u, ...updates } : u);
  saveStoredUsers(updated);

  // If currently active user was updated, sync session
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
  let csv = 'Rank,Name,Email,UPI_ID,Total_Points,Total_Shares,Join_Date\n';
  users.forEach((u, idx) => {
    const safeName = `"${u.name.replace(/"/g, '""')}"`;
    const safeEmail = `"${u.email.replace(/"/g, '""')}"`;
    const safeUpi = `"${u.upiId.replace(/"/g, '""')}"`;
    csv += `${idx + 1},${safeName},${safeEmail},${safeUpi},${u.points},${u.sharesCount},${u.createdAt.slice(0, 10)}\n`;
  });
  return csv;
}
