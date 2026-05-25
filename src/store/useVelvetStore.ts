import { create } from "zustand";
import { 
  Profile, 
  MOCK_COMPANIONS, 
  MOCK_CONVERSATIONS, 
  MOCK_MESSAGES, 
  MOCK_BOOKINGS, 
  MOCK_NOTIFICATIONS, 
  Conversation, 
  ChatMessage, 
  Booking, 
  Notification 
} from "@/lib/mockData";

interface VelvetState {
  // Auth State
  currentUser: {
    id: string;
    username: string;
    displayName: string;
    role: "customer" | "companion" | "admin";
    avatarUrl: string;
    onboarded: boolean;
    tier: "free" | "gold" | "platinum";
    credits: number;
  } | null;
  ageConfirmed: boolean;
  
  // App Core Lists
  companions: Profile[];
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  bookings: Booking[];
  notifications: Notification[];
  
  // Blocked users
  blockedUserIds: string[];

  // Moderation / Verification Queues (for Admin Dashboard)
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

  // Search & Filtering Settings
  searchQuery: string;
  radiusKm: number;
  filterVerifiedOnly: boolean;
  filterOnlineOnly: boolean;
  selectedCategory: string;

  // Actions
  setAgeConfirmed: (val: boolean) => void;
  setCurrentUser: (user: VelvetState["currentUser"]) => void;
  updateUserOnboarding: (data: Partial<VelvetState["currentUser"]>) => void;
  switchRole: (role: "customer" | "companion" | "admin") => void;
  
  // Discover Page Swipe Feed Filters
  setSearchQuery: (val: string) => void;
  setRadiusKm: (val: number) => void;
  setFilterVerifiedOnly: (val: boolean) => void;
  setFilterOnlineOnly: (val: boolean) => void;
  setSelectedCategory: (val: string) => void;

  // Messaging Actions
  sendMessage: (convId: string, text: string) => void;
  createConversation: (companionId: string) => string;
  markNotificationsAsRead: () => void;

  // Booking Actions
  requestBooking: (companionId: string, scheduledAt: string, hours: number, requests: string) => void;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => void;
  
  // Subscriptions & Monetization
  upgradeSubscription: (tier: "gold" | "platinum") => void;
  buyCredits: (amount: number) => void;
  boostProfile: () => void;

  // Safety Actions
  reportUser: (reportedId: string, reason: string) => void;
  blockUser: (blockedId: string) => void;

  // Admin Dashboard Actions
  approveVerification: (reqId: string) => void;
  rejectVerification: (reqId: string) => void;
  resolveReport: (reportId: string) => void;
  banUser: (username: string) => void;
}

export const useVelvetStore = create<VelvetState>((set, get) => ({
  // Active session details
  currentUser: {
    id: "user-1",
    username: "vip_guest",
    displayName: "Julian Sterling",
    role: "customer",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    onboarded: true,
    tier: "free",
    credits: 50,
  },
  ageConfirmed: false,

  companions: MOCK_COMPANIONS,
  conversations: MOCK_CONVERSATIONS,
  messages: MOCK_MESSAGES,
  bookings: MOCK_BOOKINGS,
  notifications: MOCK_NOTIFICATIONS,

  blockedUserIds: [],

  // Admin dashboards queues
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

  // Feeds filtering configurations
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
      const updatedMessages = [...convMessages, newMessage];
      const updatedConversations = state.conversations.map((c) => 
        c.id === convId ? { ...c, lastMessage: text, updatedAt: new Date().toISOString() } : c
      );

      return {
        messages: { ...state.messages, [convId]: updatedMessages },
        conversations: updatedConversations
      };
    });

    // Simulated "Typing Presence" Response from Host to show realtime premium feel!
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
        const updatedMessages = [...convMessages, hostReply];
        const updatedConversations = state.conversations.map((c) => 
          c.id === convId ? { ...c, lastMessage: hostReply.content, updatedAt: new Date().toISOString(), unreadCount: c.unreadCount + 1 } : c
        );
        const newNotif: Notification = {
          id: `not-${Date.now()}`,
          title: `Message from ${companion.displayName}`,
          message: hostReply.content,
          type: "message",
          referenceId: convId,
          isRead: false,
          createdAt: new Date().toISOString()
        };

        return {
          messages: { ...state.messages, [convId]: updatedMessages },
          conversations: updatedConversations,
          notifications: [newNotif, ...state.notifications]
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

    // Auto-approve after 4 seconds to show functional flow!
    setTimeout(() => {
      get().updateBookingStatus(newBooking.id, "approved");
      
      const newNotif: Notification = {
        id: `not-bk-${Date.now()}`,
        title: "Booking Confirmed",
        message: `${companion.displayName} accepted your companions booking request for ${new Date(scheduledAt).toLocaleDateString()}.`,
        type: "booking_approved",
        referenceId: newBooking.id,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      set((state) => ({
        notifications: [newNotif, ...state.notifications]
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
      
      // Deduct credits and simulate boost activation
      return {
        currentUser: { ...state.currentUser, credits: state.currentUser.credits - 20 }
      };
    });
  },

  // Admin Dashboard Actions
  approveVerification: (reqId) => {
    const request = get().verificationRequests.find(r => r.id === reqId);
    if (!request) return;

    set((state) => ({
      verificationRequests: state.verificationRequests.filter(r => r.id !== reqId),
      companions: state.companions.map(c => c.username === request.username ? { ...c, isVerified: true } : c)
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
  }
}));
