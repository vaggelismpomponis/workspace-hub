"use client";

import { useState } from "react";
import type { AppCategory, ProjectItem, SaaSAppItem } from "../types";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: ProjectItem) => void;
  onAddSaaS: (app: SaaSAppItem) => void;
}

export function AddAppModal({ isOpen, onClose, onAddProject, onAddSaaS }: AddAppModalProps) {
  const [itemType, setItemType] = useState<"project" | "saas">("project");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [localPort, setLocalPort] = useState("");
  const [localPath, setLocalPath] = useState("");
  const [category, setCategory] = useState<AppCategory>("dev-cloud");
  const [tagsInput, setTagsInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (itemType === "project") {
      const portNum = localPort ? Number.parseInt(localPort, 10) : undefined;
      onAddProject({
        id: `custom-proj-${Date.now()}`,
        name: name.trim(),
        category: "projects",
        subCategory: "Client Project",
        description: description.trim() || "Local workspace project",
        localPort: portNum && !Number.isNaN(portNum) ? portNum : undefined,
        localPath: localPath.trim() || `C:\\Projects\\${name.trim()}`,
        liveUrl: url.trim() || undefined,
        tags,
      });
    } else {
      onAddSaaS({
        id: `custom-saas-${Date.now()}`,
        name: name.trim(),
        category: category === "all" || category === "projects" ? "dev-cloud" : category,
        description: description.trim() || "Web tool & daily service",
        url: url.trim() || "https://",
        tags,
      });
    }

    setName("");
    setDescription("");
    setUrl("");
    setLocalPort("");
    setLocalPath("");
    setTagsInput("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Link to Hub">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs sm:text-sm">
        <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-md">
          <button
            type="button"
            onClick={() => setItemType("project")}
            className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
              itemType === "project"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Local / Custom Project
          </button>
          <button
            type="button"
            onClick={() => setItemType("saas")}
            className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
              itemType === "saas"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Web App / SaaS Tool
          </button>
        </div>

        <div>
          <label
            htmlFor="item-name"
            className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Name *
          </label>
          <input
            id="item-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My Next.js SaaS"
            className="w-full px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </div>

        <div>
          <label
            htmlFor="item-desc"
            className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Description
          </label>
          <input
            id="item-desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of the tool"
            className="w-full px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </div>

        {itemType === "project" ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="item-port"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Local Port (e.g. 3000, 5173)
                </label>
                <input
                  id="item-port"
                  type="number"
                  value={localPort}
                  onChange={(e) => setLocalPort(e.target.value)}
                  placeholder="3000"
                  className="w-full px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>
              <div>
                <label
                  htmlFor="item-live-url"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Live URL (Optional)
                </label>
                <input
                  id="item-live-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://mysite.com"
                  className="w-full px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="item-local-path"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Local Folder Path
              </label>
              <input
                id="item-local-path"
                type="text"
                value={localPath}
                onChange={(e) => setLocalPath(e.target.value)}
                placeholder="C:\Projects\my-app"
                className="w-full px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label
                htmlFor="item-category"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Category
              </label>
              <select
                id="item-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as AppCategory)}
                className="w-full px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              >
                <option value="dev-cloud">Dev & Cloud</option>
                <option value="ai">AI & Models</option>
                <option value="design">Design</option>
                <option value="productivity">Productivity</option>
                <option value="communication">Communication</option>
                <option value="finance">Finance & Banks</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="item-saas-url"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                URL *
              </label>
              <input
                id="item-saas-url"
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
          </>
        )}

        <div>
          <label
            htmlFor="item-tags"
            className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            Tags (comma separated)
          </label>
          <input
            id="item-tags"
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Next.js, Supabase, Auth"
            className="w-full px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" type="submit">
            Add to Hub
          </Button>
        </div>
      </form>
    </Modal>
  );
}
