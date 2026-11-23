"use client";

import { Command, Plus, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onOpenCommand: () => void;
  onOpenAddModal: () => void;
  onRefreshPorts: () => void;
  isPinging: boolean;
  activePortCount: number;
}

export function Header({
  onOpenCommand,
  onOpenAddModal,
  onRefreshPorts,
  isPinging,
  activePortCount,
}: HeaderProps) {
  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                Local Command Center
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                <span
                  className={`w-2 h-2 rounded-full ${
                    activePortCount > 0 ? "bg-emerald-500" : "bg-zinc-400"
                  }`}
                />
                {activePortCount} dev {activePortCount === 1 ? "port" : "ports"} live
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Workspace Hub
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenCommand}
            className="flex-1 sm:flex-none flex items-center justify-between gap-3 px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Command className="w-3.5 h-3.5" />
              <span>Search apps & projects...</span>
            </span>
            <kbd className="font-mono text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
              Ctrl K
            </kbd>
          </button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onRefreshPorts}
            disabled={isPinging}
            title="Scan local dev ports"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isPinging ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Check Ports</span>
          </Button>

          <Button size="sm" onClick={onOpenAddModal}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add Link</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
