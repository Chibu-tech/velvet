"use client";

import { useState } from "react";
import {
  Shield,
  Lock,
  Bell,
  Eye,
  UserX,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  CheckCircle,
  Camera,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useVelvetStore } from "@/store/useVelvetStore";

export default function Settings() {
  const currentUser = useVelvetStore((state) => state.currentUser);
  const blockedUserIds = useVelvetStore((state) => state.blockedUserIds);

  const [activeSection, setActiveSection] = useState<string>("privacy");
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyBookings, setNotifyBookings] = useState(true);
  const [notifyPromotions, setNotifyPromotions] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showLocation, setShowLocation] = useState(true);

  const sections = [
    { id: "privacy", label: "Privacy & Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "verification", label: "Identity Verification", icon: ShieldCheck },
    { id: "blocked", label: "Blocked Users", icon: UserX },
    { id: "safety", label: "Safety Tools", icon: Shield },
  ];

  return (
    <div className="flex-1 flex flex-col bg-velvet-black min-h-[calc(100vh-4rem)] p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-velvet-gold/[0.02] rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto z-10">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-white">Settings</h1>
          <p className="text-xs text-white/40 mt-1">Manage your account, privacy, and security.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 flex flex-col gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === section.id
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} />
                  <span>{section.label}</span>
                  <ChevronRight size={14} className="ml-auto text-white/20" />
                </button>
              );
            })}
          </div>

          <div className="md:col-span-8">
            {activeSection === "privacy" && (
              <GlassCard className="p-6 border border-white/5 flex flex-col gap-6">
                <h2 className="text-lg font-bold text-white">Privacy & Security</h2>

                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <p className="text-sm font-medium text-white">Online Status</p>
                    <p className="text-xs text-white/40 mt-0.5">Show when you're active</p>
                  </div>
                  <button
                    onClick={() => setShowOnlineStatus(!showOnlineStatus)}
                    className={`w-10 h-6 rounded-full transition-all relative ${showOnlineStatus ? "bg-velvet-gold" : "bg-white/10"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${showOnlineStatus ? "left-5" : "left-1"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <p className="text-sm font-medium text-white">Show Location</p>
                    <p className="text-xs text-white/40 mt-0.5">Display approximate distance</p>
                  </div>
                  <button
                    onClick={() => setShowLocation(!showLocation)}
                    className={`w-10 h-6 rounded-full transition-all relative ${showLocation ? "bg-velvet-gold" : "bg-white/10"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${showLocation ? "left-5" : "left-1"}`} />
                  </button>
                </div>

                <div className="py-3 border-b border-white/5">
                  <p className="text-sm font-medium text-white">Account Security</p>
                  <p className="text-xs text-white/40 mt-1">Two-factor authentication enabled</p>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-xs text-green-400">Verified email</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-xs text-green-400">Phone verified</span>
                  </div>
                </div>

                <div className="py-3">
                  <p className="text-sm font-medium text-white">Trusted Contacts</p>
                  <p className="text-xs text-white/40 mt-0.5">Add trusted friends for safety check-ins</p>
                  <button className="mt-3 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg text-xs border border-white/5 transition-all">
                    Manage Trusted Contacts
                  </button>
                </div>
              </GlassCard>
            )}

            {activeSection === "notifications" && (
              <GlassCard className="p-6 border border-white/5 flex flex-col gap-6">
                <h2 className="text-lg font-bold text-white">Notification Preferences</h2>

                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <p className="text-sm font-medium text-white">Messages</p>
                    <p className="text-xs text-white/40 mt-0.5">New message alerts</p>
                  </div>
                  <button
                    onClick={() => setNotifyMessages(!notifyMessages)}
                    className={`w-10 h-6 rounded-full transition-all relative ${notifyMessages ? "bg-velvet-gold" : "bg-white/10"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifyMessages ? "left-5" : "left-1"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <p className="text-sm font-medium text-white">Bookings</p>
                    <p className="text-xs text-white/40 mt-0.5">Booking confirmations & updates</p>
                  </div>
                  <button
                    onClick={() => setNotifyBookings(!notifyBookings)}
                    className={`w-10 h-6 rounded-full transition-all relative ${notifyBookings ? "bg-velvet-gold" : "bg-white/10"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifyBookings ? "left-5" : "left-1"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-white">Promotions</p>
                    <p className="text-xs text-white/40 mt-0.5">Membership offers & updates</p>
                  </div>
                  <button
                    onClick={() => setNotifyPromotions(!notifyPromotions)}
                    className={`w-10 h-6 rounded-full transition-all relative ${notifyPromotions ? "bg-velvet-gold" : "bg-white/10"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifyPromotions ? "left-5" : "left-1"}`} />
                  </button>
                </div>
              </GlassCard>
            )}

            {activeSection === "verification" && (
              <GlassCard className="p-6 border border-white/5 flex flex-col gap-6">
                <h2 className="text-lg font-bold text-white">Identity Verification</h2>
                <p className="text-xs text-white/40">Complete verification to unlock full platform access.</p>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-velvet-gold/10 flex items-center justify-center text-velvet-gold">
                    <Camera size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Selfie Verification</p>
                    <p className="text-xs text-white/40 mt-0.5">Verify your identity with a selfie</p>
                  </div>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold transition-all">
                    Verify
                  </button>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-velvet-gold/10 flex items-center justify-center text-velvet-gold">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">ID Verification</p>
                    <p className="text-xs text-white/40 mt-0.5">Upload government-issued ID</p>
                  </div>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold transition-all">
                    Upload
                  </button>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                    <Smartphone size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Phone Verified</p>
                    <p className="text-xs text-green-400 mt-0.5">Confirmed</p>
                  </div>
                  <CheckCircle size={20} className="text-green-400" />
                </div>
              </GlassCard>
            )}

            {activeSection === "blocked" && (
              <GlassCard className="p-6 border border-white/5 flex flex-col gap-6">
                <h2 className="text-lg font-bold text-white">Blocked Users</h2>
                <p className="text-xs text-white/40">Blocked profiles will not appear in your feed.</p>

                {blockedUserIds.length === 0 ? (
                  <div className="text-center py-8">
                    <UserX size={32} className="text-white/20 mx-auto mb-2" />
                    <p className="text-xs text-white/40">No blocked users</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {blockedUserIds.map((id) => (
                      <div key={id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-sm text-white/60">User {id}</span>
                        <button className="text-xs text-velvet-gold hover:text-white transition-all">Unblock</button>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            )}

            {activeSection === "safety" && (
              <GlassCard className="p-6 border border-white/5 flex flex-col gap-6">
                <h2 className="text-lg font-bold text-white">Safety Tools</h2>
                <p className="text-xs text-white/40 mb-2">Emergency features and safety resources.</p>

                <div className="p-4 rounded-xl bg-velvet-gold/5 border border-velvet-gold/10">
                  <h3 className="text-sm font-bold text-white mb-2">Emergency Contacts</h3>
                  <p className="text-xs text-white/40 mb-3">Set up trusted contacts who can be notified in case of emergency during a booking.</p>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold transition-all">
                    Configure
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                  <h3 className="text-sm font-bold text-white mb-2">Safety Check-In</h3>
                  <p className="text-xs text-white/40 mb-3">Send periodic safety check-ins to your trusted contacts during bookings.</p>
                  <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-all">
                    Enable Check-Ins
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h3 className="text-sm font-bold text-white mb-2">Report History</h3>
                  <p className="text-xs text-white/40 mb-3">View your past reports and their resolution status.</p>
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg text-xs border border-white/5 transition-all">
                    View History
                  </button>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
