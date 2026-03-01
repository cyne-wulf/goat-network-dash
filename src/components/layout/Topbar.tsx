"use client";

import { Menu, RadioTower } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useConsoleSettings } from "@/store/consoleSettings";

type TopbarProps = {
  onMenuClick?: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const { testnetMode, setTestnetMode } = useConsoleSettings();

  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-white/10 bg-[#050b1a]/80 px-4 py-4 text-white shadow-[0_10px_40px_rgba(2,6,23,0.55)] backdrop-blur-2xl md:px-10">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden flex-col lg:flex">
          <span className="text-xs uppercase tracking-[0.3em] text-white/50">
            Atlas
          </span>
          <span className="text-sm font-medium text-white/70">
            Operations Portal
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70 sm:flex">
          <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
          Build green
        </div>
        <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 shadow-[0_10px_30px_rgba(2,6,23,0.45)]">
          <RadioTower className="h-4 w-4 text-sky-300" />
          <div className="flex flex-col leading-tight">
            <span className="text-xs uppercase tracking-wide text-white/60">
              Testnet Mode
            </span>
            <span className="text-sm font-semibold">
              {testnetMode ? "Enabled" : "Disabled"}
            </span>
          </div>
          <Switch
            checked={testnetMode}
            onCheckedChange={setTestnetMode}
            aria-label="Toggle testnet mode"
          />
        </div>
        <Badge
          variant="secondary"
          className="hidden bg-white text-black sm:inline-flex"
        >
          Status · {testnetMode ? "Sepolia" : "Mainnet"}
        </Badge>
      </div>
    </header>
  );
}
