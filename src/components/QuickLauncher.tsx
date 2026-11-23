"use client";

import { ExternalLink, Star } from "lucide-react";
import type { HubItem } from "../types";

interface QuickLauncherProps {
  pinnedItems: HubItem[];
  onOpenAll: () => void;
}

export function QuickLauncher({ pinnedItems, onOpenAll }: QuickLauncherProps) {
  if (pinnedItems.length === 0) return null;

  return (
    <section className="w-full mb-5 sm:mb-6 p-3 sm:p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/60 dark:bg-zinc-900/40">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-700 dark:text-zinc-300">
            Daily Suite (Pinned)
          </h2>
        </div>
        <button
          type="button"
          onClick={onOpenAll}
          className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 font-medium transition-colors"
        >
          <span className="hidden sm:inline">Open Pinned Apps</span>
          <span className="sm:hidden">Open All</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {pinnedItems.map((item) => {
          const targetUrl =
            item.category === "projects"
              ? item.liveUrl || (item.localPort ? `http://localhost:${item.localPort}` : undefined)
              : item.url;

          if (!targetUrl) return null;

          return (
            <a
              key={item.id}
              href={targetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              {item.logoUrl ? (
                <img
                  src={item.logoUrl}
                  alt={`${item.name} logo`}
                  className="w-4 h-4 object-contain rounded shrink-0"
                />
              ) : null}
              <span>{item.name}</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
