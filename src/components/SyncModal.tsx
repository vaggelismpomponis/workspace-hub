"use client";

import { Check, Cloud, Copy, KeyRound, RefreshCw, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  getSupabaseCredentials,
  getSyncKey,
  saveCustomSupabaseCredentials,
  setSyncKey,
} from "../lib/supabase";

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncTrigger: () => Promise<void>;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
}

export function SyncModal({
  isOpen,
  onClose,
  onSyncTrigger,
  isSyncing,
  lastSyncedAt,
}: SyncModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentKey, setCurrentKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [customKey, setCustomAnonKey] = useState("");

  useEffect(() => {
    setMounted(true);
    const existing = getSyncKey();
    if (existing) {
      setCurrentKey(existing);
      setInputKey(existing);
    }
    const creds = getSupabaseCredentials();
    if (creds) {
      setCustomUrl(creds.url);
      setCustomAnonKey(creds.anonKey);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const handleSaveKey = async () => {
    const trimmed = inputKey.trim();
    if (!trimmed) {
      setSyncKey(null);
      setCurrentKey("");
    } else {
      setSyncKey(trimmed);
      setCurrentKey(trimmed);
      await onSyncTrigger();
    }
  };

  const handleGenerateKey = () => {
    const chars = "abcdefghjkmnpqrstuvwxyz23456789";
    let gen = "hub-";
    for (let i = 0; i < 8; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setInputKey(gen);
  };

  const handleCopyKey = () => {
    if (!currentKey) return;
    navigator.clipboard.writeText(currentKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSaveCustomCreds = () => {
    if (customUrl.trim() && customKey.trim()) {
      saveCustomSupabaseCredentials(customUrl.trim(), customKey.trim());
      setShowConfig(false);
      onSyncTrigger();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-emerald-500 shrink-0" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Cross-Device Cloud Sync
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-xs text-zinc-600 dark:text-zinc-400">
          <div>
            <p className="leading-relaxed">
              Sync your starred items, custom links, and layout between your <strong>PC</strong>,{" "}
              <strong>laptop</strong>, and <strong>mobile</strong> phone using a private Sync Key.
            </p>
          </div>

          {/* Sync Key Configuration */}
          <div className="p-3.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-zinc-500" />
                <span>Your Sync Key</span>
              </span>
              {currentKey && (
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy Key"}</span>
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="e.g. my-private-vault-481"
                className="w-full sm:flex-1 px-3 py-1.5 font-mono text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-400"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateKey}
                  className="flex-1 sm:flex-initial px-2.5 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded font-medium transition-colors text-center"
                  title="Generate new unique key"
                >
                  Generate
                </button>
                <button
                  type="button"
                  onClick={handleSaveKey}
                  disabled={isSyncing}
                  className="flex-1 sm:flex-initial px-3.5 py-1.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold rounded transition-colors disabled:opacity-50 text-center"
                >
                  Connect
                </button>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500">
              Enter this exact key on your mobile browser or laptop to synchronize your workspace
              instantly.
            </p>
          </div>

          {/* Sync Status Banner */}
          <div className="flex items-center justify-between py-2 px-3 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  currentKey ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                }`}
              />
              <span className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                {currentKey ? `Active (Key: ${currentKey})` : "Offline (Local Storage Only)"}
              </span>
            </div>

            {currentKey && (
              <button
                type="button"
                onClick={onSyncTrigger}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
              </button>
            )}
          </div>

          {lastSyncedAt && (
            <p className="text-[10px] font-mono text-zinc-400 text-right">
              Last synced: {lastSyncedAt.toLocaleTimeString()}
            </p>
          )}

          {/* Supabase Custom Credentials Toggle */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 underline"
            >
              {showConfig ? "Hide Supabase Credentials" : "Configure Supabase Project Credentials"}
            </button>

            {showConfig && (
              <div className="mt-3 p-3 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-2.5">
                <div>
                  <label
                    htmlFor="supabase-url-input"
                    className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1"
                  >
                    Supabase Project URL
                  </label>
                  <input
                    id="supabase-url-input"
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://xyz.supabase.co"
                    className="w-full px-2.5 py-1.5 font-mono text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="supabase-key-input"
                    className="block text-[10px] uppercase font-semibold text-zinc-500 mb-1"
                  >
                    Supabase Anon Public Key
                  </label>
                  <input
                    id="supabase-key-input"
                    type="password"
                    value={customKey}
                    onChange={(e) => setCustomAnonKey(e.target.value)}
                    placeholder="eyJhbGciOi..."
                    className="w-full px-2.5 py-1.5 font-mono text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveCustomCreds}
                  className="px-3 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded text-[11px]"
                >
                  Save Credentials
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
            <span>Mobile, Laptop & PC Realtime Mesh</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
