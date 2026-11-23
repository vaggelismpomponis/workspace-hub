"use client";

import { Boxes } from "lucide-react";
import type { SaaSAppItem } from "../types";
import { SaaSAppCard } from "./SaaSAppCard";
import { SaaSAppRow } from "./SaaSAppRow";
import type { ViewMode } from "./TopBar";

interface SaaSSectionProps {
  apps: SaaSAppItem[];
  viewMode: ViewMode;
  isSideBySide?: boolean;
  onTogglePin: (id: string) => void;
}

export function SaaSSection({
  apps,
  viewMode,
  isSideBySide = false,
  onTogglePin,
}: SaaSSectionProps) {
  if (apps.length === 0) return null;

  return (
    <section className="min-w-0">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Boxes className="w-4 h-4 text-zinc-500 shrink-0" />
          <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500">
            Cloud & Web Services ({apps.length})
          </h2>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div
          className={
            isSideBySide
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 2xl:grid-cols-2 gap-3.5"
              : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5"
          }
        >
          {apps.map((app) => (
            <SaaSAppCard key={app.id} app={app} onTogglePin={onTogglePin} />
          ))}
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50">
                  <th className="py-2 px-3 w-8" />
                  <th className="py-2 px-3">Service</th>
                  <th className="py-2 px-3">Domain</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <SaaSAppRow key={app.id} app={app} onTogglePin={onTogglePin} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
