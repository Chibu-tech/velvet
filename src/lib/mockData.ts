export interface Profile {
  id: string;
  username: string;
  displayName: string;
  role: "customer" | "companion" | "admin";
  avatarUrl: string;
  images: string[];
  bio: string;
  interests: string[];
  languages: string[];
  isVerified: boolean;
  trustScore: number;
  responseRate: number;
  onlineStatus: boolean;
  lastActive: string;
  distanceKm: number;
  pricingHourly: number;
  pricingDaily: number;
  pricingCurrency: string;
  availabilityStatus: "available" | "busy" | "away";
  categories: string[];
  rating: number;
  reviewsCount: number;
}

export const MOCK_COMPANIONS: Profile[] = [
  {
    id: "comp-1",
    username: "seraphina_v",
    displayName: "Seraphina Vance",
    role: "companion",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600"
    ],
    bio: "Curator of luxury nightlife experiences, fine dining guide, and premium social companion for exclusive corporate functions, gallery openings, and high-end VIP networking soirées.",
    interests: ["Fine Dining", "Modern Art", "Jazz Clubs", "VIP Events", "Wine Vintages"],
    languages: ["English", "French", "Italian"],
    isVerified: true,
    trustScore: 98,
    responseRate: 100,
    onlineStatus: true,
    lastActive: "Active now",
    distanceKm: 2.4,
    pricingHourly: 150,
    pricingDaily: 1200,
    pricingCurrency: "USD",
    availabilityStatus: "available",
    categories: ["Nightlife Hosting", "Social Meetups", "Creator Bookings"],
    rating: 4.9,
    reviewsCount: 34
  },
  {
    id: "comp-2",
    username: "alexander_r",
    displayName: "Alexander Thorne",
    role: "companion",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600"
    ],
    bio: "Classical pianist and concierge companion. Fluent in conversational diplomatic hosting, luxury real estate networking, and high-stakes social environments.",
    interests: ["Classical Piano", "Yachting", "Luxury Watches", "Gala Events"],
    languages: ["English", "German", "Russian"],
    isVerified: true,
    trustScore: 100,
    responseRate: 95,
    onlineStatus: true,
    lastActive: "Active now",
    distanceKm: 5.1,
    pricingHourly: 200,
    pricingDaily: 1500,
    pricingCurrency: "USD",
    availabilityStatus: "available",
    categories: ["Corporate Networking", "Social Meetups"],
    rating: 5.0,
    reviewsCount: 18
  },
  {
    id: "comp-3",
    username: "valeria_lux",
    displayName: "Valeria Sterling",
    role: "companion",
    avatarUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600"
    ],
    bio: "High fashion model and social catalyst. Offering elegant companionship for cocktail events, private gallery previews, and premium travel hosting worldwide.",
    interests: ["Haute Couture", "Polo Matches", "Contemporary Dance", "Archipelago Travel"],
    languages: ["English", "Spanish", "Portuguese"],
    isVerified: true,
    trustScore: 97,
    responseRate: 98,
    onlineStatus: false,
    lastActive: "Active 15m ago",
    distanceKm: 8.7,
    pricingHourly: 180,
    pricingDaily: 1400,
    pricingCurrency: "USD",
    availabilityStatus: "busy",
    categories: ["Nightlife Hosting", "Creator Bookings"],
    rating: 4.8,
    reviewsCount: 29
  },
  {
    id: "comp-4",
    username: "marcus_k",
    displayName: "Marcus Kincaid",
    role: "companion",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600"
    ],
    bio: "Sommelier, investor, and premium travel escort. Specializing in arranging curated yacht tours, private country club socials, and high-end restaurant journeys.",
    interests: ["Wine Sommelier", "Golfing", "Supercars", "Venture Capital"],
    languages: ["English", "Mandarin"],
    isVerified: false,
    trustScore: 92,
    responseRate: 92,
    onlineStatus: true,
    lastActive: "Active now",
    distanceKm: 12.3,
    pricingHourly: 250,
    pricingDaily: 2000,
    pricingCurrency: "USD",
    availabilityStatus: "available",
    categories: ["Corporate Networking", "Companionship"],
    rating: 4.7,
    reviewsCount: 12
  }
];

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  companionId: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    companionId: "comp-1",
    lastMessage: "I would be delighted to host you at the gallery opening this Saturday.",
    updatedAt: "2026-05-21T14:30:00Z",
    unreadCount: 2
  },
  {
    id: "conv-2",
    companionId: "comp-2",
    lastMessage: "Shall we finalize the booking itinerary for the cocktail gala?",
    updatedAt: "2026-05-20T18:15:00Z",
    unreadCount: 0
  }
];

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "conv-1": [
    {
      id: "msg-1-1",
      senderId: "user",
      content: "Hello Seraphina! I saw your profile and loved your focus on fine dining and art events.",
      createdAt: "2026-05-21T14:10:00Z",
      isRead: true
    },
    {
      id: "msg-1-2",
      senderId: "comp-1",
      content: "Thank you so much! I aim to curate unique, memory-rich experiences.",
      createdAt: "2026-05-21T14:15:00Z",
      isRead: true
    },
    {
      id: "msg-1-3",
      senderId: "user",
      content: "Are you available for the contemporary art gala this weekend?",
      createdAt: "2026-05-21T14:22:00Z",
      isRead: true
    },
    {
      id: "msg-1-4",
      senderId: "comp-1",
      content: "I would be delighted to host you at the gallery opening this Saturday.",
      createdAt: "2026-05-21T14:30:00Z",
      isRead: false
    }
  ],
  "conv-2": [
    {
      id: "msg-2-1",
      senderId: "user",
      content: "Hi Alexander, are you free to join our company networking panel?",
      createdAt: "2026-05-20T17:45:00Z",
      isRead: true
    },
    {
      id: "msg-2-2",
      senderId: "comp-2",
      content: "Hello there. Absolutely, I have structured openings in my scheduling block.",
      createdAt: "2026-05-20T18:00:00Z",
      isRead: true
    },
    {
      id: "msg-2-3",
      senderId: "comp-2",
      content: "Shall we finalize the booking itinerary for the cocktail gala?",
      createdAt: "2026-05-20T18:15:00Z",
      isRead: true
    }
  ]
};

export interface Booking {
  id: string;
  customerId: string;
  companionId: string;
  status: "pending" | "approved" | "declined" | "cancelled" | "completed";
  scheduledAt: string;
  durationHours: number;
  totalPrice: number;
  currency: string;
  specialRequests?: string;
  createdAt: string;
}

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "book-1",
    customerId: "user-1",
    companionId: "comp-1",
    status: "approved",
    scheduledAt: "2026-05-23T19:00:00Z",
    durationHours: 4,
    totalPrice: 600,
    currency: "USD",
    specialRequests: "Arriving in formal dress. Let's start with cocktails at The Ritz.",
    createdAt: "2026-05-21T10:00:00Z"
  },
  {
    id: "book-2",
    customerId: "user-1",
    companionId: "comp-3",
    status: "pending",
    scheduledAt: "2026-05-27T14:00:00Z",
    durationHours: 6,
    totalPrice: 1080,
    currency: "USD",
    specialRequests: "Private polo match escort. Casual premium outfits.",
    createdAt: "2026-05-21T12:30:00Z"
  }
];

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "message" | "booking_request" | "booking_approved" | "boost_expires";
  referenceId: string;
  isRead: boolean;
  createdAt: string;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "not-1",
    title: "New Booking Approved",
    message: "Seraphina Vance approved your companionship request for The Ritz Cocktails.",
    type: "booking_approved",
    referenceId: "book-1",
    isRead: false,
    createdAt: "2026-05-21T10:05:00Z"
  },
  {
    id: "not-2",
    title: "Unread Message",
    message: "Seraphina Vance: I would be delighted to host you at...",
    type: "message",
    referenceId: "conv-1",
    isRead: false,
    createdAt: "2026-05-21T14:30:00Z"
  }
];
