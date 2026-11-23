"use client";

import { ExternalLink, Globe, Star } from "lucide-react";
import type { SaaSAppItem } from "../types";

interface SaaSAppRowProps {
  app: SaaSAppItem;
  onTogglePin: (id: string) => void;
}

export function SaaSAppRow({ app, onTogglePin }: SaaSAppRowProps) {
  return (
    <tr className="border-b border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors text-xs">
      <td className="py-2.5 px-3">
        <button
          type="button"
          onClick={() => onTogglePin(app.id)}
          className="text-zinc-400 hover:text-amber-500 transition-colors"
        >
          <Star className={`w-3.5 h-3.5 ${app.isPinned ? "text-amber-500 fill-amber-500" : ""}`} />
        </button>
      </td>

      <td className="py-2.5 px-3">
        <div className="min-w-0">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate block">
            {app.name}
          </span>
          <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 block truncate">
            {app.category}
          </span>
        </div>
      </td>

      <td className="py-2.5 px-3">
        {app.domain ? (
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-500">
            <Globe className="w-3 h-3 shrink-0" />
            <span>{app.domain}</span>
          </span>
        ) : (
          <span className="text-zinc-400 font-mono text-[11px]">—</span>
        )}
      </td>

      <td className="py-2.5 px-3">
        <span className="text-xs text-zinc-500 line-clamp-1 max-w-xs">{app.description}</span>
      </td>

      <td className="py-2.5 px-3 text-right">
        <a
          href={app.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
        >
          <span>Open</span>
          <ExternalLink className="w-3 h-3 text-zinc-400" />
        </a>
      </td>
    </tr>
  );
}
