"use client";

import { useVelvetStore } from "@/store/useVelvetStore";
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Map,
  Check,
  X,
  Ban,
  CheckCircle,
  FileText,
  Activity,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AdminDashboard() {
  const companions = useVelvetStore((state) => state.companions);
  const bookings = useVelvetStore((state) => state.bookings);

  const verificationRequests = useVelvetStore((state) => state.verificationRequests);
  const reportQueue = useVelvetStore((state) => state.reportQueue);

  const approveVerification = useVelvetStore((state) => state.approveVerification);
  const rejectVerification = useVelvetStore((state) => state.rejectVerification);
  const resolveReport = useVelvetStore((state) => state.resolveReport);
  const banUser = useVelvetStore((state) => state.banUser);

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice * 0.15), 0).toFixed(2);
  const activeUsers = companions.length + 42;
  const verifiedCount = companions.filter(c => c.isVerified).length;

  const stats = [
    { label: "Active Members", value: activeUsers, icon: Users, color: "text-white/80" },
    { label: "Verified", value: `${verifiedCount}/${companions.length}`, icon: ShieldCheck, color: "text-velvet-gold" },
    { label: "Reports", value: reportQueue.length, icon: AlertTriangle, color: "text-rose-400" },
    { label: "Revenue (15%)", value: `$${totalRevenue}`, icon: TrendingUp, color: "text-emerald-400" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-velvet-black min-h-[calc(100vh-4rem)] p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-velvet-gold/[0.02] rounded-full blur-[90px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto z-10 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            Admin Dashboard
            <span className="text-xs bg-white/5 text-white/40 border border-white/10 px-2 py-0.5 rounded-full font-semibold">
              Operations
            </span>
          </h1>
          <p className="text-xs text-white/40 mt-1">Verification, moderation, and platform analytics.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={idx} className="p-5 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider block">{stat.label}</span>
                  <span className="text-lg sm:text-xl font-bold font-display text-white mt-1 block">{stat.value}</span>
                </div>
                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0 ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
              Verification Queue
              {verificationRequests.length > 0 && <span className="w-2 h-2 rounded-full bg-velvet-gold" />}
            </h2>

            {verificationRequests.length === 0 ? (
              <GlassCard className="p-8 border border-white/5 text-center">
                <CheckCircle size={32} className="text-velvet-gold mx-auto mb-2" />
                <p className="text-xs text-white/40">Queue is clear.</p>
              </GlassCard>
            ) : (
              <div className="flex flex-col gap-4">
                {verificationRequests.map((req) => (
                  <GlassCard key={req.id} className="p-5 border border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                        <img src={req.avatarUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">@{req.username}</h4>
                        <span className="text-[9px] text-white/40 font-semibold uppercase tracking-wider block mt-0.5">
                          {new Date(req.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 mt-2 sm:mt-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 cursor-pointer" title="Selfie">
                        <img src={req.selfieUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => rejectVerification(req.id)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition-all">
                          <X size={14} />
                        </button>
                        <button onClick={() => approveVerification(req.id)}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all">
                          <Check size={12} />
                          <span>Approve</span>
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold font-display text-white">Reports & Safety</h2>

            {reportQueue.length === 0 ? (
              <GlassCard className="p-8 border border-white/5 text-center">
                <CheckCircle size={32} className="text-velvet-gold mx-auto mb-2" />
                <p className="text-xs text-white/40">No active reports.</p>
              </GlassCard>
            ) : (
              <div className="flex flex-col gap-4">
                {reportQueue.map((rep) => (
                  <GlassCard key={rep.id} className="p-5 border border-white/5 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-rose-400 font-semibold uppercase tracking-widest block">Report</span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{rep.reason}</h4>
                      </div>
                      <span className="text-[9px] text-white/40">
                        {new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                      <span className="font-semibold text-white/40 block mb-0.5">@{rep.reporter} reported @{rep.reportedUser}</span>
                      {rep.details}
                    </p>
                    <div className="flex gap-2 justify-end mt-1">
                      <button onClick={() => resolveReport(rep.id)}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-lg text-xs font-semibold border border-white/5 transition-all">
                        Dismiss
                      </button>
                      <button onClick={() => { banUser(rep.reportedUser); resolveReport(rep.id); }}
                        className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all">
                        <Ban size={12} />
                        <span>Ban User</span>
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
            Activity Overview
            <Activity size={16} className="text-velvet-gold" />
          </h2>

          <div className="w-full h-80 rounded-3xl overflow-hidden border border-white/10 relative glass-panel-glow flex items-center justify-center">
            <div className="absolute inset-0 bg-velvet-black flex items-center justify-center">
              <div className="absolute w-[400px] h-[400px] border border-white/5 rounded-full" />
              <div className="absolute w-[200px] h-[200px] border border-white/5 rounded-full" />
              <div className="absolute w-24 h-24 bg-velvet-gold/10 rounded-full blur-[40px] top-[30%] left-[40%]" />
              <div className="absolute w-32 h-32 bg-white/5 rounded-full blur-[50px] bottom-[25%] right-[35%]" />
              <div className="text-center z-10 max-w-sm p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Analytics</h3>
                <p className="text-[11px] text-white/40 mt-2 leading-relaxed">
                  Real-time platform metrics and activity visualization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
