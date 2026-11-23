export type AppCategory =
  | "all"
  | "projects"
  | "dev-cloud"
  | "ai"
  | "design"
  | "productivity"
  | "finance"
  | "communication";

export type ProjectSubCategory =
  | "SaaS & Platform"
  | "Client Project"
  | "Developer Tooling"
  | "Education & Portfolio";

export interface ProjectItem {
  id: string;
  name: string;
  category: "projects";
  subCategory: ProjectSubCategory;
  description: string;
  localPort?: number;
  localPath: string;
  liveUrl?: string;
  liveDomain?: string;
  githubUrl?: string;
  infraUrl?: string;
  logoUrl?: string;
  isPinned?: boolean;
  tags: string[];
}

export interface SaaSAppItem {
  id: string;
  name: string;
  category: Exclude<AppCategory, "all" | "projects">;
  description: string;
  url: string;
  domain?: string;
  logoUrl?: string;
  isPinned?: boolean;
  tags: string[];
}

export type HubItem = ProjectItem | SaaSAppItem;

export interface PortStatusMap {
  [port: number]: boolean;
}

export interface CustomAppPayload {
  name: string;
  category: AppCategory;
  description: string;
  url: string;
  localPort?: number;
  tags?: string;
}
