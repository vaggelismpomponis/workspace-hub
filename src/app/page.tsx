"use client";

import { useState } from "react";
import { ShieldCheck, Terminal, Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16 flex-1 flex flex-col">
      <header className="mb-10 text-left">
        <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">
          Enterprise Blueprint
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Scaffolded with Production Engineering Directives
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Clean React architecture, zero AI visual slop, mobile-first responsive layout, and body-portaled modal isolation.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 mb-2 text-zinc-900 dark:text-zinc-100 font-semibold">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>8 Active Engineering Skills</span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Preloaded into <code className="text-xs bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded">.agent/skills</code> and <code className="text-xs bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded">AGENTS.md</code>.
          </p>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 mb-2 text-zinc-900 dark:text-zinc-100 font-semibold">
            <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Ultra-Fast Tooling</span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Powered by Biome for single-pass linting and formatting at native speeds.
          </p>
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Modal Viewport Isolation Verification
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Test the body portal, z-[99999] stacking, focus trapping, and ESC dismissal.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <span>Open Verified Modal</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Verified Body Portal Modal"
      >
        <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">
          This modal is portaled directly into <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">document.body</code> at <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">z-[99999]</code>. It cannot be trapped by any parent CSS stacking context (such as transforms, filters, or overflow hidden).
        </p>
        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Close (Esc)
          </Button>
        </div>
      </Modal>
    </main>
  );
}
