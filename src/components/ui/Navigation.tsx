"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  MessageSquare,
  Calendar,
  Sparkles,
  LayoutDashboard,
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
      <aside className="fixed left-0 top-0 bottom-0 z-40 hidden md:flex flex-col w-[72px] bg-[#0E0E12]/90 backdrop-blur-xl border-r border-white/[0.07] items-center justify-between py-8">
        <Link href="/" className="text-2xl font-display font-medium tracking-tight text-[#C9A84C]">
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
                    ? "text-[#C9A84C] bg-white/[0.04]"
                    : "text-[#4A4845] hover:text-[#C9A84C] hover:bg-white/[0.02]"
                }`}
              >
                <Icon size={20} strokeWidth={1.5} />
                {link.badge && link.badge > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                )}
                <span className="absolute left-[calc(100%+12px)] px-2.5 py-1 text-[11px] font-medium text-[#F0EDE6]/80 bg-[#1A1A22] rounded-lg border border-white/[0.07] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <Link href="/settings" className="w-[52px] h-[52px] rounded-full border border-white/[0.07] overflow-hidden hover:opacity-80 transition-opacity">
          <img
            src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"}
            alt=""
            className="w-full h-full object-cover"
          />
        </Link>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden bg-[#0E0E12]/95 backdrop-blur-xl border-t border-[#C9A84C] h-[68px] px-2 items-center justify-around safe-area-bottom">
        {links.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
                active ? "text-[#C9A84C]" : "text-[#4A4845] hover:text-[#C9A84C]"
              }`}
            >
              <Icon size={22} strokeWidth={1.5} />
              <span className="text-[9px] mt-1.5 font-medium tracking-wide">{link.label}</span>
              {link.badge && link.badge > 0 && (
                <span className="absolute top-0 right-1 w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
              )}
            </Link>
          );
        })}
      </nav>

      <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-[#0E0E12]/60 backdrop-blur-md border-b border-white/[0.07] flex items-center justify-between px-5 md:pl-[88px]">
        <Link href="/" className="text-lg font-display font-medium tracking-tight text-[#C9A84C]">
          PREMIUM
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/subscriptions"
            className="hidden sm:flex items-center gap-1.5 bg-[#1A1A22] border border-white/[0.07] px-3 py-1.5 rounded-full text-xs text-[#7A7870] hover:text-[#F0EDE6] transition-colors"
          >
            <Sparkles size={12} strokeWidth={1.5} />
            <span>{currentUser?.credits || 0}</span>
          </Link>

          <Link
            href="/settings"
            className="w-[52px] h-[52px] rounded-full border border-white/[0.07] overflow-hidden"
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
