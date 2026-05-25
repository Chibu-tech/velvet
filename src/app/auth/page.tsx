"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, Phone, ArrowRight, UserCheck, Sparkles } from "lucide-react";
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
    if (!email || !password) {
      setError("Please fill in all credentials.");
      return;
    }
    setError("");

    setCurrentUser({
      id: "user-1",
      username: email.split("@")[0] || "velvet_user",
      displayName: "Guest Member",
      role: "customer",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      onboarded: false,
      tier: "free",
      credits: 50
    });

    router.push("/onboarding");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Credentials required.");
      return;
    }
    setError("");

    setCurrentUser({
      id: `user-${Date.now()}`,
      username: email.split("@")[0] || "member",
      displayName: "New Member",
      role: role,
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      onboarded: false,
      tier: "free",
      credits: 50
    });

    router.push("/onboarding");
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError("");
    setOtpSent(true);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== "1234") {
      setError("Invalid code. Try '1234' for demo.");
      return;
    }

    setCurrentUser({
      id: "user-1",
      username: "phone_guest",
      displayName: "Julian Sterling",
      role: "customer",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
      onboarded: true,
      tier: "free",
      credits: 50
    });

    router.push("/discover");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-velvet-black min-h-[calc(100vh-4rem)] relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-velvet-gold/[0.03] rounded-full blur-[90px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <GlassCard className="p-8 border border-white/5">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold tracking-tight text-white mb-2">VELVET</h1>
            <p className="text-xs text-white/40 font-semibold tracking-[0.15em] uppercase">Premium Networking Circle</p>
          </div>

          <div className="flex bg-white/5 border border-white/5 p-1 rounded-xl mb-6 text-sm">
            {(["signin", "signup", "otp"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setMode(t); setError(""); }}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  mode === t
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {t === "signin" ? "Sign In" : t === "signup" ? "Join" : "OTP"}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {mode === "signin" && (
              <motion.form
                key="signin"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSignIn}
                className="flex flex-col gap-4"
              >
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:border-velvet-gold/40 focus:outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:border-velvet-gold/40 focus:outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] border border-white/5"
                >
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-velvet-black px-4 text-white/30">or continue with</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-xs text-white/50 hover:text-white/70 transition-all">
                    Google
                  </button>
                  <button type="button" className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-xs text-white/50 hover:text-white/70 transition-all">
                    Apple
                  </button>
                </div>
              </motion.form>
            )}

            {mode === "signup" && (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSignUp}
                className="flex flex-col gap-4"
              >
                <div className="flex gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    className={`flex-1 py-2.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      role === "customer"
                        ? "bg-white/10 border-white/20 text-white"
                        : "border-white/10 bg-transparent text-white/40 hover:text-white/70"
                    }`}
                  >
                    <UserCheck size={14} />
                    <span>Member</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("companion")}
                    className={`flex-1 py-2.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      role === "companion"
                        ? "bg-white/10 border-white/20 text-white"
                        : "border-white/10 bg-transparent text-white/40 hover:text-white/70"
                    }`}
                  >
                    <ShieldCheck size={14} />
                    <span>Companion</span>
                  </button>
                </div>

                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:border-velvet-gold/40 focus:outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:border-velvet-gold/40 focus:outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all border border-white/5"
                >
                  <span>Create Account</span>
                  <ArrowRight size={14} />
                </button>

                <p className="text-[10px] text-white/30 text-center leading-relaxed">
                  By joining, you agree to our Terms of Service and Privacy Policy. All members are verified.
                </p>
              </motion.form>
            )}

            {mode === "otp" && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}
                className="flex flex-col gap-4"
              >
                {!otpSent ? (
                  <>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:border-velvet-gold/40 focus:outline-none transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 border border-white/5 transition-all"
                    >
                      <span>Send Verification Code</span>
                      <ArrowRight size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="text"
                        placeholder="Enter 4-digit code"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 rounded-xl border border-white/10 text-white text-sm focus:border-velvet-gold/40 focus:outline-none transition-all text-center tracking-[0.5em] font-mono text-lg"
                      />
                    </div>
                    <p className="text-[10px] text-white/30 text-center">
                      Use code <span className="text-velvet-gold">1234</span> for demo
                    </p>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 border border-white/5 transition-all"
                    >
                      <span>Verify</span>
                      <ArrowRight size={14} />
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
