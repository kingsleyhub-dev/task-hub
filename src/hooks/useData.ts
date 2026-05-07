import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DBProfile = {
  id: string; name: string; email: string; work_id: string | null;
  department: string | null; status: string; risk_score: number; last_login: string | null;
};
export type DBTask = {
  id: string; code: string | null; title: string; description: string | null;
  category: string | null; priority: string; status: string; progress: number;
  deadline: string | null; assignee_id: string | null; created_at: string;
  assignee?: { name: string; work_id: string | null } | null;
};
export type DBTool = {
  id: string; name: string; category: string | null; version: string | null;
  vendor: string | null; description: string | null; status: string | null;
};
export type DBScript = {
  id: string; name: string; language: string | null; category: string | null;
  description: string | null; approval_status: string; created_at: string;
  author?: { name: string } | null;
};
export type DBAudit = {
  id: string; event: string; detail: string | null; severity: string;
  created_at: string; user?: { name: string; work_id: string | null } | null;
};
export type DBNotification = {
  id: string; title: string; body: string | null; type: string | null;
  read: boolean; created_at: string;
};

export function useProfiles() {
  const [data, setData] = useState<DBProfile[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at").then(({ data }) => {
      setData((data ?? []) as DBProfile[]); setLoading(false);
    });
  }, []);
  return { data, loading };
}

export function useTasks() {
  const [data, setData] = useState<DBTask[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = () => {
    supabase.from("tasks")
      .select("*, assignee:profiles!tasks_assignee_id_fkey(name, work_id)")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setData((data ?? []) as DBTask[]); setLoading(false); });
  };
  useEffect(() => {
    refresh();
    const ch = supabase.channel("tasks-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, refresh)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);
  return { data, loading, refresh };
}

export function useTools() {
  const [data, setData] = useState<DBTool[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("tools").select("*").order("name").then(({ data }) => {
      setData((data ?? []) as DBTool[]); setLoading(false);
    });
  }, []);
  return { data, loading };
}

export function useScripts() {
  const [data, setData] = useState<DBScript[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("scripts")
      .select("*, author:profiles!scripts_author_id_fkey(name)")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setData((data ?? []) as DBScript[]); setLoading(false); });
  }, []);
  return { data, loading };
}

export function useAuditLogs(limit = 100) {
  const [data, setData] = useState<DBAudit[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("audit_logs")
      .select("*, user:profiles!audit_logs_user_id_fkey(name, work_id)")
      .order("created_at", { ascending: false }).limit(limit)
      .then(({ data }) => { setData((data ?? []) as DBAudit[]); setLoading(false); });
  }, [limit]);
  return { data, loading };
}

export function useNotifications() {
  const [data, setData] = useState<DBNotification[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.from("notifications").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setData((data ?? []) as DBNotification[]); setLoading(false); });
  }, []);
  return { data, loading };
}

export async function logEvent(userId: string | undefined, event: string, detail?: string, severity: "Info"|"Low"|"Medium"|"High"|"Critical" = "Info") {
  await supabase.from("audit_logs").insert({ user_id: userId ?? null, event, detail: detail ?? null, severity });
}
