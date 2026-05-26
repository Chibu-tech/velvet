"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Send, Image as ImageIcon, ShieldAlert, CheckCircle,
  MoreVertical, Check, ChevronLeft, Compass, Mic,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVelvetStore } from "@/store/useVelvetStore";
import { GlassCard } from "@/components/ui/GlassCard";

export default function Chat() {
  const searchParams = useSearchParams();
  const activeConvParam = searchParams.get("conv");

  const conversations = useVelvetStore((state) => state.conversations);
  const messages = useVelvetStore((state) => state.messages);
  const companions = useVelvetStore((state) => state.companions);
  const sendMessage = useVelvetStore((state) => state.sendMessage);
  const blockUser = useVelvetStore((state) => state.blockUser);
  const reportUser = useVelvetStore((state) => state.reportUser);

  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [safetyWarning, setSafetyWarning] = useState<string | null>(null);
  const safeWord = useVelvetStore((state) => state.currentUser?.safeWord);
  const triggerPanicButton = useVelvetStore((state) => state.triggerPanicButton);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeConvParam) setSelectedConvId(activeConvParam);
    else if (conversations.length > 0) setSelectedConvId(conversations[0].id);
  }, [activeConvParam, conversations]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, selectedConvId]);

  useEffect(() => {
    if (!selectedConvId) return;
    const msgList = messages[selectedConvId] || [];
    if (msgList.length === 0) return;
    const lastMsg = msgList[msgList.length - 1];
    if (lastMsg.senderId === "user") {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2300);
      return () => clearTimeout(timer);
    }
  }, [messages, selectedConvId]);

  const activeConv = conversations.find(c => c.id === selectedConvId);
  const activeCompanion = companions.find(c => c.id === activeConv?.companionId);
  const activeMessages = selectedConvId ? messages[selectedConvId] || [] : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvId) return;

    const text = inputText.trim();

    if (safeWord && text.toLowerCase().includes(safeWord.toLowerCase())) {
      triggerPanicButton();
      return;
    }

    const phoneRegex = /[\+]?[\d\s\-\(\)]{7,}/;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    if (phoneRegex.test(text) || emailRegex.test(text)) {
      setSafetyWarning("Be careful sharing personal contact info. Keep conversations on-platform for your safety.");
      setTimeout(() => setSafetyWarning(null), 5000);
    }

    sendMessage(selectedConvId, text);
    setInputText("");
  };

  const quickEmojis = ["🥂", "✨", "🖤", "🍷", "📍", "👋"];

  return (
    <div className="flex-1 flex bg-[#0E0E12] min-h-[calc(100vh-4rem)] z-10 relative">
      <div className={`w-full md:w-80 border-r border-white/[0.07] flex-col flex ${selectedConvId ? "hidden md:flex" : "flex"}`}>
        <div className="p-5 border-b border-white/[0.07] bg-[#0E0E12]/50">
          <h2 className="text-lg font-display font-medium text-[#F0EDE6]">Messages</h2>
          <p className="text-[10px] text-[#7A7870] mt-0.5 uppercase tracking-[0.12em] font-medium">Your Connections</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {conversations.map((conv) => {
            const companion = companions.find(c => c.id === conv.companionId);
            if (!companion) return null;
            const active = conv.id === selectedConvId;
            return (
              <GlassCard key={conv.id} onClick={() => setSelectedConvId(conv.id)}
                className={`p-3.5 border ${active ? "border-[#80465E] bg-[#22222E]" : "border-transparent bg-transparent"}`}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-[52px] h-[52px] rounded-full overflow-hidden border border-white/[0.07]">
                      <img src={companion.avatarUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    {companion.onlineStatus && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0E0E12]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-xs font-medium text-[#F0EDE6] flex items-center gap-1">
                        {companion.displayName}{companion.isVerified && <CheckCircle size={12} strokeWidth={1.5} className="text-[#80465E]" />}
                      </h4>
                      <span className="text-[9px] text-[#7A7870]">{new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[11px] text-[#7A7870] truncate leading-relaxed">{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && <span className="w-4 h-4 rounded-full bg-[#80465E] text-[9px] font-medium text-[#0E0E12] flex items-center justify-center">{conv.unreadCount}</span>}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <div className={`flex-1 flex-col flex bg-[#0E0E12]/40 ${!selectedConvId ? "hidden md:flex items-center justify-center text-center p-6" : "flex"}`}>
        {selectedConvId && activeCompanion ? (
          <>
            <div className="px-6 py-3.5 border-b border-white/[0.07] bg-[#0E0E12]/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedConvId(null)} className="p-1 text-[#7A7870] hover:text-[#F0EDE6] md:hidden">
                  <ChevronLeft size={20} strokeWidth={1.5} />
                </button>
                <div className="w-[52px] h-[52px] rounded-full overflow-hidden border border-white/[0.07]">
                  <img src={activeCompanion.avatarUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#F0EDE6] flex items-center gap-1">
                    {activeCompanion.displayName}{activeCompanion.isVerified && <CheckCircle size={13} strokeWidth={1.5} className="text-[#80465E]" />}
                  </h3>
                  <span className="text-[10px] text-[#7A7870]">{activeCompanion.onlineStatus ? "Online" : "Away"} • {activeCompanion.lastActive}</span>
                </div>
              </div>
              <div className="relative">
                <button onClick={() => setShowOptions(!showOptions)}
                  className="min-w-[48px] min-h-[48px] text-[#7A7870] hover:text-[#F0EDE6] rounded-full hover:bg-white/[0.04] transition-all flex items-center justify-center">
                  <MoreVertical size={16} strokeWidth={1.5} />
                </button>
                <AnimatePresence>
                  {showOptions && (
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute right-0 mt-2 w-40 bg-[#1A1A22] border border-white/[0.07] rounded-[18px] p-1 shadow-lg z-50 text-xs">
                      <Link href={`/profile/${activeCompanion.id}`} className="block px-3 py-2 text-[#7A7870] hover:text-[#F0EDE6] hover:bg-white/[0.04] rounded-[12px]">View Profile</Link>
                      <button onClick={() => { blockUser(activeCompanion.id); reportUser(activeCompanion.id, "Inappropriate behavior"); setShowOptions(false); }}
                        className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-[12px]">Block & Report</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {activeMessages.map((msg) => {
                const isMe = msg.senderId === "user";
                return (
                  <div key={msg.id} className={`flex flex-col max-w-[70%] ${isMe ? "self-end items-end" : "self-start items-start"}`}>
                    <div className={`px-4 py-2.5 rounded-[18px] text-xs leading-relaxed ${
                      isMe ? "bg-[#80465E] text-[#0E0E12]" : "bg-[#22222E] border border-white/[0.07] text-[#F0EDE6]"
                    }`}>{msg.content}</div>
                    <div className="flex items-center gap-1 mt-1 text-[9px] text-[#7A7870] font-medium">
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <Check size={10} strokeWidth={1.5} className="text-[#80465E]" />}
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="self-start flex flex-col items-start gap-1.5">
                  <div className="bg-[#22222E] border border-white/[0.07] px-4 py-3 rounded-[18px] rounded-bl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#80465E] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#80465E] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#80465E] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[9px] text-[#7A7870] uppercase tracking-[0.12em] font-medium">{activeCompanion.displayName} is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {safetyWarning && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mx-4 px-4 py-2.5 rounded-[12px] bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2">
                <ShieldAlert size={14} strokeWidth={1.5} className="text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-yellow-400 leading-relaxed">{safetyWarning}</p>
              </motion.div>
            )}
            <div className="p-4 border-t border-white/[0.07] bg-[#0E0E12]/30 flex flex-col gap-3">
              <div className="flex gap-2">
                {quickEmojis.map((emoji) => (
                  <button key={emoji} onClick={() => setInputText(prev => prev + emoji)}
                    className="min-w-[32px] min-h-[32px] bg-[#22222E] border border-white/[0.07] hover:border-white/20 rounded-full text-sm transition-all"> {emoji} </button>
                ))}
              </div>
              <form onSubmit={handleSend} className="flex gap-3">
                <button type="button"
                  className="min-w-[48px] min-h-[48px] bg-[#22222E] border border-white/[0.07] text-[#7A7870] hover:text-[#F0EDE6] rounded-full transition-all flex items-center justify-center active:scale-[0.97]">
                  <ImageIcon size={16} strokeWidth={1.5} />
                </button>
                <button type="button"
                  className="min-w-[48px] min-h-[48px] bg-[#22222E] border border-white/[0.07] text-[#7A7870] hover:text-[#F0EDE6] rounded-full transition-all flex items-center justify-center active:scale-[0.97]">
                  <Mic size={16} strokeWidth={1.5} />
                </button>
                <div className="relative flex-1">
                  <input type="text" placeholder={`Message ${activeCompanion.displayName}...`} value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-[#22222E] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-xs placeholder-[#5A5858] focus:border-[#80465E] focus:outline-none transition-all" />
                </div>
                <button type="submit"
                  className="min-w-[48px] min-h-[48px] bg-[#80465E] text-[#0E0E12] rounded-full transition-all flex items-center justify-center active:scale-[0.97]">
                  <Send size={16} strokeWidth={1.5} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <Compass size={40} strokeWidth={1.5} className="text-[#7A7870] mx-auto mb-3" />
            <h3 className="text-lg font-display font-medium text-[#F0EDE6]">Select a Conversation</h3>
            <p className="text-xs text-[#7A7870] mt-1 max-w-xs mx-auto">Open a chat to connect with verified members.</p>
          </div>
        )}
      </div>
    </div>
  );
}
