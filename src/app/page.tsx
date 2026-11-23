"use client";

import { AddAppModal } from "@/components/AddAppModal";
import { CommandPalette } from "@/components/CommandPalette";
import { ProjectsSection } from "@/components/ProjectsSection";
import { QuickLauncher } from "@/components/QuickLauncher";
import { SaaSSection } from "@/components/SaaSSection";
import { Sidebar } from "@/components/Sidebar";
import { type FilterScope, TopBar, type ViewMode } from "@/components/TopBar";
import { initialProjects, initialSaaSApps } from "@/data/initialCatalog";
import { loadCatalog, resetCatalogToDefault, saveCatalog } from "@/lib/storage";
import type { AppCategory, HubItem, PortStatusMap, ProjectItem, SaaSAppItem } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function WorkspaceHubPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [saasApps, setSaasApps] = useState<SaaSAppItem[]>(initialSaaSApps);
  const [portStatuses, setPortStatuses] = useState<PortStatusMap>({});
  const [isPinging, setIsPinging] = useState(false);
  const [activeCategory, setActiveCategory] = useState<AppCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterScope, setFilterScope] = useState<FilterScope>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initialize data from localStorage on mount
  useEffect(() => {
    try {
      const data = loadCatalog();
      if (data?.projects?.length > 0) setProjects(data.projects);
      if (data?.saasApps?.length > 0) setSaasApps(data.saasApps);
    } catch (err) {
      console.error("Storage load error", err);
    }
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
        if (json.statuses) setPortStatuses(json.statuses);
      }
    } catch (err) {
      console.error("Port ping error", err);
    } finally {
      setIsPinging(false);
    }
  }, []);

  useEffect(() => {
    if (projects.length > 0) pingPorts(projects);
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

  // Filtered lists based on category, search, and scope
  const filteredProjects = useMemo(() => {
    if (activeCategory !== "all" && activeCategory !== "projects") return [];

    return projects.filter((p) => {
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.liveDomain?.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.localPort?.toString().includes(q);
        if (!matches) return false;
      }

      // Filter scope
      if (filterScope === "active-ports") {
        return p.localPort ? !!portStatuses[p.localPort] : false;
      }
      if (filterScope === "live-domains") {
        return !!p.liveDomain;
      }
      if (filterScope === "pinned") {
        return !!p.isPinned;
      }

      return true;
    });
  }, [projects, activeCategory, searchQuery, filterScope, portStatuses]);

  const filteredSaaS = useMemo(() => {
    if (activeCategory === "projects") return [];

    return saasApps.filter((s) => {
      if (activeCategory !== "all" && s.category !== activeCategory) return false;

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.domain?.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Filter scope
      if (filterScope === "active-ports") return false;
      if (filterScope === "live-domains") return !!s.domain;
      if (filterScope === "pinned") return !!s.isPinned;

      return true;
    });
  }, [saasApps, activeCategory, searchQuery, filterScope]);

  const counts: Record<AppCategory, number> = useMemo(() => {
    return {
      all: allItems.length,
      projects: projects.length,
      "dev-cloud": saasApps.filter((s) => s.category === "dev-cloud").length,
      ai: saasApps.filter((s) => s.category === "ai").length,
      design: saasApps.filter((s) => s.category === "design").length,
      productivity: saasApps.filter((s) => s.category === "productivity").length,
      communication: saasApps.filter((s) => s.category === "communication").length,
      finance: saasApps.filter((s) => s.category === "finance").length,
    };
  }, [allItems, projects, saasApps]);

  const activePortCount = Object.values(portStatuses).filter(Boolean).length;
  const liveDomainCount =
    projects.filter((p) => p.liveDomain).length + saasApps.filter((s) => s.domain).length;

  return (
    <div className="min-h-dvh flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Sidebar Navigation */}
      <Sidebar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        counts={counts}
        portStatuses={portStatuses}
        onRefreshPorts={() => pingPorts(projects)}
        isPinging={isPinging}
        onOpenCommand={() => setIsCommandOpen(true)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterScope={filterScope}
          onFilterScopeChange={setFilterScope}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          activePortCount={activePortCount}
          liveDomainCount={liveDomainCount}
          pinnedCount={pinnedItems.length}
        />

        <main className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col">
          {/* Daily Suite */}
          {filterScope === "all" && !searchQuery && (
            <QuickLauncher pinnedItems={pinnedItems} onOpenAll={handleOpenPinned} />
          )}

          {/* Main Workspace Sections: Side by Side on Overview / Dual View */}
          {filteredProjects.length > 0 && filteredSaaS.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8 items-start mb-8">
              <ProjectsSection
                projects={filteredProjects}
                portStatuses={portStatuses}
                viewMode={viewMode}
                isSideBySide={true}
                onTogglePin={handleTogglePin}
              />
              <SaaSSection
                apps={filteredSaaS}
                viewMode={viewMode}
                isSideBySide={true}
                onTogglePin={handleTogglePin}
              />
            </div>
          ) : (
            <div className="space-y-8 mb-8">
              {filteredProjects.length > 0 && (
                <ProjectsSection
                  projects={filteredProjects}
                  portStatuses={portStatuses}
                  viewMode={viewMode}
                  isSideBySide={false}
                  onTogglePin={handleTogglePin}
                />
              )}
              {filteredSaaS.length > 0 && (
                <SaaSSection
                  apps={filteredSaaS}
                  viewMode={viewMode}
                  isSideBySide={false}
                  onTogglePin={handleTogglePin}
                />
              )}
            </div>
          )}

          {/* Empty Search/Filter State */}
          {filteredProjects.length === 0 && filteredSaaS.length === 0 && (
            <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                No apps or projects match your filters
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Try searching with another keyword or resetting the filter scope.
              </p>
            </div>
          )}

          {/* Footer Info & Reset Option */}
          <footer className="mt-auto pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
            <span>Workspace Hub • Professional Developer Command Center</span>
            <button
              type="button"
              onClick={() => {
                if (confirm("Reset catalog and reload all verified seed projects?")) {
                  const fresh = resetCatalogToDefault();
                  setProjects(fresh.projects);
                  setSaasApps(fresh.saasApps);
                }
              }}
              className="hover:text-zinc-700 dark:hover:text-zinc-300 underline"
            >
              Reset Seed Catalog
            </button>
          </footer>
        </main>
      </div>

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
