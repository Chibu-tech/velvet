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

import { isMockMode } from "@/lib/supabase";
import * as authService from "@/services/auth.service";
import * as profileService from "@/services/profile.service";
import * as bookingService from "@/services/booking.service";
import * as chatService from "@/services/chat.service";
import * as notificationService from "@/services/notification.service";
import * as verificationService from "@/services/verification.service";
import * as moderationService from "@/services/moderation.service";
import * as subscriptionService from "@/services/subscription.service";

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
  panicModalState: {
    show: boolean;
    countingDown: boolean;
    countdownValue: number;
  };

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

  sendMessage: (convId: string, text: string) => Promise<void> | void;
  createConversation: (companionId: string) => Promise<string> | string;
  markNotificationsAsRead: () => Promise<void> | void;

  requestBooking: (companionId: string, scheduledAt: string, hours: number, requests: string) => Promise<void> | void;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => Promise<void> | void;

  upgradeSubscription: (tier: "gold" | "platinum") => Promise<void> | void;
  buyCredits: (amount: number) => Promise<void> | void;
  boostProfile: () => Promise<void> | void;

  reportUser: (reportedId: string, reason: string) => Promise<void> | void;
  blockUser: (blockedId: string) => void;

  approveVerification: (reqId: string) => Promise<void> | void;
  rejectVerification: (reqId: string) => Promise<void> | void;
  resolveReport: (reportId: string) => Promise<void> | void;
  banUser: (username: string) => Promise<void> | void;
  resolveDistress: (alertId: string) => Promise<void> | void;

  checkInToBooking: (bookingId: string) => Promise<void> | void;
  checkOutOfBooking: (bookingId: string) => Promise<void> | void;
  triggerSafeWord: (bookingId: string) => Promise<void> | void;

  addEmergencyContact: (contact: Omit<EmergencyContact, "id">) => void;
  removeEmergencyContact: (id: string) => void;
  updateSafeWord: (word: string) => Promise<void> | void;

  startLocationSharing: (bookingId: string) => void;
  stopLocationSharing: () => void;

  triggerPanicButton: () => Promise<void> | void;
  cancelPanic: () => void;
  setPanicModalState: (state: Partial<{
    show: boolean;
    countingDown: boolean;
    countdownValue: number;
  }>) => void;

  submitRating: (bookingId: string, toUserId: string, score: number, review?: string) => void;
  getPendingRatings: () => Booking[];
  getCompletenessScore: (userId?: string) => number;
  setRequireVerifiedClients: (val: boolean) => void;
  setVerificationStatus?: (status: "unverified" | "pending" | "verified") => void;

  initFromSupabase: () => Promise<void>;
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
  panicModalState: {
    show: false,
    countingDown: false,
    countdownValue: 5,
  },

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

  sendMessage: async (convId, text) => {
    const state = get();
    const user = state.currentUser;
    if (!user) return;

    if (isMockMode()) {
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
      return;
    }

    await chatService.sendMessage(convId, user.id, text);
    const conversations = await chatService.getConversations(user.id);
    const messages = await chatService.getMessages(convId);
    set((state) => ({
      conversations,
      messages: { ...state.messages, [convId]: messages },
    }));
  },

  createConversation: async (companionId) => {
    const user = get().currentUser;
    if (!user) return "";

    if (isMockMode()) {
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
    }

    const id = await chatService.createConversation(companionId, user.id);
    const conversations = await chatService.getConversations(user.id);
    set({ conversations, messages: { ...get().messages, [id]: [] } });
    return id;
  },

  markNotificationsAsRead: async () => {
    if (isMockMode()) {
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true }))
      }));
      return;
    }
    const user = get().currentUser;
    if (!user) return;
    await notificationService.markNotificationsAsRead(user.id);
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true }))
    }));
  },

  reportUser: async (reportedId, reason) => {
    const user = get().currentUser;
    if (!user) return;

    if (isMockMode()) {
      const companion = get().companions.find(c => c.id === reportedId);
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
      return;
    }

    await moderationService.reportUser(user.id, reportedId, reason);
  },

  blockUser: (blockedId) => {
    set((state) => ({
      blockedUserIds: [...state.blockedUserIds, blockedId]
    }));
  },

  requestBooking: async (companionId, scheduledAt, hours, requests) => {
    const companion = get().companions.find(c => c.id === companionId);
    const user = get().currentUser;
    if (!companion || !user) return;

    if (companion.requireVerifiedClients && user?.verificationStatus !== "verified") {
      return;
    }

    const totalPrice = companion.pricingHourly * hours;

    if (isMockMode()) {
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
      return;
    }

    await bookingService.createBooking({
      customerId: user.id,
      companionId,
      scheduledAt,
      durationHours: hours,
      totalPrice,
      currency: companion.pricingCurrency,
      specialRequests: requests,
    });
    const bookings = await bookingService.getBookings(user.id);
    set({ bookings });
  },

  updateBookingStatus: async (bookingId, status) => {
    if (isMockMode()) {
      set((state) => ({
        bookings: state.bookings.map((b) => b.id === bookingId ? { ...b, status, updatedAt: new Date().toISOString() } : b)
      }));
      return;
    }
    await bookingService.updateBookingStatus(bookingId, status);
    const user = get().currentUser;
    if (user) {
      const bookings = await bookingService.getBookings(user.id);
      set({ bookings });
    }
  },

  upgradeSubscription: async (tier) => {
    if (isMockMode()) {
      set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, tier } : null
      }));
      return;
    }
    const user = get().currentUser;
    if (!user) return;
    await subscriptionService.upgradeSubscription(user.id, tier);
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, tier } : null
    }));
  },

  buyCredits: async (amount) => {
    if (isMockMode()) {
      set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, credits: state.currentUser.credits + amount } : null
      }));
      return;
    }
    const user = get().currentUser;
    if (!user) return;
    await subscriptionService.addCredits(user.id, amount);
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, credits: (state.currentUser.credits || 0) + amount } : null
    }));
  },

  boostProfile: async () => {
    if (isMockMode()) {
      set((state) => {
        if (!state.currentUser || state.currentUser.credits < 20) return {};
        return {
          currentUser: { ...state.currentUser, credits: state.currentUser.credits - 20 }
        };
      });
      return;
    }
    const user = get().currentUser;
    if (!user) return;
    const ok = await subscriptionService.boostProfile(user.id);
    if (ok) {
      set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, credits: state.currentUser.credits - 20 } : null
      }));
    }
  },

  approveVerification: async (reqId) => {
    if (isMockMode()) {
      const request = get().verificationRequests.find(r => r.id === reqId);
      if (!request) return;

      set((state) => ({
        verificationRequests: state.verificationRequests.filter(r => r.id !== reqId),
        companions: state.companions.map(c => c.username === request.username ? { ...c, isVerified: true, verificationStatus: "verified" } : c)
      }));
      return;
    }
    const user = get().currentUser;
    if (!user) return;
    await verificationService.approveVerification(reqId, user.id);
    const reqs = await verificationService.getVerificationRequests();
    const companions = await profileService.getProfiles({ role: "companion" });
    set({ verificationRequests: reqs, companions });
  },

  rejectVerification: async (reqId) => {
    if (isMockMode()) {
      set((state) => ({
        verificationRequests: state.verificationRequests.filter(r => r.id !== reqId)
      }));
      return;
    }
    const user = get().currentUser;
    if (!user) return;
    await verificationService.rejectVerification(reqId, user.id);
    const reqs = await verificationService.getVerificationRequests();
    set({ verificationRequests: reqs });
  },

  resolveReport: async (reportId) => {
    if (isMockMode()) {
      set((state) => ({
        reportQueue: state.reportQueue.filter(r => r.id !== reportId)
      }));
      return;
    }
    const user = get().currentUser;
    if (!user) return;
    await moderationService.resolveReport(reportId, user.id);
    const reports = await moderationService.getReports();
    set({ reportQueue: reports });
  },

  banUser: async (username) => {
    if (isMockMode()) {
      set((state) => ({
        companions: state.companions.filter(c => c.username !== username)
      }));
      return;
    }
    const companion = get().companions.find(c => c.username === username);
    if (companion) {
      await moderationService.banUser(companion.id);
      const companions = await profileService.getProfiles({ role: "companion" });
      set({ companions });
    }
  },

  resolveDistress: async (alertId) => {
    if (isMockMode()) {
      set((state) => ({
        distressAlerts: state.distressAlerts.filter(a => a.id !== alertId)
      }));
      return;
    }
    const user = get().currentUser;
    if (!user) return;
    await moderationService.resolveDistress(alertId, user.id);
    const alerts = await moderationService.getDistressAlerts();
    set({ distressAlerts: alerts });
  },

  checkInToBooking: async (bookingId) => {
    const now = new Date().toISOString();

    if (isMockMode()) {
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
      return;
    }

    const user = get().currentUser;
    if (!user) return;
    await bookingService.updateBookingStatus(bookingId, "active", { checkedInAt: now });
    await moderationService.createSafetyEvent(user.id, "checkin", bookingId);
    const bookings = await bookingService.getBookings(user.id);
    set((state) => ({
      bookings,
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

  checkOutOfBooking: async (bookingId) => {
    const now = new Date().toISOString();

    if (isMockMode()) {
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
      return;
    }

    const user = get().currentUser;
    if (!user) return;
    await bookingService.updateBookingStatus(bookingId, "completed", { checkedOutAt: now });
    await moderationService.createSafetyEvent(user.id, "checkout", bookingId);
    const bookings = await bookingService.getBookings(user.id);
    set((state) => ({
      bookings,
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

  triggerSafeWord: async (bookingId) => {
    const now = new Date().toISOString();
    const booking = get().bookings.find(b => b.id === bookingId);
    if (!booking) return;

    if (isMockMode()) {
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
      return;
    }

    const user = get().currentUser;
    if (!user) return;
    await bookingService.updateBookingStatus(bookingId, "distress");
    await moderationService.createSafetyEvent(user.id, "safe_word", bookingId);
    await moderationService.createDistressAlert(user.id, bookingId);
    const alerts = await moderationService.getDistressAlerts();
    const bookings = await bookingService.getBookings(user.id);
    set((state) => ({
      bookings,
      distressAlerts: alerts,
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

  updateSafeWord: async (word) => {
    if (isMockMode()) {
      set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, safeWord: word } : null
      }));
      return;
    }
    const user = get().currentUser;
    if (!user) return;
    await profileService.updateProfile(user.id, { safeWord: word } as any);
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

  triggerPanicButton: async () => {
    const now = new Date().toISOString();
    const activeBooking = get().bookings.find(b => b.status === "active" || b.status === "approved");

    if (isMockMode()) {
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
      return;
    }

    const user = get().currentUser;
    if (!user) return;
    if (activeBooking) {
      await bookingService.updateBookingStatus(activeBooking.id, "distress");
      await moderationService.createDistressAlert(user.id, activeBooking.id);
    }
    await moderationService.createSafetyEvent(user.id, "panic", activeBooking?.id);
    const bookings = user ? await bookingService.getBookings(user.id) : get().bookings;
    const alerts = await moderationService.getDistressAlerts();
    set((state) => ({
      bookings,
      distressAlerts: alerts,
      notifications: [{
        id: `not-${Date.now()}`,
        title: "Panic Alert Sent",
        message: "Your emergency alert has been sent. Admin and your trusted contacts have been notified.",
        type: "panic",
        referenceId: activeBooking?.id || "none",
        isRead: false,
        createdAt: now
      },       ...state.notifications]
    }));
  },
  cancelPanic: () => {
    set({ panicModalState: { show: false, countingDown: false, countdownValue: 5 } });
  },
  setPanicModalState: (partial) => {
    set((state) => ({ panicModalState: { ...state.panicModalState, ...partial } }));
  },

  submitRating: async (bookingId, toUserId, score, review) => {
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

  setRequireVerifiedClients: async (val) => {
    if (isMockMode()) {
      set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, requireVerifiedClients: val } : null
      }));
      return;
    }
    const user = get().currentUser;
    if (!user) return;
    await profileService.updateProfile(user.id, { requireVerifiedClients: val } as any);
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, requireVerifiedClients: val } : null
    }));
  },
  setVerificationStatus: (status) => {
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, verificationStatus: status } : null
    }));
  },

  initFromSupabase: async () => {
    if (isMockMode()) return;
    try {
      const { session } = await authService.getSession();
      if (!session?.user) return;

      const profile = await profileService.getCurrentUserProfile(session.user.id);
      if (!profile) return;

      set({
        currentUser: profile as any,
        ageConfirmed: true,
      });

      const [companions, conversations, bookings, notifications] = await Promise.all([
        profileService.getProfiles({ role: "companion" }),
        chatService.getConversations(session.user.id),
        bookingService.getBookings(session.user.id),
        notificationService.getNotifications(session.user.id),
      ]);

      set({ companions, conversations, bookings, notifications });
    } catch (err) {
      console.error("[Supabase] initFromSupabase error:", err);
    }
  },
}));
