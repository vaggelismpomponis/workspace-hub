"use client";

import {
  Boxes,
  Code2,
  Cpu,
  FolderGit2,
  Kanban,
  LayoutGrid,
  LifeBuoy,
  MessageSquare,
  Palette,
  Power,
  RefreshCw,
  Search,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { AppCategory, PortStatusMap } from "../types";
import { Logo } from "./Logo";

interface SidebarProps {
  activeCategory: AppCategory;
  onSelectCategory: (cat: AppCategory) => void;
  counts: Record<AppCategory, number>;
  portStatuses: PortStatusMap;
  onRefreshPorts: () => void;
  isPinging: boolean;
  onOpenCommand: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: { id: AppCategory; label: string; icon: typeof LayoutGrid }[] = [
  { id: "all", label: "Overview", icon: LayoutGrid },
  { id: "projects", label: "My Projects", icon: FolderGit2 },
  { id: "dev-cloud", label: "Dev & Cloud", icon: Boxes },
  { id: "ai", label: "AI & Models", icon: Sparkles },
  { id: "design", label: "Design Systems", icon: Palette },
  { id: "productivity", label: "Productivity", icon: Kanban },
  { id: "communication", label: "Communication", icon: MessageSquare },
  { id: "finance", label: "Finance & Banks", icon: Wallet },
];

export function Sidebar({
  activeCategory,
  onSelectCategory,
  counts,
  portStatuses,
  onRefreshPorts,
  isPinging,
  onOpenCommand,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const activePorts = Object.entries(portStatuses)
    .filter(([_, active]) => active)
    .map(([port]) => Number.parseInt(port, 10));

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseMobile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, onCloseMobile]);

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <Logo size="md" showText={true} />
        {mobileOpen && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Quick Search Button */}
      <div className="px-3 pt-3 pb-2">
        <button
          type="button"
          onClick={onOpenCommand}
          className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <span className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Search apps...</span>
          </span>
          <kbd className="font-mono text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400 shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <p className="px-2 pb-1.5 text-[10px] font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
          Categories
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeCategory === item.id;
          const count = counts[item.id] ?? 0;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectCategory(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isActive
                    ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Local Ports Live Monitor Widget */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                activePorts.length > 0 ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
              }`}
            />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Dev Ports ({activePorts.length})
            </span>
          </div>
          <button
            type="button"
            onClick={onRefreshPorts}
            disabled={isPinging}
            className="p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            title="Scan active ports"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? "animate-spin" : ""}`} />
          </button>
        </div>

        {activePorts.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {activePorts.map((port) => (
              <a
                key={port}
                href={`http://localhost:${port}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 text-zinc-800 dark:text-zinc-200 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>:{port}</span>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-zinc-400 italic">No local dev ports active</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-zinc-200 dark:border-zinc-800 h-dvh sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Backdrop & Drawer Portaled */}
      {mounted &&
        mobileOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] lg:hidden flex" role="dialog" aria-modal="true">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={onCloseMobile}
              aria-hidden="true"
            />
            <div className="relative w-72 max-w-[85vw] h-full shadow-2xl flex flex-col bg-white dark:bg-zinc-950">
              {content}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
