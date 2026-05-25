"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Phone, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { useVelvetStore } from "@/store/useVelvetStore";

type AuthMode = "signin" | "signup" | "otp";

export default function Auth() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [role, setRole] = useState<"customer" | "companion">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");

  const setCurrentUser = useVelvetStore((state) => state.setCurrentUser);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all credentials."); return; }
    setError("");
    setCurrentUser({
      id: "user-1", username: email.split("@")[0] || "velvet_user", displayName: "Guest Member",
      role: "customer", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      onboarded: false, tier: "free", credits: 50,
      verificationStatus: "unverified", safeWord: "", requireVerifiedClients: false,
    });
    router.push("/onboarding");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Credentials required."); return; }
    setError("");
    setCurrentUser({
      id: `user-${Date.now()}`, username: email.split("@")[0] || "member", displayName: "New Member",
      role: role, avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      onboarded: false, tier: "free", credits: 50,
      verificationStatus: "unverified", safeWord: "", requireVerifiedClients: false,
    });
    router.push("/onboarding");
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) { setError("Please enter a valid phone number."); return; }
    setError(""); setOtpSent(true);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== "1234") { setError("Invalid code. Try '1234' for demo."); return; }
    setCurrentUser({
      id: "user-1", username: "phone_guest", displayName: "Julian Sterling",
      role: "customer", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
      onboarded: true, tier: "free", credits: 50,
      verificationStatus: "unverified", safeWord: "", requireVerifiedClients: false,
    });
    router.push("/discover");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-5 bg-[#0E0E12] min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-md z-10"
      >
        <GlassCard className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-medium tracking-tight text-[#F0EDE6] mb-2">Velvet</h1>
            <p className="text-[10px] text-[#7A7870] font-medium uppercase tracking-[0.12em]">Premium Networking Circle</p>
          </div>

          <div className="flex bg-[#22222E] border border-white/[0.07] p-1 rounded-[100px] mb-6 text-sm">
            {(["signin", "signup", "otp"] as const).map((t) => (
              <button key={t} onClick={() => { setMode(t); setError(""); }}
                className={`flex-1 py-2 rounded-[100px] font-medium transition-all text-[10px] uppercase tracking-[0.12em] ${
                  mode === t ? "bg-[#C9A84C] text-[#0E0E12]" : "text-[#7A7870] hover:text-[#F0EDE6]"
                }`}>
                {t === "signin" ? "Sign In" : t === "signup" ? "Join" : "OTP"}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-[18px] bg-[#22222E] border border-rose-500/20 text-rose-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {mode === "signin" && (
              <motion.form key="signin" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                onSubmit={handleSignIn} className="flex flex-col gap-4">
                <div className="relative">
                  <Mail size={16} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7870]" />
                  <input type="email" placeholder="Email address" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#22222E] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-[#C9A84C] focus:outline-none transition-all" />
                </div>
                <div className="relative">
                  <Lock size={16} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7870]" />
                  <input type="password" placeholder="Password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#22222E] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-[#C9A84C] focus:outline-none transition-all" />
                </div>
                <button type="submit"
                  className="w-full py-3.5 bg-[#C9A84C] text-[#0E0E12] font-medium rounded-[100px] text-sm tracking-[0.04em] transition-all active:scale-[0.97]">
                  <span>Sign in</span>
                </button>
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.07]" /></div>
                  <div className="relative flex justify-center text-xs"><span className="bg-[#0E0E12] px-4 text-[#7A7870]">or continue with</span></div>
                </div>
                <div className="flex gap-3">
                  <button type="button" className="flex-1 py-2.5 bg-transparent border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-xs transition-all active:scale-[0.97]">Google</button>
                  <button type="button" className="flex-1 py-2.5 bg-transparent border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-xs transition-all active:scale-[0.97]">Apple</button>
                </div>
              </motion.form>
            )}

            {mode === "signup" && (
              <motion.form key="signup" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                onSubmit={handleSignUp} className="flex flex-col gap-4">
                <div className="flex gap-3 mb-2">
                  <button type="button" onClick={() => setRole("customer")}
                    className={`flex-1 py-2.5 rounded-[100px] border font-medium text-[10px] uppercase tracking-[0.12em] flex items-center justify-center gap-1.5 transition-all ${
                      role === "customer" ? "bg-[#C9A84C] border-[#C9A84C] text-[#0E0E12]" : "border-white/[0.2] bg-transparent text-[#7A7870] hover:text-[#F0EDE6]"
                    }`}>
                    <UserCheck size={14} strokeWidth={1.5} />Member
                  </button>
                  <button type="button" onClick={() => setRole("companion")}
                    className={`flex-1 py-2.5 rounded-[100px] border font-medium text-[10px] uppercase tracking-[0.12em] flex items-center justify-center gap-1.5 transition-all ${
                      role === "companion" ? "bg-[#C9A84C] border-[#C9A84C] text-[#0E0E12]" : "border-white/[0.2] bg-transparent text-[#7A7870] hover:text-[#F0EDE6]"
                    }`}>
                    <ShieldCheck size={14} strokeWidth={1.5} />Companion
                  </button>
                </div>
                <div className="relative">
                  <Mail size={16} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7870]" />
                  <input type="email" placeholder="Email address" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#22222E] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-[#C9A84C] focus:outline-none transition-all" />
                </div>
                <div className="relative">
                  <Lock size={16} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7870]" />
                  <input type="password" placeholder="Create password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#22222E] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-[#C9A84C] focus:outline-none transition-all" />
                </div>
                <button type="submit"
                  className="w-full py-3.5 bg-[#C9A84C] text-[#0E0E12] font-medium rounded-[100px] text-sm tracking-[0.04em] transition-all active:scale-[0.97]">
                  Create account
                </button>
                <p className="text-[10px] text-[#7A7870] text-center leading-relaxed tracking-[0.12em] uppercase">
                  By joining, you agree to our Terms of Service.
                </p>
              </motion.form>
            )}

            {mode === "otp" && (
              <motion.form key="otp" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="flex flex-col gap-4">
                {!otpSent ? (
                  <>
                    <div className="relative">
                      <Phone size={16} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7870]" />
                      <input type="tel" placeholder="Phone number" value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#22222E] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-[#C9A84C] focus:outline-none transition-all" />
                    </div>
                    <button type="submit"
                      className="w-full py-3.5 bg-[#C9A84C] text-[#0E0E12] font-medium rounded-[100px] text-sm tracking-[0.04em] transition-all active:scale-[0.97]">
                      Send code
                    </button>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <Lock size={16} strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A7870]" />
                      <input type="text" placeholder="Enter 4-digit code" value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-[#22222E] rounded-[12px] border border-white/[0.1] text-[#F0EDE6] text-sm placeholder-[#5A5858] focus:border-[#C9A84C] focus:outline-none transition-all text-center tracking-[0.5em] font-mono text-lg" />
                    </div>
                    <p className="text-[10px] text-[#7A7870] text-center uppercase tracking-[0.12em]">
                      Use code <span className="text-[#C9A84C]">1234</span> for demo
                    </p>
                    <button type="submit"
                      className="w-full py-3.5 bg-[#C9A84C] text-[#0E0E12] font-medium rounded-[100px] text-sm tracking-[0.04em] transition-all active:scale-[0.97]">
                      Verify
                    </button>
                  </>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </div>
  );
}
