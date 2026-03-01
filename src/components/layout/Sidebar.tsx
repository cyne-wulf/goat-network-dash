"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  CreditCard,
  Fingerprint,
  LayoutDashboard,
  Rocket,
  ScrollText,
  Settings2,
  ShieldHalf,
  Workflow,
  Webhook,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const navItems = [
  {
    name: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Onboarding",
    href: "/onboarding",
    icon: Workflow,
  },
  {
    name: "Identity",
    href: "/identity",
    icon: Fingerprint,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Webhooks / Telegram",
    href: "/webhooks",
    icon: Webhook,
  },
  {
    name: "Logs",
    href: "/logs",
    icon: ScrollText,
  },
  {
    name: "Activation",
    href: "/activation",
    icon: Rocket,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings2,
  },
];

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-72 flex-col border-r border-white/10 bg-white/[0.03] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-6 py-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 text-white shadow-[0_10px_35px_rgba(59,130,246,0.45)]">
          <ShieldHalf suppressHydrationWarning className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.3em] text-white/60">
            Atlas
          </span>
          <span className="text-lg font-semibold">Operator Console</span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all",
                isActive
                  ? "bg-white/15 text-white shadow-[0_15px_45px_rgba(59,130,246,0.35)] ring-1 ring-white/40"
                  : "text-white/70 hover:bg-white/[0.08] hover:text-white",
              )}
            >
              <span className="absolute inset-y-0 left-0 w-1 rounded-full bg-gradient-to-b from-brand-400/80 to-brand-600/80 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              <Icon suppressHydrationWarning className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="space-y-3 border-t border-white/10 px-6 py-5">
        <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 shadow-[0_20px_60px_rgba(2,6,23,0.45)]">
          <p className="text-sm font-semibold">Atlas Console</p>
          <p className="text-xs text-white/70">
            Unified surface for activations, logs, and operators.
          </p>
          <Badge className="mt-3 w-fit bg-white/90 text-black">Private Beta</Badge>
        </div>
        <p className="text-xs text-white/60">
          Need production access? Contact the Atlas team to request a rollout
          slot.
        </p>
      </div>
    </aside>
  );
}
