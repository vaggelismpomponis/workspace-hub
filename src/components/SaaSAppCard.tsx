"use client";

import { ExternalLink, Star } from "lucide-react";
import type { SaaSAppItem } from "../types";

interface SaaSAppCardProps {
  app: SaaSAppItem;
  onTogglePin: (id: string) => void;
}

export function SaaSAppCard({ app, onTogglePin }: SaaSAppCardProps) {
  return (
    <article className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-zinc-500">
              {app.category}
            </p>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{app.name}</h3>
          </div>
          <button
            type="button"
            onClick={() => onTogglePin(app.id)}
            aria-label={app.isPinned ? "Unpin app" : "Pin app"}
            className="text-zinc-400 hover:text-amber-500 transition-colors p-1"
          >
            <Star className={`w-4 h-4 ${app.isPinned ? "text-amber-500 fill-amber-500" : ""}`} />
          </button>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
          {app.description}
        </p>

        {app.tags && app.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {app.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end">
        <a
          href={app.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
        >
          <span>Launch</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
        </a>
      </div>
    </article>
  );
}
