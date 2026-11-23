"use client";

import { ExternalLink, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { HubItem } from "../types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: HubItem[];
}

export function CommandPalette({ isOpen, onClose, items }: CommandPaletteProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSelectedIndex(0);
  };

  const filteredItems = items.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    const matchesDomain =
      item.category === "projects"
        ? item.liveDomain?.toLowerCase().includes(q)
        : item.domain?.toLowerCase().includes(q);

    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      matchesDomain ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      (item.category === "projects" && item.localPort && item.localPort.toString().includes(q))
    );
  });

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filteredItems.length ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        const targetUrl =
          selected.category === "projects"
            ? selected.liveUrl ||
              (selected.localPort ? `http://localhost:${selected.localPort}` : undefined)
            : selected.url;

        if (targetUrl) {
          window.open(targetUrl, "_blank");
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, filteredItems, selectedIndex]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-start justify-center p-4 pt-16 sm:pt-24"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        <div className="flex items-center px-3 py-2.5 border-b border-zinc-200 dark:border-zinc-800 gap-2">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search projects, domains, ports or tags..."
            className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-2 divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No matching apps or projects found.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const targetUrl =
                item.category === "projects"
                  ? item.liveUrl ||
                    (item.localPort ? `http://localhost:${item.localPort}` : undefined)
                  : item.url;

              const domainBadge = item.category === "projects" ? item.liveDomain : item.domain;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (targetUrl) {
                      window.open(targetUrl, "_blank");
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-md cursor-pointer transition-colors text-left ${
                    isSelected
                      ? "bg-zinc-100 dark:bg-zinc-800"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.logoUrl ? (
                      <img
                        src={item.logoUrl}
                        alt={`${item.name} logo`}
                        className="w-5 h-5 object-contain rounded shrink-0"
                      />
                    ) : null}
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {item.name}
                        </span>
                        {domainBadge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                            {domainBadge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-500 line-clamp-1">{item.description}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-zinc-400 shrink-0 ml-2">
                    {targetUrl && <ExternalLink className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-3 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Use ↑ ↓ to navigate</span>
          <span>Press Enter to open</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
