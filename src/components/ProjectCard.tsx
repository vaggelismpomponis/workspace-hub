"use client";

import { Check, Copy, ExternalLink, Folder, Github, Globe, Server, Star } from "lucide-react";
import { useState } from "react";
import type { ProjectItem } from "../types";

interface ProjectCardProps {
  project: ProjectItem;
  isPortActive: boolean;
  onTogglePin: (id: string) => void;
}

export function ProjectCard({ project, isPortActive, onTogglePin }: ProjectCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(project.localPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-zinc-500">
              {project.subCategory}
            </p>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {project.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onTogglePin(project.id)}
            aria-label={project.isPinned ? "Unpin project" : "Pin project"}
            className="text-zinc-400 hover:text-amber-500 transition-colors p-1"
          >
            <Star
              className={`w-4 h-4 ${project.isPinned ? "text-amber-500 fill-amber-500" : ""}`}
            />
          </button>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
          {project.description}
        </p>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 text-xs">
          {project.localPort ? (
            <a
              href={`http://localhost:${project.localPort}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isPortActive ? "bg-emerald-500" : "bg-zinc-400"
                }`}
              />
              <span>localhost:{project.localPort}</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          ) : (
            <span className="text-[11px] text-zinc-400 italic">No port assigned</span>
          )}

          <button
            type="button"
            onClick={handleCopyPath}
            title={project.localPath}
            className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Folder className="w-3 h-3" />
                <span>Path</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 pt-1 text-xs text-zinc-600 dark:text-zinc-400">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <Globe className="w-3 h-3" />
              <span>Live</span>
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <Github className="w-3 h-3" />
              <span>Repo</span>
            </a>
          )}

          {project.infraUrl && (
            <a
              href={project.infraUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <Server className="w-3 h-3" />
              <span>Infra</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
