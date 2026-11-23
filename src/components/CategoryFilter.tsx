"use client";

import type { AppCategory } from "../types";

interface CategoryFilterProps {
  activeCategory: AppCategory;
  onSelect: (category: AppCategory) => void;
  counts: Record<AppCategory, number>;
}

const CATEGORIES: { id: AppCategory; label: string }[] = [
  { id: "all", label: "All Items" },
  { id: "projects", label: "My Projects" },
  { id: "dev-cloud", label: "Dev & Cloud" },
  { id: "ai", label: "AI & Models" },
  { id: "design", label: "Design" },
  { id: "productivity", label: "Productivity" },
  { id: "communication", label: "Communication" },
  { id: "finance", label: "Finance & Banks" },
];

export function CategoryFilter({ activeCategory, onSelect, counts }: CategoryFilterProps) {
  return (
    <nav className="w-full flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = counts[cat.id] ?? 0;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              isActive
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
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
  );
}
