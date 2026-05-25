import { create } from "zustand";
import { 
  Profile, 
  MOCK_COMPANIONS, 
  MOCK_CONVERSATIONS, 
  MOCK_MESSAGES, 
  MOCK_BOOKINGS, 
  MOCK_NOTIFICATIONS, 
  MOCK_EMERGENCY_CONTACTS,
  MOCK_SAFETY_EVENTS,
  MOCK_RATINGS,
  Conversation, 
  ChatMessage, 
  Booking, 
  Notification,
  EmergencyContact,
  SafetyEvent,
  Rating,
  LiveLocationState,
} from "@/lib/mockData";

interface VelvetState {
  currentUser: {
    id: string;
    username: string;
    displayName: string;
    role: "customer" | "companion" | "admin";
    avatarUrl: string;
    onboarded: boolean;
    tier: "free" | "gold" | "platinum";
    credits: number;
    verificationStatus: "unverified" | "pending" | "verified";
    safeWord: string;
    requireVerifiedClients: boolean;
  } | null;
  ageConfirmed: boolean;

  companions: Profile[];
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  bookings: Booking[];
  notifications: Notification[];
  blockedUserIds: string[];
  emergencyContacts: EmergencyContact[];
  safetyEvents: SafetyEvent[];
  ratings: Rating[];
  liveLocationSharing: LiveLocationState | null;

  verificationRequests: Array<{
    id: string;
    username: string;
    avatarUrl: string;
    selfieUrl: string;
    submittedAt: string;
  }>;
  reportQueue: Array<{
    id: string;
    reporter: string;
    reportedUser: string;
    reason: string;
    details: string;
    createdAt: string;
  }>;
  distressAlerts: Array<{
    id: string;
    userId: string;
    username: string;
    avatarUrl: string;
    bookingId: string;
    timestamp: string;
    location: string;
  }>;

  searchQuery: string;
  radiusKm: number;
  filterVerifiedOnly: boolean;
  filterOnlineOnly: boolean;
  selectedCategory: string;

  setAgeConfirmed: (val: boolean) => void;
  setCurrentUser: (user: VelvetState["currentUser"]) => void;
  updateUserOnboarding: (data: Partial<VelvetState["currentUser"]>) => void;
  switchRole: (role: "customer" | "companion" | "admin") => void;

  setSearchQuery: (val: string) => void;
  setRadiusKm: (val: number) => void;
  setFilterVerifiedOnly: (val: boolean) => void;
  setFilterOnlineOnly: (val: boolean) => void;
  setSelectedCategory: (val: string) => void;

  sendMessage: (convId: string, text: string) => void;
  createConversation: (companionId: string) => string;
  markNotificationsAsRead: () => void;

  requestBooking: (companionId: string, scheduledAt: string, hours: number, requests: string) => void;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => void;

  upgradeSubscription: (tier: "gold" | "platinum") => void;
  buyCredits: (amount: number) => void;
  boostProfile: () => void;

  reportUser: (reportedId: string, reason: string) => void;
  blockUser: (blockedId: string) => void;

  approveVerification: (reqId: string) => void;
  rejectVerification: (reqId: string) => void;
  resolveReport: (reportId: string) => void;
  banUser: (username: string) => void;
  resolveDistress: (alertId: string) => void;

  checkInToBooking: (bookingId: string) => void;
  checkOutOfBooking: (bookingId: string) => void;
  triggerSafeWord: (bookingId: string) => void;

  addEmergencyContact: (contact: Omit<EmergencyContact, "id">) => void;
  removeEmergencyContact: (id: string) => void;
  updateSafeWord: (word: string) => void;

  startLocationSharing: (bookingId: string) => void;
  stopLocationSharing: () => void;

  triggerPanicButton: () => void;

  submitRating: (bookingId: string, toUserId: string, score: number, review?: string) => void;
  getPendingRatings: () => Booking[];
  getCompletenessScore: (userId?: string) => number;
  setRequireVerifiedClients: (val: boolean) => void;
}

export const useVelvetStore = create<VelvetState>((set, get) => ({
  currentUser: {
    id: "user-1",
    username: "vip_guest",
    displayName: "Julian Sterling",
    role: "customer",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    onboarded: true,
    tier: "free",
    credits: 50,
    verificationStatus: "unverified",
    safeWord: "",
    requireVerifiedClients: false,
  },
  ageConfirmed: false,

  companions: MOCK_COMPANIONS,
  conversations: MOCK_CONVERSATIONS,
  messages: MOCK_MESSAGES,
  bookings: MOCK_BOOKINGS,
  notifications: MOCK_NOTIFICATIONS,
  blockedUserIds: [],
  emergencyContacts: MOCK_EMERGENCY_CONTACTS,
  safetyEvents: MOCK_SAFETY_EVENTS,
  ratings: MOCK_RATINGS,
  liveLocationSharing: null,

  verificationRequests: [
    {
      id: "v-req-1",
      username: "elena_model",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      selfieUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400",
      submittedAt: "2026-05-21T09:00:00Z"
    },
    {
      id: "v-req-2",
      username: "marcus_k",
      avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
      selfieUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      submittedAt: "2026-05-21T11:15:00Z"
    }
  ],
  reportQueue: [
    {
      id: "rep-1",
      reporter: "seraphina_v",
      reportedUser: "guest_user_99",
      reason: "Inappropriate language",
      details: "Spammed messages requesting explicit contact details outside platform guidelines.",
      createdAt: "2026-05-21T08:30:00Z"
    }
  ],
  distressAlerts: [],

  searchQuery: "",
  radiusKm: 25,
  filterVerifiedOnly: false,
  filterOnlineOnly: false,
  selectedCategory: "All",

  setAgeConfirmed: (val) => set({ ageConfirmed: val }),
  setCurrentUser: (user) => set({ currentUser: user }),
  updateUserOnboarding: (data) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...data, onboarded: true } : null
  })),

  switchRole: (role) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, role } : null
  })),

  setSearchQuery: (val) => set({ searchQuery: val }),
  setRadiusKm: (val) => set({ radiusKm: val }),
  setFilterVerifiedOnly: (val) => set({ filterVerifiedOnly: val }),
  setFilterOnlineOnly: (val) => set({ filterOnlineOnly: val }),
  setSelectedCategory: (val) => set({ selectedCategory: val }),

  sendMessage: (convId, text) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "user",
      content: text,
      createdAt: new Date().toISOString(),
      isRead: true
    };

    set((state) => {
      const convMessages = state.messages[convId] || [];
      return {
        messages: { ...state.messages, [convId]: [...convMessages, newMessage] },
        conversations: state.conversations.map((c) => 
          c.id === convId ? { ...c, lastMessage: text, updatedAt: new Date().toISOString() } : c
        ),
      };
    });

    setTimeout(() => {
      const activeConv = get().conversations.find(c => c.id === convId);
      if (!activeConv) return;
      const companion = get().companions.find(c => c.id === activeConv.companionId);
      if (!companion) return;

      const hostReply: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: companion.id,
        content: `Thanks for messaging! I'd love to organize our nightlife companionship event. Let's arrange a booking request under my profile scheduler.`,
        createdAt: new Date().toISOString(),
        isRead: false
      };

      set((state) => {
        const convMessages = state.messages[convId] || [];
        return {
          messages: { ...state.messages, [convId]: [...convMessages, hostReply] },
          conversations: state.conversations.map((c) => 
            c.id === convId ? { ...c, lastMessage: hostReply.content, updatedAt: new Date().toISOString(), unreadCount: c.unreadCount + 1 } : c
          ),
          notifications: [{
            id: `not-${Date.now()}`,
            title: `Message from ${companion.displayName}`,
            message: hostReply.content,
            type: "message",
            referenceId: convId,
            isRead: false,
            createdAt: new Date().toISOString()
          }, ...state.notifications]
        };
      });
    }, 2500);
  },

  createConversation: (companionId) => {
    const existing = get().conversations.find((c) => c.companionId === companionId);
    if (existing) return existing.id;

    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      companionId,
      lastMessage: "Conversation initiated.",
      updatedAt: new Date().toISOString(),
      unreadCount: 0
    };

    set((state) => ({
      conversations: [newConv, ...state.conversations],
      messages: { ...state.messages, [newId]: [] }
    }));
    return newId;
  },

  markNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true }))
    }));
  },

  reportUser: (reportedId, reason) => {
    const state = get();
    const companion = state.companions.find(c => c.id === reportedId);
    if (!companion) return;

    set((state) => ({
      reportQueue: [...state.reportQueue, {
        id: `rep-${Date.now()}`,
        reporter: state.currentUser?.username || "unknown",
        reportedUser: companion.username,
        reason,
        details: `Reported from profile page. Reason: ${reason}`,
        createdAt: new Date().toISOString()
      }]
    }));
  },

  blockUser: (blockedId) => {
    set((state) => ({
      blockedUserIds: [...state.blockedUserIds, blockedId]
    }));
  },

  requestBooking: (companionId, scheduledAt, hours, requests) => {
    const companion = get().companions.find(c => c.id === companionId);
    if (!companion) return;

    const user = get().currentUser;
    if (companion.requireVerifiedClients && user?.verificationStatus !== "verified") {
      return;
    }

    const totalPrice = companion.pricingHourly * hours;
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      customerId: "user-1",
      companionId,
      status: "pending",
      scheduledAt,
      durationHours: hours,
      totalPrice,
      currency: companion.pricingCurrency,
      specialRequests: requests,
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      bookings: [newBooking, ...state.bookings]
    }));

    setTimeout(() => {
      get().updateBookingStatus(newBooking.id, "approved");

      set((state) => ({
        notifications: [{
          id: `not-bk-${Date.now()}`,
          title: "Booking Confirmed",
          message: `${companion.displayName} accepted your companions booking request for ${new Date(scheduledAt).toLocaleDateString()}.`,
          type: "booking_approved",
          referenceId: newBooking.id,
          isRead: false,
          createdAt: new Date().toISOString()
        }, ...state.notifications]
      }));
    }, 4000);
  },

  updateBookingStatus: (bookingId, status) => {
    set((state) => ({
      bookings: state.bookings.map((b) => b.id === bookingId ? { ...b, status, updatedAt: new Date().toISOString() } : b)
    }));
  },

  upgradeSubscription: (tier) => {
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, tier } : null
    }));
  },

  buyCredits: (amount) => {
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, credits: state.currentUser.credits + amount } : null
    }));
  },

  boostProfile: () => {
    set((state) => {
      if (!state.currentUser || state.currentUser.credits < 20) return {};
      return {
        currentUser: { ...state.currentUser, credits: state.currentUser.credits - 20 }
      };
    });
  },

  approveVerification: (reqId) => {
    const request = get().verificationRequests.find(r => r.id === reqId);
    if (!request) return;

    set((state) => ({
      verificationRequests: state.verificationRequests.filter(r => r.id !== reqId),
      companions: state.companions.map(c => c.username === request.username ? { ...c, isVerified: true, verificationStatus: "verified" } : c)
    }));
  },

  rejectVerification: (reqId) => {
    set((state) => ({
      verificationRequests: state.verificationRequests.filter(r => r.id !== reqId)
    }));
  },

  resolveReport: (reportId) => {
    set((state) => ({
      reportQueue: state.reportQueue.filter(r => r.id !== reportId)
    }));
  },

  banUser: (username) => {
    set((state) => ({
      companions: state.companions.filter(c => c.username !== username)
    }));
  },

  resolveDistress: (alertId) => {
    set((state) => ({
      distressAlerts: state.distressAlerts.filter(a => a.id !== alertId)
    }));
  },

  checkInToBooking: (bookingId) => {
    const now = new Date().toISOString();
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "active", checkedInAt: now } : b
      ),
      safetyEvents: [...state.safetyEvents, {
        id: `sev-${Date.now()}`,
        userId: state.currentUser?.id || "",
        type: "checkin",
        bookingId,
        timestamp: now
      }],
      notifications: [{
        id: `not-${Date.now()}`,
        title: "Checked In",
        message: "You have checked in. Your trusted contacts have been notified. Stay safe.",
        type: "booking_active",
        referenceId: bookingId,
        isRead: false,
        createdAt: now
      }, ...state.notifications]
    }));
  },

  checkOutOfBooking: (bookingId) => {
    const now = new Date().toISOString();
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "completed", checkedOutAt: now } : b
      ),
      safetyEvents: [...state.safetyEvents, {
        id: `sev-${Date.now()}`,
        userId: state.currentUser?.id || "",
        type: "checkout",
        bookingId,
        timestamp: now
      }],
      liveLocationSharing: state.liveLocationSharing?.bookingId === bookingId ? null : state.liveLocationSharing,
      notifications: [{
        id: `not-${Date.now()}`,
        title: "Checked Out",
        message: "You have checked out. Your trusted contacts have been notified that you're safe.",
        type: "safety_alert",
        referenceId: bookingId,
        isRead: false,
        createdAt: now
      }, ...state.notifications]
    }));
  },

  triggerSafeWord: (bookingId) => {
    const now = new Date().toISOString();
    const booking = get().bookings.find(b => b.id === bookingId);
    if (!booking) return;

    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: "distress" } : b
      ),
      safetyEvents: [...state.safetyEvents, {
        id: `sev-${Date.now()}`,
        userId: state.currentUser?.id || "",
        type: "safe_word",
        bookingId,
        timestamp: now
      }],
      distressAlerts: [...state.distressAlerts, {
        id: `da-${Date.now()}`,
        userId: state.currentUser?.id || "",
        username: state.currentUser?.username || "unknown",
        avatarUrl: state.currentUser?.avatarUrl || "",
        bookingId,
        timestamp: now,
        location: "Last known: 40.7580° N, 73.9855° W (New York, NY)"
      }],
      notifications: [{
        id: `not-${Date.now()}`,
        title: "Safe Word Triggered",
        message: "Your safe word has been detected. Emergency contacts and admin have been notified.",
        type: "safety_alert",
        referenceId: bookingId,
        isRead: false,
        createdAt: now
      }, ...state.notifications]
    }));
  },

  addEmergencyContact: (contact) => {
    const newContact: EmergencyContact = {
      id: `ec-${Date.now()}`,
      ...contact
    };
    set((state) => ({
      emergencyContacts: [...state.emergencyContacts, newContact]
    }));
  },

  removeEmergencyContact: (id) => {
    set((state) => ({
      emergencyContacts: state.emergencyContacts.filter(c => c.id !== id)
    }));
  },

  updateSafeWord: (word) => {
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, safeWord: word } : null
    }));
  },

  startLocationSharing: (bookingId) => {
    set({
      liveLocationSharing: {
        bookingId,
        isActive: true,
        sharedWithIds: get().emergencyContacts.map(c => c.id),
        updatedAt: new Date().toISOString()
      }
    });
  },

  stopLocationSharing: () => {
    set({ liveLocationSharing: null });
  },

  triggerPanicButton: () => {
    const now = new Date().toISOString();
    const activeBooking = get().bookings.find(b => b.status === "active" || b.status === "approved");

    if (activeBooking) {
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === activeBooking.id ? { ...b, status: "distress" } : b
        ),
      }));
    }

    set((state) => ({
      safetyEvents: [...state.safetyEvents, {
        id: `sev-${Date.now()}`,
        userId: state.currentUser?.id || "",
        type: "panic",
        bookingId: activeBooking?.id,
        timestamp: now
      }],
      distressAlerts: [...state.distressAlerts, {
        id: `da-${Date.now()}`,
        userId: state.currentUser?.id || "",
        username: state.currentUser?.username || "unknown",
        avatarUrl: state.currentUser?.avatarUrl || "",
        bookingId: activeBooking?.id || "none",
        timestamp: now,
        location: "Last known: 40.7580° N, 73.9855° W (New York, NY)"
      }],
      notifications: [{
        id: `not-${Date.now()}`,
        title: "Panic Alert Sent",
        message: "Your emergency alert has been sent. Admin and your trusted contacts have been notified.",
        type: "panic",
        referenceId: activeBooking?.id || "none",
        isRead: false,
        createdAt: now
      }, ...state.notifications]
    }));
  },

  submitRating: (bookingId, toUserId, score, review) => {
    const newRating: Rating = {
      id: `rat-${Date.now()}`,
      bookingId,
      fromUserId: get().currentUser?.id || "",
      toUserId,
      score,
      review,
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      ratings: [...state.ratings, newRating],
      companions: state.companions.map((c) => {
        if (c.id !== toUserId) return c;
        const userRatings = [...state.ratings, newRating].filter(r => r.toUserId === c.id);
        const avgRating = userRatings.reduce((sum, r) => sum + r.score, 0) / userRatings.length;
        return { ...c, rating: Math.round(avgRating * 10) / 10, reviewsCount: userRatings.length };
      })
    }));
  },

  getPendingRatings: () => {
    return get().bookings.filter(b =>
      b.status === "completed" &&
      !get().ratings.some(r => r.bookingId === b.id && r.fromUserId === get().currentUser?.id)
    );
  },

  getCompletenessScore: () => {
    const user = get().currentUser;
    if (!user) return 0;
    let score = 0;
    if (user.verificationStatus === "verified") score += 20;
    else if (user.verificationStatus === "pending") score += 5;
    const companion = get().companions.find(c => c.id === user.id);
    const p = companion || null;
    if (p?.bio && p.bio.length >= 50) score += 10;
    else if (p?.bio) score += 5;
    if ((p?.images?.length || 0) >= 3) score += 10;
    else if ((p?.images?.length || 0) > 0) score += 5;
    if ((p?.interests?.length || 0) >= 1) score += 5;
    if (user.safeWord) score += 10;
    if (get().emergencyContacts.length > 0) score += 10;
    if (p?.pricingHourly && p.pricingHourly > 0) score += 10;
    if (p?.availabilityStatus) score += 5;
    if (p?.displayName && p.displayName.length > 2) score += 5;
    if (user.onboarded) score += 10;
    return Math.min(score, 100);
  },

  setRequireVerifiedClients: (val) => {
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, requireVerifiedClients: val } : null
    }));
  },
}));
