"use client";

import { useState } from "react";
import {
  Shield, Lock, Bell, Eye, UserX, ShieldCheck, Smartphone,
  ChevronRight, CheckCircle, Camera, FileText, Plus, Trash2, AlertTriangle, ShieldAlert,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useVelvetStore } from "@/store/useVelvetStore";

export default function Settings() {
  const blockedUserIds = useVelvetStore((state) => state.blockedUserIds);
  const [activeSection, setActiveSection] = useState("privacy");
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

  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button onClick={onClick}
      className={`min-w-[48px] min-h-[28px] rounded-full transition-all relative ${on ? "bg-[#C9A84C]" : "bg-white/[0.07]"}`}>
      <div className={`w-5 h-5 rounded-full bg-white absolute top-1/2 -translate-y-1/2 transition-all ${on ? "left-[24px]" : "left-1"}`} />
    </button>
  );

  return (
    <div className="flex-1 flex flex-col bg-[#0E0E12] min-h-[calc(100vh-4rem)] p-5 md:p-8 relative overflow-hidden">
      <div className="w-full max-w-4xl mx-auto z-10">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-medium text-[#F0EDE6]">Settings</h1>
          <p className="text-[10px] text-[#7A7870] mt-1 uppercase tracking-[0.12em]">Manage your account, privacy, and security.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 flex flex-col gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button key={section.id} onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 p-3 rounded-[100px] text-sm transition-all ${
                    activeSection === section.id ? "bg-[#C9A84C] text-[#0E0E12]" : "text-[#7A7870] hover:text-[#F0EDE6] hover:bg-white/[0.04]"
                  }`}>
                  <Icon size={18} strokeWidth={1.5} /><span>{section.label}</span><ChevronRight size={14} strokeWidth={1.5} className="ml-auto opacity-40" />
                </button>
              );
            })}
          </div>

          <div className="md:col-span-8">
            {activeSection === "privacy" && (
              <GlassCard className="p-6 flex flex-col gap-6">
                <h2 className="text-lg font-display font-medium text-[#F0EDE6]">Privacy & Security</h2>
                <div className="flex items-center justify-between py-3 border-b border-white/[0.07]">
                  <div><p className="text-sm font-medium text-[#F0EDE6]">Online Status</p><p className="text-xs text-[#7A7870] mt-0.5">Show when you're active</p></div>
                  <Toggle on={showOnlineStatus} onClick={() => setShowOnlineStatus(!showOnlineStatus)} />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/[0.07]">
                  <div><p className="text-sm font-medium text-[#F0EDE6]">Show Location</p><p className="text-xs text-[#7A7870] mt-0.5">Display approximate distance</p></div>
                  <Toggle on={showLocation} onClick={() => setShowLocation(!showLocation)} />
                </div>
                <div className="py-3 border-b border-white/[0.07]">
                  <p className="text-sm font-medium text-[#F0EDE6]">Account Security</p>
                  <p className="text-xs text-[#7A7870] mt-1">Two-factor authentication enabled</p>
                  <div className="flex items-center gap-2 mt-2"><CheckCircle size={14} strokeWidth={1.5} className="text-green-400" /><span className="text-xs text-green-400">Verified email</span></div>
                  <div className="flex items-center gap-2 mt-1"><CheckCircle size={14} strokeWidth={1.5} className="text-green-400" /><span className="text-xs text-green-400">Phone verified</span></div>
                </div>
                <div className="py-3">
                  <p className="text-sm font-medium text-[#F0EDE6]">Trusted Contacts</p>
                  <p className="text-xs text-[#7A7870] mt-0.5">Add trusted friends for safety check-ins</p>
                  <button className="mt-3 px-5 py-2 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-xs font-medium transition-all active:scale-[0.97]">Manage Trusted Contacts</button>
                </div>
              </GlassCard>
            )}

            {activeSection === "notifications" && (
              <GlassCard className="p-6 flex flex-col gap-6">
                <h2 className="text-lg font-display font-medium text-[#F0EDE6]">Notification Preferences</h2>
                <div className="flex items-center justify-between py-3 border-b border-white/[0.07]">
                  <div><p className="text-sm font-medium text-[#F0EDE6]">Messages</p><p className="text-xs text-[#7A7870] mt-0.5">New message alerts</p></div>
                  <Toggle on={notifyMessages} onClick={() => setNotifyMessages(!notifyMessages)} />
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/[0.07]">
                  <div><p className="text-sm font-medium text-[#F0EDE6]">Bookings</p><p className="text-xs text-[#7A7870] mt-0.5">Booking confirmations & updates</p></div>
                  <Toggle on={notifyBookings} onClick={() => setNotifyBookings(!notifyBookings)} />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div><p className="text-sm font-medium text-[#F0EDE6]">Promotions</p><p className="text-xs text-[#7A7870] mt-0.5">Membership offers & updates</p></div>
                  <Toggle on={notifyPromotions} onClick={() => setNotifyPromotions(!notifyPromotions)} />
                </div>
              </GlassCard>
            )}

            {activeSection === "verification" && (
              <GlassCard className="p-6 flex flex-col gap-6">
                <h2 className="text-lg font-display font-medium text-[#F0EDE6]">Identity Verification</h2>
                <p className="text-xs text-[#7A7870]">Complete verification to unlock full platform access.</p>
                <div className="flex items-center gap-4 p-4 rounded-[18px] bg-[#22222E] border border-white/[0.07]">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#1A1A22] flex items-center justify-center"><Camera size={20} strokeWidth={1.5} className="text-[#C9A84C]" /></div>
                  <div className="flex-1"><p className="text-sm font-medium text-[#F0EDE6]">Selfie Verification</p><p className="text-xs text-[#7A7870] mt-0.5">Verify with a selfie</p></div>
                  <button className="px-5 py-2 bg-[#C9A84C] text-[#0E0E12] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all active:scale-[0.97]">Verify</button>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-[18px] bg-[#22222E] border border-white/[0.07]">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#1A1A22] flex items-center justify-center"><FileText size={20} strokeWidth={1.5} className="text-[#C9A84C]" /></div>
                  <div className="flex-1"><p className="text-sm font-medium text-[#F0EDE6]">ID Verification</p><p className="text-xs text-[#7A7870] mt-0.5">Upload government-issued ID</p></div>
                  <button className="px-5 py-2 bg-[#C9A84C] text-[#0E0E12] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all active:scale-[0.97]">Upload</button>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-[18px] bg-[#22222E] border border-green-500/10">
                  <div className="w-[52px] h-[52px] rounded-full bg-green-500/10 flex items-center justify-center"><Smartphone size={20} strokeWidth={1.5} className="text-green-400" /></div>
                  <div className="flex-1"><p className="text-sm font-medium text-[#F0EDE6]">Phone Verified</p><p className="text-xs text-green-400 mt-0.5">Confirmed</p></div>
                  <CheckCircle size={20} strokeWidth={1.5} className="text-green-400" />
                </div>
              </GlassCard>
            )}

            {activeSection === "blocked" && (
              <GlassCard className="p-6 flex flex-col gap-6">
                <h2 className="text-lg font-display font-medium text-[#F0EDE6]">Blocked Users</h2>
                <p className="text-xs text-[#7A7870]">Blocked profiles will not appear in your feed.</p>
                {blockedUserIds.length === 0 ? (
                  <div className="text-center py-8"><UserX size={32} strokeWidth={1.5} className="text-[#7A7870] mx-auto mb-2" /><p className="text-xs text-[#7A7870]">No blocked users</p></div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {blockedUserIds.map((id) => (
                      <div key={id} className="flex items-center justify-between p-3 rounded-[18px] bg-[#22222E] border border-white/[0.07]">
                        <span className="text-sm text-[#7A7870]">User {id}</span>
                        <button className="text-xs text-[#C9A84C] hover:text-[#F0EDE6] transition-all">Unblock</button>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            )}

            {activeSection === "safety" && (
              <GlassCard className="p-6 flex flex-col gap-6">
                <h2 className="text-lg font-display font-medium text-[#F0EDE6]">Safety Tools</h2>
                <p className="text-xs text-[#7A7870]">Emergency features and safety resources.</p>
                <div className="p-4 rounded-[18px] bg-[#22222E] border border-[rgba(201,168,76,0.2)]">
                  <h3 className="text-sm font-medium text-[#F0EDE6] mb-2">Emergency Contacts</h3>
                  <p className="text-xs text-[#7A7870] mb-3">Set up trusted contacts for emergency notifications.</p>
                  <button className="px-5 py-2 bg-[#C9A84C] text-[#0E0E12] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all active:scale-[0.97]">Configure</button>
                </div>
                <div className="p-4 rounded-[18px] bg-[#22222E] border border-rose-500/10">
                  <h3 className="text-sm font-medium text-[#F0EDE6] mb-2">Safety Check-In</h3>
                  <p className="text-xs text-[#7A7870] mb-3">Send safety check-ins to trusted contacts.</p>
                  <button className="px-5 py-2 bg-rose-600 text-white rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all active:scale-[0.97]">Enable Check-Ins</button>
                </div>
                <div className="p-4 rounded-[18px] bg-[#22222E] border border-white/[0.07]">
                  <h3 className="text-sm font-medium text-[#F0EDE6] mb-2">Report History</h3>
                  <p className="text-xs text-[#7A7870] mb-3">View past reports and resolution status.</p>
                  <button className="px-5 py-2 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all active:scale-[0.97]">View History</button>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
