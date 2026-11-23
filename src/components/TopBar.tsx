"use client";

import { Globe, Grid, List, Menu, Plus, Radio, Search, Star, X } from "lucide-react";
import type { AppCategory } from "../types";
import { Button } from "./ui/button";

export type FilterScope = "all" | "active-ports" | "live-domains" | "pinned";
export type ViewMode = "grid" | "table";

interface TopBarProps {
  activeCategory: AppCategory;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterScope: FilterScope;
  onFilterScopeChange: (scope: FilterScope) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenAddModal: () => void;
  onOpenMobileSidebar: () => void;
  onOpenSyncModal: () => void;
  syncKey: string | null;
  isSyncing: boolean;
  activePortCount: number;
  liveDomainCount: number;
  pinnedCount: number;
}

export function TopBar({
  activeCategory,
  searchQuery,
  onSearchChange,
  filterScope,
  onFilterScopeChange,
  viewMode,
  onViewModeChange,
  onOpenAddModal,
  onOpenMobileSidebar,
  onOpenSyncModal,
  syncKey,
  isSyncing,
  activePortCount,
  liveDomainCount,
  pinnedCount,
}: TopBarProps) {
  const categoryNames: Record<AppCategory, string> = {
    all: "Workspace Overview",
    projects: "Workspace Projects",
    "dev-cloud": "Dev & Cloud Services",
    ai: "AI & Intelligence",
    design: "Design Systems",
    productivity: "Productivity & Docs",
    communication: "Communication Channels",
    finance: "Finance & Banking",
  };

  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur sticky top-0 z-20">
      <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex flex-col gap-3">
        {/* Row 1: Mobile toggle, Title & Action buttons */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-1.5 -ml-1 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-md shrink-0 touch-manipulation"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 dark:text-zinc-500 truncate">
                Hub / {activeCategory}
              </p>
              <h1 className="text-sm sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none truncate">
                {categoryNames[activeCategory]}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* View Mode Toggle: Grid vs Table */}
            <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-md p-0.5 bg-zinc-100 dark:bg-zinc-900">
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("table")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "table"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
                title="Compact Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenSyncModal}
              className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-medium rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors touch-manipulation"
              title={syncKey ? `Connected to Sync Key: ${syncKey}` : "Connect cloud sync"}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  syncKey
                    ? isSyncing
                      ? "bg-amber-500 animate-spin"
                      : "bg-emerald-500"
                    : "bg-zinc-400"
                }`}
              />
              <span className="hidden sm:inline">{syncKey ? "Synced" : "Sync"}</span>
            </button>

            <Button
              size="sm"
              onClick={onOpenAddModal}
              className="px-2.5 sm:px-3 touch-manipulation"
            >
              <Plus className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Add Link</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Row 2: Search input & Scope filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Live Filter Input */}
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter by name, domain, tags or port..."
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Quick Filter Scopes with edge-to-edge mobile scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => onFilterScopeChange("all")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                filterScope === "all"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => onFilterScopeChange("active-ports")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                filterScope === "active-ports"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <Radio className="w-3 h-3 text-emerald-500" />
              <span>Dev Ports ({activePortCount})</span>
            </button>
            <button
              type="button"
              onClick={() => onFilterScopeChange("live-domains")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                filterScope === "live-domains"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <Globe className="w-3 h-3 text-blue-500" />
              <span>Live Domains ({liveDomainCount})</span>
            </button>
            <button
              type="button"
              onClick={() => onFilterScopeChange("pinned")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                filterScope === "pinned"
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <Star className="w-3 h-3 text-amber-500" />
              <span>Pinned ({pinnedCount})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
