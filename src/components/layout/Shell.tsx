"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Backdrop } from "./Backdrop";

type ShellProps = {
  children: React.ReactNode;
};

export function Shell({ children }: ShellProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#030712] text-foreground">
      <Backdrop />
      <div className="relative z-10 hidden lg:flex lg:w-72">
        <Sidebar />
      </div>
      <div className="relative z-10 flex flex-1 flex-col">
        <Topbar onMenuClick={() => setOpen(true)} />
        <main className="flex-1 px-4 py-8 md:px-10">
          <div className="relative mx-auto max-w-6xl space-y-8 rounded-[2rem] border border-white/5 bg-white/[0.02] p-6 shadow-[0_25px_120px_rgba(2,6,23,0.65)] backdrop-blur-3xl md:p-10">
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-white/10 opacity-60 [mask-image:linear-gradient(180deg,white,transparent)]" />
            <div className="relative z-10 space-y-8">{children}</div>
          </div>
        </main>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-72 border-r border-white/10 bg-[#050b1a]/95 p-0 text-white"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <Sidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
