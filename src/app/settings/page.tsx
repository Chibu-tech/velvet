"use client";

import { useState } from "react";
import {
  Shield, Lock, Bell, Eye, UserX, ShieldCheck, Smartphone,
  ChevronRight, CheckCircle, Camera, FileText, Plus, Trash2,
  MapPin, AlertTriangle, Star, Phone, Mail, Heart, Users,
  Key,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { CompletenessProgress } from "@/components/ui/CompletenessProgress";
import { useVelvetStore } from "@/store/useVelvetStore";

export default function Settings() {
  const currentUser = useVelvetStore((state) => state.currentUser);
  const blockedUserIds = useVelvetStore((state) => state.blockedUserIds);
  const emergencyContacts = useVelvetStore((state) => state.emergencyContacts);
  const addEmergencyContact = useVelvetStore((state) => state.addEmergencyContact);
  const removeEmergencyContact = useVelvetStore((state) => state.removeEmergencyContact);
  const updateSafeWord = useVelvetStore((state) => state.updateSafeWord);
  const setRequireVerifiedClients = useVelvetStore((state) => state.setRequireVerifiedClients);
  const liveLocationSharing = useVelvetStore((state) => state.liveLocationSharing);
  const startLocationSharing = useVelvetStore((state) => state.startLocationSharing);
  const stopLocationSharing = useVelvetStore((state) => state.stopLocationSharing);

  const [activeSection, setActiveSection] = useState("privacy");
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyBookings, setNotifyBookings] = useState(true);
  const [notifyPromotions, setNotifyPromotions] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [safeWord, setSafeWord] = useState(currentUser?.safeWord || "");
  const [safeWordSaved, setSafeWordSaved] = useState(false);

  const [newContact, setNewContact] = useState({ name: "", phone: "", email: "", relationship: "" });
  const [showAddContact, setShowAddContact] = useState(false);

  const sections = [
    { id: "privacy", label: "Privacy & Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "verification", label: "Identity Verification", icon: ShieldCheck },
    { id: "safety", label: "Safety Tools", icon: Shield },
    { id: "blocked", label: "Blocked Users", icon: UserX },
    { id: "completeness", label: "Profile Health", icon: Star },
  ];

  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button onClick={onClick}
      className={`min-w-[48px] min-h-[28px] rounded-full transition-all relative ${on ? "bg-[#C9A84C]" : "bg-white/[0.07]"}`}>
      <div className={`w-5 h-5 rounded-full bg-white absolute top-1/2 -translate-y-1/2 transition-all ${on ? "left-[24px]" : "left-1"}`} />
    </button>
  );

  const handleSaveSafeWord = () => {
    updateSafeWord(safeWord);
    setSafeWordSaved(true);
    setTimeout(() => setSafeWordSaved(false), 2000);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;
    addEmergencyContact(newContact);
    setNewContact({ name: "", phone: "", email: "", relationship: "" });
    setShowAddContact(false);
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
                <div className="flex items-center justify-between py-3 border-b border-white/[0.07]">
                  <div><p className="text-sm font-medium text-[#F0EDE6]">Require Verified Clients</p><p className="text-xs text-[#7A7870] mt-0.5">Only accept bookings from verified users</p></div>
                  <Toggle on={currentUser?.requireVerifiedClients || false} onClick={() => setRequireVerifiedClients(!currentUser?.requireVerifiedClients)} />
                </div>
                <div className="py-3 border-b border-white/[0.07]">
                  <p className="text-sm font-medium text-[#F0EDE6]">Account Security</p>
                  <p className="text-xs text-[#7A7870] mt-1">Two-factor authentication enabled</p>
                  <div className="flex items-center gap-2 mt-2"><CheckCircle size={14} strokeWidth={1.5} className="text-green-400" /><span className="text-xs text-green-400">Verified email</span></div>
                  <div className="flex items-center gap-2 mt-1"><CheckCircle size={14} strokeWidth={1.5} className="text-green-400" /><span className="text-xs text-green-400">Phone verified</span></div>
                </div>
                <div className="py-3">
                  <p className="text-sm font-medium text-[#F0EDE6]">Safe Word</p>
                  <p className="text-xs text-[#7A7870] mt-0.5">A secret word you can say to discreetly signal distress</p>
                  <div className="flex gap-2 mt-2">
                    <input type="text" value={safeWord}
                      onChange={(e) => setSafeWord(e.target.value)}
                      placeholder="Enter a safe word..."
                      className="flex-1 px-4 py-2.5 bg-[#22222E] border border-white/[0.1] text-[#F0EDE6] rounded-[100px] text-sm placeholder-[#5A5858] focus:border-[#C9A84C] focus:outline-none" />
                    <button onClick={handleSaveSafeWord}
                      className="px-5 py-2.5 bg-[#C9A84C] text-[#0E0E12] rounded-[100px] text-xs font-medium transition-all active:scale-[0.97]">
                      {safeWordSaved ? "Saved" : "Save"}
                    </button>
                  </div>
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
                  <div><p className="text-sm font-medium text-[#F0EDE6]">Safety Alerts</p><p className="text-xs text-[#7A7870] mt-0.5">Check-in reminders & distress notifications</p></div>
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
                <p className="text-xs text-[#7A7870]">Complete verification to unlock full platform access and book with providers who require verified clients.</p>

                {currentUser?.verificationStatus === "verified" ? (
                  <div className="p-4 rounded-[18px] bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                    <ShieldCheck size={24} strokeWidth={1.5} className="text-emerald-400" />
                    <div><p className="text-sm font-medium text-emerald-400">Verified</p><p className="text-xs text-[#7A7870]">Your identity has been verified</p></div>
                  </div>
                ) : currentUser?.verificationStatus === "pending" ? (
                  <div className="p-4 rounded-[18px] bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-3">
                    <AlertTriangle size={24} strokeWidth={1.5} className="text-yellow-400" />
                    <div><p className="text-sm font-medium text-yellow-400">Verification Pending</p><p className="text-xs text-[#7A7870]">Your documents are being reviewed</p></div>
                  </div>
                ) : null}

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

            {activeSection === "safety" && (
              <GlassCard className="p-6 flex flex-col gap-6">
                <h2 className="text-lg font-display font-medium text-[#F0EDE6]">Safety Tools</h2>
                <p className="text-xs text-[#7A7870]">Emergency features, trusted contacts, and safety resources.</p>

                <div className="p-4 rounded-[18px] bg-[#22222E] border border-white/[0.07]">
                  <h3 className="text-sm font-medium text-[#F0EDE6] mb-3 flex items-center gap-2"><Users size={14} strokeWidth={1.5} />Emergency Contacts</h3>
                  <p className="text-xs text-[#7A7870] mb-3">These contacts are notified if you trigger a distress signal or miss a check-out.</p>
                  {emergencyContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
                      <div>
                        <p className="text-sm text-[#F0EDE6]">{contact.name}</p>
                        <div className="flex gap-3 text-[10px] text-[#7A7870] mt-0.5">
                          <span className="flex items-center gap-1"><Phone size={10} strokeWidth={1.5} />{contact.phone}</span>
                          <span className="flex items-center gap-1"><Mail size={10} strokeWidth={1.5} />{contact.email}</span>
                          <span>{contact.relationship}</span>
                        </div>
                      </div>
                      <button onClick={() => removeEmergencyContact(contact.id)}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-full transition-all">
                        <Trash2 size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  ))}
                  {showAddContact ? (
                    <form onSubmit={handleAddContact} className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/[0.07]">
                      <input type="text" placeholder="Name" value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        className="px-4 py-2 bg-[#1A1A22] border border-white/[0.1] text-[#F0EDE6] rounded-[12px] text-sm placeholder-[#5A5858] focus:border-[#C9A84C] focus:outline-none" required />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="tel" placeholder="Phone" value={newContact.phone}
                          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                          className="px-4 py-2 bg-[#1A1A22] border border-white/[0.1] text-[#F0EDE6] rounded-[12px] text-sm placeholder-[#5A5858] focus:border-[#C9A84C] focus:outline-none" required />
                        <input type="email" placeholder="Email" value={newContact.email}
                          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                          className="px-4 py-2 bg-[#1A1A22] border border-white/[0.1] text-[#F0EDE6] rounded-[12px] text-sm placeholder-[#5A5858] focus:border-[#C9A84C] focus:outline-none" />
                      </div>
                      <input type="text" placeholder="Relationship (e.g. Sister, Friend)" value={newContact.relationship}
                        onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                        className="px-4 py-2 bg-[#1A1A22] border border-white/[0.1] text-[#F0EDE6] rounded-[12px] text-sm placeholder-[#5A5858] focus:border-[#C9A84C] focus:outline-none" />
                      <div className="flex gap-2 justify-end mt-1">
                        <button type="button" onClick={() => setShowAddContact(false)}
                          className="px-4 py-2 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-xs transition-all">Cancel</button>
                        <button type="submit"
                          className="px-5 py-2 bg-[#C9A84C] text-[#0E0E12] rounded-[100px] text-xs font-medium transition-all">Add Contact</button>
                      </div>
                    </form>
                  ) : (
                    <button onClick={() => setShowAddContact(true)}
                      className="mt-3 px-5 py-2 border border-dashed border-white/[0.2] text-[#7A7870] hover:text-[#F0EDE6] rounded-[100px] text-xs transition-all flex items-center gap-1.5">
                      <Plus size={12} strokeWidth={1.5} />Add Contact
                    </button>
                  )}
                </div>

                <div className="p-4 rounded-[18px] bg-[#22222E] border border-rose-500/10">
                  <h3 className="text-sm font-medium text-[#F0EDE6] mb-2 flex items-center gap-2"><AlertTriangle size={14} strokeWidth={1.5} />Panic Button</h3>
                  <p className="text-xs text-[#7A7870] mb-3">A discreet panic button is available in the navigation bar. Hold for 1.5 seconds to alert admin and your emergency contacts.</p>
                  <div className="flex items-center gap-2 text-[10px] text-[#7A7870]">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Always visible in bottom-right corner
                  </div>
                </div>

                <div className="p-4 rounded-[18px] bg-[#22222E] border border-white/[0.07]">
                  <h3 className="text-sm font-medium text-[#F0EDE6] mb-2 flex items-center gap-2"><MapPin size={14} strokeWidth={1.5} />Live Location Sharing</h3>
                  <p className="text-xs text-[#7A7870] mb-3">Share your real-time location with emergency contacts during an active booking.</p>
                  {liveLocationSharing?.isActive ? (
                    <button onClick={stopLocationSharing}
                      className="px-5 py-2 bg-rose-600 text-white rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all active:scale-[0.97]">Stop Sharing</button>
                  ) : (
                    <p className="text-[10px] text-[#7A7870]">Location sharing activates during check-in. You can also toggle it from an active booking.</p>
                  )}
                </div>

                <div className="p-4 rounded-[18px] bg-[#22222E] border border-white/[0.07]">
                  <h3 className="text-sm font-medium text-[#F0EDE6] mb-2">Report History</h3>
                  <p className="text-xs text-[#7A7870] mb-3">View past reports and resolution status.</p>
                  <button className="px-5 py-2 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all active:scale-[0.97]">View History</button>
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

            {activeSection === "completeness" && (
              <GlassCard className="p-6 flex flex-col gap-6">
                <h2 className="text-lg font-display font-medium text-[#F0EDE6]">Profile Health</h2>
                <p className="text-xs text-[#7A7870]">Complete your profile to build trust and appear higher in search results.</p>
                <CompletenessProgress />
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
