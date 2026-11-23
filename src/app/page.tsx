"use client";

import { AddAppModal } from "@/components/AddAppModal";
import { CategoryFilter } from "@/components/CategoryFilter";
import { CommandPalette } from "@/components/CommandPalette";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { QuickLauncher } from "@/components/QuickLauncher";
import { SaaSAppCard } from "@/components/SaaSAppCard";
import { loadCatalog, resetCatalogToDefault, saveCatalog } from "@/lib/storage";
import type { AppCategory, HubItem, PortStatusMap, ProjectItem, SaaSAppItem } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function WorkspaceHubPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [saasApps, setSaasApps] = useState<SaaSAppItem[]>([]);
  const [portStatuses, setPortStatuses] = useState<PortStatusMap>({});
  const [isPinging, setIsPinging] = useState(false);
  const [activeCategory, setActiveCategory] = useState<AppCategory>("all");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initialize data from localStorage on mount
  useEffect(() => {
    const data = loadCatalog();
    setProjects(data.projects);
    setSaasApps(data.saasApps);
  }, []);

  // Ping active ports
  const pingPorts = useCallback(async (projectsList: ProjectItem[]) => {
    const ports = Array.from(
      new Set(
        projectsList
          .map((p) => p.localPort)
          .filter((port): port is number => typeof port === "number" && port > 0),
      ),
    );

    if (ports.length === 0) return;

    setIsPinging(true);
    try {
      const res = await fetch(`/api/ping?ports=${ports.join(",")}`);
      if (res.ok) {
        const json = await res.json();
        if (json.statuses) {
          setPortStatuses(json.statuses);
        }
      }
    } catch (err) {
      console.error("Port ping error", err);
    } finally {
      setIsPinging(false);
    }
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      pingPorts(projects);
    }
  }, [projects, pingPorts]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const allItems: HubItem[] = useMemo(() => [...projects, ...saasApps], [projects, saasApps]);

  const pinnedItems: HubItem[] = useMemo(
    () => allItems.filter((item) => item.isPinned),
    [allItems],
  );

  const handleTogglePin = (id: string) => {
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, isPinned: !p.isPinned } : p));
      saveCatalog(next, saasApps);
      return next;
    });

    setSaasApps((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s));
      saveCatalog(projects, next);
      return next;
    });
  };

  const handleAddProject = (newProj: ProjectItem) => {
    setProjects((prev) => {
      const next = [newProj, ...prev];
      saveCatalog(next, saasApps);
      return next;
    });
  };

  const handleAddSaaS = (newApp: SaaSAppItem) => {
    setSaasApps((prev) => {
      const next = [newApp, ...prev];
      saveCatalog(projects, next);
      return next;
    });
  };

  const handleOpenPinned = () => {
    for (const item of pinnedItems) {
      const url =
        item.category === "projects"
          ? item.liveUrl || (item.localPort ? `http://localhost:${item.localPort}` : undefined)
          : item.url;
      if (url) window.open(url, "_blank");
    }
  };

  const counts: Record<AppCategory, number> = useMemo(() => {
    const map: Record<AppCategory, number> = {
      all: allItems.length,
      projects: projects.length,
      "dev-cloud": saasApps.filter((s) => s.category === "dev-cloud").length,
      ai: saasApps.filter((s) => s.category === "ai").length,
      design: saasApps.filter((s) => s.category === "design").length,
      productivity: saasApps.filter((s) => s.category === "productivity").length,
      communication: saasApps.filter((s) => s.category === "communication").length,
      finance: saasApps.filter((s) => s.category === "finance").length,
    };
    return map;
  }, [allItems, projects, saasApps]);

  const activePortCount = Object.values(portStatuses).filter(Boolean).length;

  const showProjects = activeCategory === "all" || activeCategory === "projects";
  const filteredSaaS =
    activeCategory === "all" ? saasApps : saasApps.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Header
        onOpenCommand={() => setIsCommandOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onRefreshPorts={() => pingPorts(projects)}
        isPinging={isPinging}
        activePortCount={activePortCount}
      />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col">
        <QuickLauncher pinnedItems={pinnedItems} onOpenAll={handleOpenPinned} />

        <div className="mb-6">
          <CategoryFilter
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
            counts={counts}
          />
        </div>

        {/* Projects Section */}
        {showProjects && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                Workspace Projects ({projects.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isPortActive={project.localPort ? !!portStatuses[project.localPort] : false}
                  onTogglePin={handleTogglePin}
                />
              ))}
            </div>
          </section>
        )}

        {/* SaaS & Daily Web Apps Section */}
        {filteredSaaS.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500">
                Daily Web & Cloud Services ({filteredSaaS.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredSaaS.map((app) => (
                <SaaSAppCard key={app.id} app={app} onTogglePin={handleTogglePin} />
              ))}
            </div>
          </section>
        )}

        {/* Footer info & restore defaults */}
        <footer className="mt-auto pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <span>Workspace Hub • Local Enterprise Command Center</span>
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset links and restore default catalog?")) {
                const fresh = resetCatalogToDefault();
                setProjects(fresh.projects);
                setSaasApps(fresh.saasApps);
              }
            }}
            className="hover:text-zinc-800 dark:hover:text-zinc-200 underline"
          >
            Reset Catalog Defaults
          </button>
        </footer>
      </main>

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        items={allItems}
      />

      <AddAppModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProject={handleAddProject}
        onAddSaaS={handleAddSaaS}
      />
    </div>
  );
}
