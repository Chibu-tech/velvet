"use client";

import { useVelvetStore } from "@/store/useVelvetStore";
import {
  Users, ShieldCheck, AlertTriangle, TrendingUp, Map,
  Check, X, Ban, CheckCircle, Activity,
} from "lucide-react";
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
    { label: "Active Members", value: activeUsers, icon: Users, color: "text-[#F0EDE6]" },
    { label: "Verified", value: `${verifiedCount}/${companions.length}`, icon: ShieldCheck, color: "text-[#C9A84C]" },
    { label: "Reports", value: reportQueue.length, icon: AlertTriangle, color: "text-rose-400" },
    { label: "Revenue (15%)", value: `$${totalRevenue}`, icon: TrendingUp, color: "text-emerald-400" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#0E0E12] min-h-[calc(100vh-4rem)] p-5 md:p-8 relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto z-10 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-display font-medium text-[#F0EDE6] flex items-center gap-2">
            Admin Dashboard<span className="text-[10px] bg-[#22222E] text-[#7A7870] border border-white/[0.07] px-2 py-0.5 rounded-[100px] uppercase tracking-[0.12em] font-medium">Operations</span>
          </h1>
          <p className="text-[10px] text-[#7A7870] mt-1 uppercase tracking-[0.12em]">Verification, moderation, and platform analytics.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={idx} className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#7A7870] font-medium uppercase tracking-[0.12em] block">{stat.label}</span>
                  <span className="text-lg sm:text-xl font-display font-medium text-[#F0EDE6] mt-1 block">{stat.value}</span>
                </div>
                <div className={`p-2.5 rounded-full bg-[#22222E] border border-white/[0.07] shrink-0 ${stat.color}`}>
                  <Icon size={18} strokeWidth={1.5} />
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 flex flex-col gap-4">
            <h2 className="text-lg font-display font-medium text-[#F0EDE6] flex items-center gap-2">
              Verification Queue{verificationRequests.length > 0 && <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />}
            </h2>
            {verificationRequests.length === 0 ? (
              <GlassCard className="p-8 text-center"><CheckCircle size={32} strokeWidth={1.5} className="text-[#C9A84C] mx-auto mb-2" /><p className="text-xs text-[#7A7870]">Queue is clear.</p></GlassCard>
            ) : (
              <div className="flex flex-col gap-4">
                {verificationRequests.map((req) => (
                  <GlassCard key={req.id} className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-[52px] h-[52px] rounded-full overflow-hidden border border-white/[0.07] shrink-0">
                        <img src={req.avatarUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[#F0EDE6]">@{req.username}</h4>
                        <span className="text-[9px] text-[#7A7870] uppercase tracking-[0.12em] block mt-0.5">{new Date(req.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/[0.07] pt-3 sm:pt-0 mt-2 sm:mt-0">
                      <div className="w-[52px] h-[52px] rounded-full overflow-hidden border border-white/[0.07] shrink-0 cursor-pointer" title="Selfie">
                        <img src={req.selfieUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => rejectVerification(req.id)}
                          className="min-w-[48px] min-h-[48px] border border-rose-500/20 text-rose-400 rounded-full transition-all flex items-center justify-center active:scale-[0.97] hover:bg-rose-500/10">
                          <X size={14} strokeWidth={1.5} />
                        </button>
                        <button onClick={() => approveVerification(req.id)}
                          className="px-6 py-2 bg-[#C9A84C] text-[#0E0E12] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all active:scale-[0.97]">
                          <Check size={12} strokeWidth={1.5} className="inline mr-1" />Approve
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 flex flex-col gap-4">
            <h2 className="text-lg font-display font-medium text-[#F0EDE6]">Reports & Safety</h2>
            {reportQueue.length === 0 ? (
              <GlassCard className="p-8 text-center"><CheckCircle size={32} strokeWidth={1.5} className="text-[#C9A84C] mx-auto mb-2" /><p className="text-xs text-[#7A7870]">No active reports.</p></GlassCard>
            ) : (
              <div className="flex flex-col gap-4">
                {reportQueue.map((rep) => (
                  <GlassCard key={rep.id} className="p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] text-rose-400 font-medium uppercase tracking-[0.12em] block">Report</span>
                        <h4 className="text-sm font-medium text-[#F0EDE6] mt-0.5">{rep.reason}</h4>
                      </div>
                      <span className="text-[9px] text-[#7A7870]">{new Date(rep.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-[#7A7870] leading-relaxed bg-[#22222E] border border-white/[0.07] p-3 rounded-[18px]">
                      <span className="font-medium text-[#F0EDE6] block mb-0.5">@{rep.reporter} reported @{rep.reportedUser}</span>
                      {rep.details}
                    </p>
                    <div className="flex gap-2 justify-end mt-1">
                      <button onClick={() => resolveReport(rep.id)}
                        className="px-5 py-2 border border-white/[0.2] text-[#F0EDE6] rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all active:scale-[0.97]">Dismiss</button>
                      <button onClick={() => { banUser(rep.reportedUser); resolveReport(rep.id); }}
                        className="px-5 py-2 bg-rose-600 text-white rounded-[100px] text-[10px] uppercase tracking-[0.12em] font-medium transition-all active:scale-[0.97] flex items-center gap-1.5">
                        <Ban size={12} strokeWidth={1.5} />Ban User</button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-lg font-display font-medium text-[#F0EDE6] mb-4 flex items-center gap-2">
            <Activity size={16} strokeWidth={1.5} className="text-[#C9A84C]" />Activity Overview
          </h2>
          <div className="w-full h-80 rounded-[18px] overflow-hidden border border-white/[0.07] relative bg-[#0E0E12] flex items-center justify-center">
            <div className="absolute w-[400px] h-[400px] border border-white/[0.07] rounded-full" />
            <div className="absolute w-[200px] h-[200px] border border-white/[0.07] rounded-full" />
            <div className="absolute w-24 h-24 bg-[#C9A84C]/10 rounded-full blur-[40px] top-[30%] left-[40%]" />
            <div className="absolute w-32 h-32 bg-white/5 rounded-full blur-[50px] bottom-[25%] right-[35%]" />
            <div className="text-center z-10 max-w-sm p-6">
              <h3 className="text-sm font-display font-medium text-[#F0EDE6] uppercase tracking-[0.12em]">Analytics</h3>
              <p className="text-[11px] text-[#7A7870] mt-2">Real-time platform metrics and activity visualization.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
