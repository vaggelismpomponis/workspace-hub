import { type SupabaseClient, createClient } from "@supabase/supabase-js";
import type { ProjectItem, SaaSAppItem } from "../types";

export interface RemoteWorkspaceData {
  id: string;
  projects: ProjectItem[];
  saas_apps: SaaSAppItem[];
  pinned_ids: string[];
  updated_at: string;
}

const STORAGE_KEY_CUSTOM_URL = "workspace_hub_supabase_url";
const STORAGE_KEY_CUSTOM_KEY = "workspace_hub_supabase_key";
const STORAGE_KEY_SYNC_KEY = "workspace_hub_sync_key";

let clientInstance: SupabaseClient | null = null;
let currentUrl: string | null = null;
let currentKey: string | null = null;

export function getSyncKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY_SYNC_KEY);
}

export function setSyncKey(key: string | null): void {
  if (typeof window === "undefined") return;
  if (!key) {
    localStorage.removeItem(STORAGE_KEY_SYNC_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY_SYNC_KEY, key.trim());
  }
}

export function getSupabaseCredentials(): { url: string; anonKey: string } | null {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  if (typeof window !== "undefined") {
    const customUrl = localStorage.getItem(STORAGE_KEY_CUSTOM_URL);
    const customKey = localStorage.getItem(STORAGE_KEY_CUSTOM_KEY);
    if (customUrl && customKey) {
      return { url: customUrl, anonKey: customKey };
    }
  }

  return null;
}

export function saveCustomSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_CUSTOM_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_CUSTOM_KEY, anonKey.trim());
  // Reset client to re-initialize
  clientInstance = null;
  currentUrl = null;
  currentKey = null;
}

export function getSupabaseClient(): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  if (!creds?.url || !creds?.anonKey) return null;

  if (clientInstance && currentUrl === creds.url && currentKey === creds.anonKey) {
    return clientInstance;
  }

  try {
    clientInstance = createClient(creds.url, creds.anonKey, {
      auth: {
        persistSession: false,
      },
    });
    currentUrl = creds.url;
    currentKey = creds.anonKey;
    return clientInstance;
  } catch (err) {
    console.error("Failed to initialize Supabase client", err);
    return null;
  }
}

export async function fetchRemoteWorkspace(syncKey: string): Promise<RemoteWorkspaceData | null> {
  const client = getSupabaseClient();
  if (!client || !syncKey) return null;

  try {
    const { data, error } = await client
      .from("workspaces")
      .select("id, projects, saas_apps, pinned_ids, updated_at")
      .eq("id", syncKey)
      .maybeSingle();

    if (error) {
      if (error.message.includes("Could not find the table") || error.code === "PGRST204") {
        console.warn(
          "Supabase: 'public.workspaces' table does not exist yet. Run the SQL in supabase/schema.sql in your Supabase SQL Editor to enable cross-device sync.",
        );
      } else {
        console.error("Supabase fetch error:", error.message);
      }
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      projects: Array.isArray(data.projects) ? data.projects : [],
      saas_apps: Array.isArray(data.saas_apps) ? data.saas_apps : [],
      pinned_ids: Array.isArray(data.pinned_ids) ? data.pinned_ids : [],
      updated_at: data.updated_at,
    };
  } catch (err) {
    console.error("Error fetching remote workspace:", err);
    return null;
  }
}

export async function pushRemoteWorkspace(
  syncKey: string,
  payload: { projects: ProjectItem[]; saasApps: SaaSAppItem[]; pinnedIds: string[] },
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client || !syncKey) return false;

  try {
    const { error } = await client.from("workspaces").upsert(
      {
        id: syncKey,
        projects: payload.projects,
        saas_apps: payload.saasApps,
        pinned_ids: payload.pinnedIds,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) {
      if (error.message.includes("Could not find the table") || error.code === "PGRST204") {
        console.warn(
          "Supabase: 'public.workspaces' table does not exist yet. Run the SQL in supabase/schema.sql in your Supabase SQL Editor to enable cross-device sync.",
        );
      } else {
        console.error("Supabase upsert error:", error.message);
      }
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error pushing remote workspace:", err);
    return false;
  }
}

export function subscribeToRemoteWorkspace(
  syncKey: string,
  onRemoteChange: (data: RemoteWorkspaceData) => void,
): (() => void) | null {
  const client = getSupabaseClient();
  if (!client || !syncKey) return null;

  try {
    const channel = client
      .channel(`workspace-${syncKey}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "workspaces",
          filter: `id=eq.${syncKey}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new === "object") {
            const row = payload.new as Record<string, unknown>;
            onRemoteChange({
              id: String(row.id || syncKey),
              projects: Array.isArray(row.projects) ? (row.projects as ProjectItem[]) : [],
              saas_apps: Array.isArray(row.saas_apps) ? (row.saas_apps as SaaSAppItem[]) : [],
              pinned_ids: Array.isArray(row.pinned_ids) ? (row.pinned_ids as string[]) : [],
              updated_at: String(row.updated_at || new Date().toISOString()),
            });
          }
        },
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.error("Failed to subscribe to workspace changes:", err);
    return null;
  }
}
