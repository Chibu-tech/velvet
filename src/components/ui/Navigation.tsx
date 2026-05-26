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
  const unreadMessageCount = notifications.filter(n => !n.isRead && n.type === "message").length;

  const links = [
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/chat", label: "Messages", icon: MessageSquare, badge: unreadMessageCount },
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
        <Link href="/" className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border border-white/[0.07] bg-[#0E0E12]">
          <img src="/logo/Velvet.png" alt="Velvet" className="w-full h-full object-cover" />
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
                    ? "text-[#80465E] bg-white/[0.04]"
                    : "text-[#4A4845] hover:text-[#80465E] hover:bg-white/[0.02]"
                }`}
              >
                <Icon size={20} strokeWidth={1.5} />
                {link.badge && link.badge > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#80465E]" />
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

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden bg-[#0E0E12]/95 backdrop-blur-xl border-t border-[#80465E] h-[68px] px-2 items-center justify-around safe-area-bottom">
        {links.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${
                active ? "text-[#80465E]" : "text-[#4A4845] hover:text-[#80465E]"
              }`}
            >
              <Icon size={22} strokeWidth={1.5} />
              <span className="text-[9px] mt-1.5 font-medium tracking-wide">{link.label}</span>
              {link.badge && link.badge > 0 && (
                <span className="absolute top-0 right-1 w-1.5 h-1.5 rounded-full bg-[#80465E]" />
              )}
            </Link>
          );
        })}
      </nav>

      <header className="fixed top-0 left-0 right-0 z-30 h-14 bg-[#0E0E12]/60 backdrop-blur-md border-b border-white/[0.07] flex items-center justify-between px-5 md:pl-[88px]">
        <Link href="/" className="flex items-center gap-2 text-lg font-display font-medium tracking-tight text-[#80465E]">
          <img src="/logo/Velvet.png" alt="Velvet" className="w-8 h-8 object-contain" />
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
