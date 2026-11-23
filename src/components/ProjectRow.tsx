"use client";

import { Check, Copy, ExternalLink, Folder, Github, Globe, Server, Star } from "lucide-react";
import { useState } from "react";
import type { ProjectItem } from "../types";

interface ProjectRowProps {
  project: ProjectItem;
  isPortActive: boolean;
  onTogglePin: (id: string) => void;
}

export function ProjectRow({ project, isPortActive, onTogglePin }: ProjectRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(project.localPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <tr className="border-b border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors text-xs">
      <td className="py-2.5 px-3">
        <button
          type="button"
          onClick={() => onTogglePin(project.id)}
          className="text-zinc-400 hover:text-amber-500 transition-colors"
        >
          <Star
            className={`w-3.5 h-3.5 ${project.isPinned ? "text-amber-500 fill-amber-500" : ""}`}
          />
        </button>
      </td>

      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2.5">
          {project.logoUrl ? (
            <img src={project.logoUrl} alt="" className="w-5 h-5 object-contain rounded shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-mono text-[10px] text-zinc-600 dark:text-zinc-400 shrink-0">
              {project.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate block">
              {project.name}
            </span>
            <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 block truncate">
              {project.subCategory}
            </span>
          </div>
        </div>
      </td>

      <td className="py-2.5 px-3">
        {project.liveDomain ? (
          <a
            href={project.liveUrl || `https://${project.liveDomain}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <Globe className="w-3 h-3 shrink-0" />
            <span>{project.liveDomain}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        ) : (
          <span className="text-zinc-400 font-mono text-[11px]">—</span>
        )}
      </td>

      <td className="py-2.5 px-3">
        {project.localPort ? (
          <a
            href={`http://localhost:${project.localPort}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPortActive ? "bg-emerald-500" : "bg-zinc-400"
              }`}
            />
            <span>:{project.localPort}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        ) : (
          <span className="text-zinc-400 font-mono text-[11px]">—</span>
        )}
      </td>

      <td className="py-2.5 px-3 text-right">
        <div className="inline-flex items-center gap-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              title="GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {project.infraUrl && (
            <a
              href={project.infraUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              title="Infrastructure Console"
            >
              <Server className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={handleCopyPath}
            className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            title={project.localPath}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Folder className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
