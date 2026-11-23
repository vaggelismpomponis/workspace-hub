import { initialProjects, initialSaaSApps } from "../data/initialCatalog";
import type { HubItem, ProjectItem, SaaSAppItem } from "../types";

const STORAGE_KEY_PROJECTS = "workspace_hub_projects_v1";
const STORAGE_KEY_SAAS = "workspace_hub_saas_v1";

export function loadCatalog(): { projects: ProjectItem[]; saasApps: SaaSAppItem[] } {
  if (typeof window === "undefined") {
    return { projects: initialProjects, saasApps: initialSaaSApps };
  }

  try {
    const savedProjects = localStorage.getItem(STORAGE_KEY_PROJECTS);
    const savedSaaS = localStorage.getItem(STORAGE_KEY_SAAS);

    const projects: ProjectItem[] = savedProjects ? JSON.parse(savedProjects) : initialProjects;

    const saasApps: SaaSAppItem[] = savedSaaS ? JSON.parse(savedSaaS) : initialSaaSApps;

    return { projects, saasApps };
  } catch (err) {
    console.error("Failed to load catalog from localStorage", err);
    return { projects: initialProjects, saasApps: initialSaaSApps };
  }
}

export function saveCatalog(projects: ProjectItem[], saasApps: SaaSAppItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    localStorage.setItem(STORAGE_KEY_SAAS, JSON.stringify(saasApps));
  } catch (err) {
    console.error("Failed to save catalog to localStorage", err);
  }
}

export function resetCatalogToDefault(): { projects: ProjectItem[]; saasApps: SaaSAppItem[] } {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY_PROJECTS);
    localStorage.removeItem(STORAGE_KEY_SAAS);
  }
  return { projects: initialProjects, saasApps: initialSaaSApps };
}
