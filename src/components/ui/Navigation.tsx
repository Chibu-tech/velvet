"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  MessageSquare,
  Calendar,
  Sparkles,
  LayoutDashboard,
  User,
  Settings,
  Gift,
} from "lucide-react";
import { useVelvetStore } from "@/store/useVelvetStore";

export function Navigation() {
  const pathname = usePathname();
  const currentUser = useVelvetStore((state) => state.currentUser);
  const notifications = useVelvetStore((state) => state.notifications);
  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  const links = [
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/chat", label: "Messages", icon: MessageSquare, badge: unreadNotifCount },
    { href: "/bookings", label: "Bookings", icon: Calendar },
    { href: "/subscriptions", label: "Membership", icon: Sparkles },
    { href: "/referral", label: "Referrals", icon: Gift },
  ];

  if (currentUser?.role === "admin") {
    links.push({ href: "/dashboard", label: "Admin", icon: LayoutDashboard });
  }
  links.push({ href: "/settings", label: "Settings", icon: Settings });

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col w-[72px] bg-[#0a0a0a]/90 backdrop-blur-xl border-r border-white/[0.04] items-center justify-between py-8">
        <Link href="/" className="text-2xl font-display font-bold tracking-tight text-white/90">
          V
        </Link>

        <nav className="flex flex-col gap-5">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative p-3 rounded-xl transition-all duration-300 group flex items-center justify-center ${
                  active
                    ? "bg-white/[0.06] text-white"
                    : "text-white/30 hover:text-white/70 hover:bg-white/[0.03]"
                }`}
              >
                <Icon size={20} />
                {link.badge && link.badge > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-velvet-gold shadow-[0_0_8px_rgba(201,169,78,0.4)]" />
                )}
                <span className="absolute left-[calc(100%+12px)] px-2.5 py-1 text-[11px] font-medium text-white/80 bg-[#121212] rounded-lg border border-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <Link href="/settings" className="w-9 h-9 rounded-full border border-white/[0.06] overflow-hidden hover:opacity-80 transition-opacity">
          <img
            src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"}
            alt=""
            className="w-full h-full object-cover"
          />
        </Link>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/[0.04] h-[68px] px-2 items-center justify-around safe-area-bottom">
        {links.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
                active ? "text-white" : "text-white/30 hover:text-white/60"
              }`}
            >
              <Icon size={20} />
              <span className="text-[9px] mt-1.5 font-medium tracking-wide">{link.label}</span>
              {link.badge && link.badge > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-velvet-gold shadow-[0_0_8px_rgba(201,169,78,0.4)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-[#0a0a0a]/60 backdrop-blur-md border-b border-white/[0.04] flex items-center justify-between px-5 md:pl-[88px]">
        <Link href="/" className="text-lg font-display font-bold tracking-tight text-white/90">
          VELVET
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/subscriptions"
            className="hidden sm:flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-full text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            <Sparkles size={12} />
            <span>{currentUser?.credits || 0}</span>
          </Link>

          <Link
            href="/settings"
            className="w-7 h-7 rounded-full border border-white/[0.06] overflow-hidden"
          >
            <img
              src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"}
              alt=""
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </header>
    </>
  );
}
