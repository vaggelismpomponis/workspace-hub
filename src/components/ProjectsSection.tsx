"use client";

import { FolderGit2 } from "lucide-react";
import type { PortStatusMap, ProjectItem } from "../types";
import { ProjectCard } from "./ProjectCard";
import { ProjectRow } from "./ProjectRow";
import type { ViewMode } from "./TopBar";

interface ProjectsSectionProps {
  projects: ProjectItem[];
  portStatuses: PortStatusMap;
  viewMode: ViewMode;
  isSideBySide?: boolean;
  onTogglePin: (id: string) => void;
}

export function ProjectsSection({
  projects,
  portStatuses,
  viewMode,
  isSideBySide = false,
  onTogglePin,
}: ProjectsSectionProps) {
  if (projects.length === 0) return null;

  return (
    <section className="min-w-0">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-zinc-500 shrink-0" />
          <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500">
            Projects ({projects.length})
          </h2>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div
          className={
            isSideBySide
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 2xl:grid-cols-2 gap-3.5"
              : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5"
          }
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isPortActive={project.localPort ? !!portStatuses[project.localPort] : false}
              onTogglePin={onTogglePin}
            />
          ))}
        </div>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50">
                  <th className="py-2 px-3 w-8" />
                  <th className="py-2 px-3">Project</th>
                  <th className="py-2 px-3">Live Domain</th>
                  <th className="py-2 px-3">Local Dev Port</th>
                  <th className="py-2 px-3 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    isPortActive={project.localPort ? !!portStatuses[project.localPort] : false}
                    onTogglePin={onTogglePin}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
