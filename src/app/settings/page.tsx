"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield, Lock, Bell, Eye, UserX, ShieldCheck, Smartphone,
  ChevronRight, CheckCircle, Camera, FileText, Plus, Trash2, AlertTriangle, ShieldAlert,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useVelvetStore } from "@/store/useVelvetStore";
import type { EmergencyContact } from "@/lib/mockData";

export default function Settings() {
  const router = useRouter();
  const currentUser = useVelvetStore((state) => state.currentUser);
  const companions = useVelvetStore((state) => state.companions);
  const blockedUserIds = useVelvetStore((state) => state.blockedUserIds);
  const emergencyContacts = useVelvetStore((state) => state.emergencyContacts);
  const updateSafeWord = useVelvetStore((state) => state.updateSafeWord);
  const setVerificationStatus = useVelvetStore((state) => state.setVerificationStatus!);
  const addEmergencyContact = useVelvetStore((state) => state.addEmergencyContact);
  const removeEmergencyContact = useVelvetStore((state) => state.removeEmergencyContact);

  const [activeSection, setActiveSection] = useState("privacy");
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyBookings, setNotifyBookings] = useState(true);
  const [notifyPromotions, setNotifyPromotions] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [safeWord, setLocalSafeWord] = useState(currentUser?.safeWord || "");
  const [safeWordSaved, updateSafeWordSaved] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", email: "", relationship: "" });

  const sections = [
    { id: "privacy", label: "Privacy & Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "verification", label: "Identity Verification", icon: ShieldCheck },
    { id: "blocked", label: "Blocked Users", icon: UserX },
    { id: "safety", label: "Safety Tools", icon: Shield },
  ];

  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button onClick={onClick}
      className={`min-w-[48px] min-h-[28px] rounded-full transition-all relative ${on ? "bg-[#80465E]" : "bg-white/[0.07]"}`}>
      <div className={`w-5 h-5 rounded-full bg-white absolute top-1/2 -translate-y-1/2 transition-all ${on ? "left-[24px]" : "left-1"}`} />
    </button>
  );

  const handleSaveSafeWord = () => {
    const trimmed = safeWord.trim();
    if (trimmed.length < 2) return;
    updateSafeWord(trimmed);
    updateSafeWordSaved(true);
    setTimeout(() => updateSafeWordSaved(false), 2000);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;
    addEmergencyContact(newContact);
    setNewContact({ name: "", phone: "", email: "", relationship: "" });
    setShowAddContact(false);
  };

  const getBlockedUserName = (id: string) => {
    const companion = companions.find(c => c.id === id);
    return companion?.displayName || `User ${id}`;
  };

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
                    activeSection === section.id ? "bg-[#80465E] text-[#0E0E12]" : "text-[#7A7870] hover:text-[#F0EDE6] hover:bg-white/[0.04]"
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
                  <button onClick={() => setActiveSection("safety")}
                    className="mt-3 px-5 py-2 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-xs font-medium transition-all active:scale-[0.97]">Manage Trusted Contacts</button>
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
                <div className="flex items-center justify-between py-3 border-b border-white/[0.07]">
                  <div><p className="text-sm font-medium text-[#F0EDE6]">Safety Alerts</p><p className="text-xs text-[#7A7870] mt-0.5">Check-in reminders & safety notifications</p></div>
                  <Toggle on={true} onClick={() => {}} />
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
                <p className="text-xs text-[#7A7870]">Complete verification to unlock full platform access. Verified users can book with providers who require verified clients.</p>

                {currentUser?.verificationStatus === "verified" ? (
                  <div className="p-4 rounded-[18px] bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                    <CheckCircle size={24} strokeWidth={1.5} className="text-green-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-400">Identity Verified</p>
                      <p className="text-xs text-[#7A7870] mt-0.5">Your identity has been verified. You can book with all providers.</p>
                    </div>
                  </div>
                ) : currentUser?.verificationStatus === "pending" ? (
                  <div className="p-4 rounded-[18px] bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-3">
                    <AlertTriangle size={24} strokeWidth={1.5} className="text-yellow-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-400">Verification Pending</p>
                      <p className="text-xs text-[#7A7870] mt-0.5">Your documents are being reviewed. This usually takes 24 hours.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-[18px] bg-[#22222E] border border-white/[0.07] flex items-center gap-3">
                    <ShieldAlert size={24} strokeWidth={1.5} className="text-[#80465E] shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[#F0EDE6]">Not Verified</p>
                      <p className="text-xs text-[#7A7870] mt-0.5">Verify your identity to unlock all features.</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 p-4 rounded-[18px] bg-[#22222E] border border-white/[0.07]">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#1A1A22] flex items-center justify-center"><Camera size={20} strokeWidth={1.5} className="text-[#80465E]" /></div>
                  <div className="flex-1"><p className="text-sm font-medium text-[#F0EDE6]">Selfie Verification</p><p className="text-xs text-[#7A7870] mt-0.5">Verify with a selfie</p></div>
                  <button onClick={() => setVerificationStatus("pending")}
                    className="px-5 py-2 bg-[#80465E] text-[#0E0E12] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all active:scale-[0.97]">Verify</button>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-[18px] bg-[#22222E] border border-white/[0.07]">
                  <div className="w-[52px] h-[52px] rounded-full bg-[#1A1A22] flex items-center justify-center"><FileText size={20} strokeWidth={1.5} className="text-[#80465E]" /></div>
                  <div className="flex-1"><p className="text-sm font-medium text-[#F0EDE6]">ID Verification</p><p className="text-xs text-[#7A7870] mt-0.5">Upload government-issued ID</p></div>
                  <button onClick={() => setVerificationStatus("pending")}
                    className="px-5 py-2 bg-[#80465E] text-[#0E0E12] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all active:scale-[0.97]">Upload</button>
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
                        <span className="text-sm text-[#7A7870]">{getBlockedUserName(id)}</span>
                        <button onClick={() => router.push("/discover")}
                          className="text-xs text-[#80465E] hover:text-[#F0EDE6] transition-all">Unblock</button>
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

                <div className="p-4 rounded-[18px] bg-[#22222E] border border-[rgba(128,70,94,0.2)]">
                  <h3 className="text-sm font-medium text-[#F0EDE6] mb-2">Safe Word</h3>
                  <p className="text-xs text-[#7A7870] mb-3">If you type this word in a chat, a distress alert will be triggered silently.</p>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Enter a safe word..." value={safeWord}
                      onChange={(e) => setLocalSafeWord(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-[#1A1A22] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-[#80465E] focus:outline-none transition-all" />
                    <button onClick={handleSaveSafeWord}
                      className="px-5 py-2 bg-[#80465E] text-[#0E0E12] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all active:scale-[0.97] whitespace-nowrap">
                      {safeWordSaved ? "Saved" : "Save"}
                    </button>
                  </div>
                  {safeWordSaved && <p className="text-[10px] text-green-400 mt-2">Safe word saved</p>}
                </div>

                <div className="p-4 rounded-[18px] bg-[#22222E] border border-[rgba(128,70,94,0.2)]">
                  <h3 className="text-sm font-medium text-[#F0EDE6] mb-2">Emergency Contacts</h3>
                  <p className="text-xs text-[#7A7870] mb-3">These contacts will be notified if you trigger a distress alert.</p>

                  {emergencyContacts.length > 0 && (
                    <div className="flex flex-col gap-2 mb-4">
                      {emergencyContacts.map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-3 rounded-[12px] bg-[#1A1A22] border border-white/[0.07]">
                          <div>
                            <p className="text-sm font-medium text-[#F0EDE6]">{contact.name}</p>
                            <p className="text-[10px] text-[#7A7870]">{contact.relationship} • {contact.phone}</p>
                          </div>
                          <button onClick={() => removeEmergencyContact(contact.id)}
                            className="p-2 text-[#7A7870] hover:text-rose-400 transition-all">
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddContact ? (
                    <form onSubmit={handleAddContact} className="flex flex-col gap-3">
                      <input type="text" placeholder="Full name" value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#1A1A22] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-[#80465E] focus:outline-none" required />
                      <input type="tel" placeholder="Phone number" value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#1A1A22] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-[#80465E] focus:outline-none" required />
                      <input type="email" placeholder="Email (optional)" value={newContact.email}
                        onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#1A1A22] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-[#80465E] focus:outline-none" />
                      <input type="text" placeholder="Relationship (e.g. Sister, Friend)" value={newContact.relationship}
                        onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#1A1A22] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-[#80465E] focus:outline-none" />
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setShowAddContact(false)}
                          className="flex-1 py-2 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-xs font-medium transition-all active:scale-[0.97]">Cancel</button>
                        <button type="submit"
                          className="flex-1 py-2 bg-[#80465E] text-[#0E0E12] rounded-[100px] text-xs font-medium transition-all active:scale-[0.97]">Add Contact</button>
                      </div>
                    </form>
                  ) : (
                    <button onClick={() => setShowAddContact(true)}
                      className="flex items-center gap-2 px-4 py-2 border border-dashed border-white/[0.2] text-[#7A7870] hover:text-[#F0EDE6] rounded-[100px] text-xs font-medium transition-all w-full justify-center">
                      <Plus size={14} strokeWidth={1.5} /> Add Emergency Contact
                    </button>
                  )}
                </div>

                <div className="p-4 rounded-[18px] bg-[#22222E] border border-rose-500/10">
                  <h3 className="text-sm font-medium text-[#F0EDE6] mb-2">Panic Button</h3>
                  <p className="text-xs text-[#7A7870] mb-3">Long-hold the Shield icon in the sidebar to trigger an emergency alert after a 5-second countdown.</p>
                  <div className="flex items-center gap-3 p-3 rounded-[12px] bg-[#1A1A22] border border-rose-500/20">
                    <AlertTriangle size={16} strokeWidth={1.5} className="text-rose-400 shrink-0" />
                    <p className="text-[10px] text-rose-400 leading-relaxed">This will notify admins and your emergency contacts with your last known location.</p>
                  </div>
                </div>

                <div className="p-4 rounded-[18px] bg-[#22222E] border border-white/[0.07]">
                  <h3 className="text-sm font-medium text-[#F0EDE6] mb-2">Report History</h3>
                  <p className="text-xs text-[#7A7870] mb-3">View past reports and resolution status.</p>
                  <button onClick={() => setActiveSection("blocked")}
                    className="px-5 py-2 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all active:scale-[0.97]">View History</button>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
