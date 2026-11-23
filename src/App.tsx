import { AddAppModal } from "@/components/AddAppModal";
import { CommandPalette } from "@/components/CommandPalette";
import { ProjectsSection } from "@/components/ProjectsSection";
import { QuickLauncher } from "@/components/QuickLauncher";
import { SaaSSection } from "@/components/SaaSSection";
import { Sidebar } from "@/components/Sidebar";
import { SyncModal } from "@/components/SyncModal";
import { type FilterScope, TopBar, type ViewMode } from "@/components/TopBar";
import { initialProjects, initialSaaSApps } from "@/data/initialCatalog";
import {
  loadCatalog,
  loadPinnedIds,
  resetCatalogToDefault,
  savePinnedIds,
  saveProjects,
  saveSaaSApps,
} from "@/lib/storage";
import {
  fetchRemoteWorkspace,
  getSyncKey,
  pushRemoteWorkspace,
  subscribeToRemoteWorkspace,
} from "@/lib/supabase";
import type { AppCategory, HubItem, PortStatusMap, ProjectItem, SaaSAppItem } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function App() {
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
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Sync state
  const [syncKey, setSyncKeyState] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const isRemoteUpdatingRef = useRef(false);

  // Initialize data from localStorage on mount
  useEffect(() => {
    try {
      const data = loadCatalog();
      if (data?.projects?.length > 0) setProjects(data.projects);
      if (data?.saasApps?.length > 0) setSaasApps(data.saasApps);
      const savedKey = getSyncKey();
      if (savedKey) setSyncKeyState(savedKey);
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
        const contentType = res.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const json = await res.json();
          if (json.statuses) setPortStatuses(json.statuses);
        }
      }
    } catch (err) {
      // In standalone/mobile, local dev port pinging is non-fatal
      console.debug("Port ping not available or offline", err);
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

  // Sync with Supabase (pull latest & subscribe to realtime changes)
  const triggerSync = useCallback(async () => {
    const key = getSyncKey();
    setSyncKeyState(key);
    if (!key) return;

    setIsSyncing(true);
    try {
      const remote = await fetchRemoteWorkspace(key);
      if (remote) {
        isRemoteUpdatingRef.current = true;
        if (remote.projects?.length > 0) {
          setProjects(remote.projects);
          saveProjects(remote.projects);
        }
        if (remote.saas_apps?.length > 0) {
          setSaasApps(remote.saas_apps);
          saveSaaSApps(remote.saas_apps);
        }
        if (Array.isArray(remote.pinned_ids)) {
          savePinnedIds(remote.pinned_ids);
        }
        setLastSyncedAt(new Date());
        setTimeout(() => {
          isRemoteUpdatingRef.current = false;
        }, 300);
      } else {
        // First time connecting this key: push current local workspace to cloud
        const currentPinned = loadPinnedIds() || [];
        await pushRemoteWorkspace(key, {
          projects,
          saasApps,
          pinnedIds: currentPinned,
        });
        setLastSyncedAt(new Date());
      }
    } catch (err) {
      console.error("Cloud sync failed", err);
    } finally {
      setIsSyncing(false);
    }
  }, [projects, saasApps]);

  // Trigger sync on mount if key exists
  useEffect(() => {
    const key = getSyncKey();
    if (key) {
      triggerSync();
    }
  }, [triggerSync]);

  // Realtime subscription: updates when another device (mobile, laptop) modifies the workspace
  useEffect(() => {
    const key = syncKey;
    if (!key) return;

    const unsubscribe = subscribeToRemoteWorkspace(key, (remote) => {
      isRemoteUpdatingRef.current = true;
      if (remote.projects?.length > 0) {
        setProjects(remote.projects);
        saveProjects(remote.projects);
      }
      if (remote.saas_apps?.length > 0) {
        setSaasApps(remote.saas_apps);
        saveSaaSApps(remote.saas_apps);
      }
      if (Array.isArray(remote.pinned_ids)) {
        savePinnedIds(remote.pinned_ids);
      }
      setLastSyncedAt(new Date());
      setTimeout(() => {
        isRemoteUpdatingRef.current = false;
      }, 300);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [syncKey]);

  // Push local changes to Supabase
  const pushChangesToCloud = useCallback(
    (updatedProjects: ProjectItem[], updatedSaaS: SaaSAppItem[], updatedPinned: string[]) => {
      const key = getSyncKey();
      if (!key || isRemoteUpdatingRef.current) return;
      pushRemoteWorkspace(key, {
        projects: updatedProjects,
        saasApps: updatedSaaS,
        pinnedIds: updatedPinned,
      }).then((success) => {
        if (success) setLastSyncedAt(new Date());
      });
    },
    [],
  );

  const allItems: HubItem[] = useMemo(() => [...projects, ...saasApps], [projects, saasApps]);

  const pinnedItems: HubItem[] = useMemo(
    () => allItems.filter((item) => item.isPinned),
    [allItems],
  );

  const handleTogglePin = (id: string) => {
    let nextProjects = projects;
    let nextSaaS = saasApps;

    setProjects((prev) => {
      const exists = prev.some((p) => p.id === id);
      if (!exists) return prev;
      nextProjects = prev.map((p) => (p.id === id ? { ...p, isPinned: !p.isPinned } : p));
      saveProjects(nextProjects);
      return nextProjects;
    });

    setSaasApps((prev) => {
      const exists = prev.some((s) => s.id === id);
      if (!exists) return prev;
      nextSaaS = prev.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s));
      saveSaaSApps(nextSaaS);
      return nextSaaS;
    });

    const currentPinned = loadPinnedIds() || [];
    const nextPinned = currentPinned.includes(id)
      ? currentPinned.filter((item) => item !== id)
      : [...currentPinned, id];
    savePinnedIds(nextPinned);

    pushChangesToCloud(nextProjects, nextSaaS, nextPinned);
  };

  const handleAddProject = (newProj: ProjectItem) => {
    setProjects((prev) => {
      const next = [newProj, ...prev];
      saveProjects(next);
      pushChangesToCloud(next, saasApps, loadPinnedIds() || []);
      return next;
    });
  };

  const handleAddSaaS = (newApp: SaaSAppItem) => {
    setSaasApps((prev) => {
      const next = [newApp, ...prev];
      saveSaaSApps(next);
      pushChangesToCloud(projects, next, loadPinnedIds() || []);
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

  // Filtered lists (starred/pinned items prioritized at the top)
  const filteredProjects = useMemo(() => {
    if (activeCategory !== "all" && activeCategory !== "projects") return [];

    const matches = projects.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.liveDomain?.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.localPort?.toString().includes(q);
        if (!matchesQuery) return false;
      }

      if (filterScope === "active-ports") return p.localPort ? !!portStatuses[p.localPort] : false;
      if (filterScope === "live-domains") return !!p.liveDomain;
      if (filterScope === "pinned") return !!p.isPinned;

      return true;
    });

    return [...matches].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [projects, activeCategory, searchQuery, filterScope, portStatuses]);

  const filteredSaaS = useMemo(() => {
    if (activeCategory === "projects") return [];

    const matches = saasApps.filter((s) => {
      if (activeCategory !== "all" && s.category !== activeCategory) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.domain?.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      if (filterScope === "active-ports") return false;
      if (filterScope === "live-domains") return !!s.domain;
      if (filterScope === "pinned") return !!s.isPinned;

      return true;
    });

    return [...matches].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
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
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          syncKey={syncKey}
          isSyncing={isSyncing}
          activePortCount={activePortCount}
          liveDomainCount={liveDomainCount}
          pinnedCount={pinnedItems.length}
        />

        <main className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col">
          {filterScope === "all" && !searchQuery && (
            <QuickLauncher pinnedItems={pinnedItems} onOpenAll={handleOpenPinned} />
          )}

          {filteredProjects.length > 0 && filteredSaaS.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8 items-start mb-8">
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

      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSyncTrigger={triggerSync}
        isSyncing={isSyncing}
        lastSyncedAt={lastSyncedAt}
      />
    </div>
  );
}
