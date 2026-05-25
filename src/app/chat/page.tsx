"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Send,
  Phone,
  Image as ImageIcon,
  ShieldAlert,
  CheckCircle,
  MoreVertical,
  Check,
  ChevronLeft,
  Compass,
  Mic,
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

  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeConvParam) {
      setSelectedConvId(activeConvParam);
    } else if (conversations.length > 0) {
      setSelectedConvId(conversations[0].id);
    }
  }, [activeConvParam, conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedConvId]);

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
    sendMessage(selectedConvId, inputText.trim());
    setInputText("");
  };

  const quickEmojis = ["🥂", "✨", "🖤", "🍷", "📍", "👋"];

  return (
    <div className="flex-1 flex bg-velvet-black min-h-[calc(100vh-4rem)] z-10 relative">
      <div className={`w-full md:w-80 border-r border-white/5 flex-col flex ${selectedConvId ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b border-white/5 bg-velvet-black/50">
          <h2 className="text-lg font-display font-bold text-white">Messages</h2>
          <p className="text-[11px] text-white/40 mt-0.5 uppercase tracking-wider font-semibold">Your Connections</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {conversations.map((conv) => {
            const companion = companions.find(c => c.id === conv.companionId);
            if (!companion) return null;
            const active = conv.id === selectedConvId;
            return (
              <GlassCard
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`p-3.5 border ${active ? "border-white/20 bg-white/5" : "border-transparent bg-white/[0.01]"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                      <img src={companion.avatarUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    {companion.onlineStatus && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-velvet-black" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1">
                        {companion.displayName}
                        {companion.isVerified && <CheckCircle size={12} className="text-velvet-gold" />}
                      </h4>
                      <span className="text-[9px] text-white/40">
                        {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/40 truncate leading-relaxed">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-velvet-gold text-[9px] font-bold text-white flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      <div className={`flex-1 flex-col flex bg-velvet-black/40 ${!selectedConvId ? "hidden md:flex items-center justify-center text-center p-6" : "flex"}`}>
        {selectedConvId && activeCompanion ? (
          <>
            <div className="px-6 py-3.5 border-b border-white/5 bg-velvet-black/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConvId(null)}
                  className="p-1 text-white/40 hover:text-white md:hidden"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10">
                  <img src={activeCompanion.avatarUrl} alt="" className="w-full h-full object-cover" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1">
                    {activeCompanion.displayName}
                    {activeCompanion.isVerified && <CheckCircle size={13} className="text-velvet-gold" />}
                  </h3>
                  <span className="text-[10px] text-white/40">
                    {activeCompanion.onlineStatus ? "Online" : "Away"} • {activeCompanion.lastActive}
                  </span>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                >
                  <MoreVertical size={16} />
                </button>

                <AnimatePresence>
                  {showOptions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      className="absolute right-0 mt-2 w-40 glass-panel border-white/10 rounded-xl p-1 shadow-lg z-50 text-xs"
                    >
                      <Link href={`/profile/${activeCompanion.id}`} className="block px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg">
                        View Profile
                      </Link>
                      <button
                        onClick={() => { alert("Report submitted."); setShowOptions(false); }}
                        className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      >
                        Block & Report
                      </button>
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
                    <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? "bg-white/10 text-white rounded-br-none"
                        : "bg-white/5 border border-white/5 text-white/70 rounded-bl-none"
                    }`}>
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[9px] text-white/40 font-medium">
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <Check size={10} className="text-velvet-gold" />}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="self-start flex flex-col items-start gap-1.5">
                  <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-velvet-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-velvet-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-velvet-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[9px] text-white/40 uppercase tracking-widest font-semibold">{activeCompanion.displayName} is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/5 bg-velvet-black/30 flex flex-col gap-3">
              <div className="flex gap-2">
                {quickEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setInputText(prev => prev + emoji)}
                    className="p-1.5 bg-white/5 border border-white/5 hover:border-white/20 rounded-lg text-sm hover:scale-105 transition-all"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSend} className="flex gap-3">
                <button type="button" className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 text-white/40 hover:text-white rounded-xl transition-all shrink-0">
                  <ImageIcon size={16} />
                </button>

                <button type="button" className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 text-white/40 hover:text-white rounded-xl transition-all shrink-0">
                  <Mic size={16} />
                </button>

                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={`Message ${activeCompanion.displayName}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white/5 rounded-xl border border-white/10 text-white text-xs focus:border-velvet-gold/40 focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="p-3 bg-white/10 hover:bg-white/15 text-white rounded-xl border border-white/10 transition-all shrink-0 hover:scale-105"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <Compass size={40} className="text-white/20 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">Select a Conversation</h3>
            <p className="text-xs text-white/40 mt-1 max-w-xs mx-auto leading-relaxed">
              Open a chat to connect with verified members.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
