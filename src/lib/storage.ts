import { initialProjects, initialSaaSApps } from "../data/initialCatalog";
import type { ProjectItem, SaaSAppItem } from "../types";

const STORAGE_KEY_PROJECTS = "workspace_hub_projects_v2";
const STORAGE_KEY_SAAS = "workspace_hub_saas_v2";
const STORAGE_KEY_PINNED = "workspace_hub_pinned_v2";

export function loadPinnedIds(): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PINNED);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function savePinnedIds(pinnedIds: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PINNED, JSON.stringify(pinnedIds));
  } catch (err) {
    console.error("Failed to save pinned IDs to localStorage", err);
  }
}

export function saveProjects(projects: ProjectItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error("Failed to save projects to localStorage", err);
  }
}

export function saveSaaSApps(saasApps: SaaSAppItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_SAAS, JSON.stringify(saasApps));
  } catch (err) {
    console.error("Failed to save SaaS apps to localStorage", err);
  }
}

export function saveCatalog(projects: ProjectItem[], saasApps: SaaSAppItem[]): void {
  saveProjects(projects);
  saveSaaSApps(saasApps);
}

export function loadCatalog(): {
  projects: ProjectItem[];
  saasApps: SaaSAppItem[];
  pinnedIds: string[];
} {
  if (typeof window === "undefined") {
    const defaultPinned = [...initialProjects, ...initialSaaSApps]
      .filter((i) => i.isPinned)
      .map((i) => i.id);
    return {
      projects: initialProjects,
      saasApps: initialSaaSApps,
      pinnedIds: defaultPinned,
    };
  }

  try {
    const savedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
    const savedSaaS = localStorage.getItem(STORAGE_KEY_SAAS);
    const savedPinned = loadPinnedIds();

    let projects: ProjectItem[] = initialProjects;
    let saasApps: SaaSAppItem[] = initialSaaSApps;

    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) projects = parsed;
      } catch (e) {
        console.error("Error parsing saved projects", e);
      }
    }

    if (savedSaaS) {
      try {
        const parsed = JSON.parse(savedSaaS);
        if (Array.isArray(parsed) && parsed.length > 0) saasApps = parsed;
      } catch (e) {
        console.error("Error parsing saved saasApps", e);
      }
    }

    let pinnedIds: string[];
    if (savedPinned) {
      pinnedIds = savedPinned;
    } else {
      pinnedIds = [...projects, ...saasApps].filter((item) => item.isPinned).map((item) => item.id);
      savePinnedIds(pinnedIds);
    }

    const pinnedSet = new Set(pinnedIds);
    projects = projects.map((p) => ({ ...p, isPinned: pinnedSet.has(p.id) }));
    saasApps = saasApps.map((s) => ({ ...s, isPinned: pinnedSet.has(s.id) }));

    return { projects, saasApps, pinnedIds };
  } catch (err) {
    console.error("Failed to load catalog from localStorage", err);
    const defaultPinned = [...initialProjects, ...initialSaaSApps]
      .filter((i) => i.isPinned)
      .map((i) => i.id);
    return {
      projects: initialProjects,
      saasApps: initialSaaSApps,
      pinnedIds: defaultPinned,
    };
  }
}

export function resetCatalogToDefault(): {
  projects: ProjectItem[];
  saasApps: SaaSAppItem[];
} {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY_PROJECTS);
    localStorage.removeItem(STORAGE_KEY_SAAS);
    localStorage.removeItem(STORAGE_KEY_PINNED);
  }
  const defaultPinned = [...initialProjects, ...initialSaaSApps]
    .filter((i) => i.isPinned)
    .map((i) => i.id);
  const pinnedSet = new Set(defaultPinned);
  const projects = initialProjects.map((p) => ({ ...p, isPinned: pinnedSet.has(p.id) }));
  const saasApps = initialSaaSApps.map((s) => ({ ...s, isPinned: pinnedSet.has(s.id) }));

  saveCatalog(projects, saasApps);
  savePinnedIds(defaultPinned);

  return { projects, saasApps };
}
