import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CrowdRecord = {
  id: string;
  session_id: string;
  username: string;
  location: string | null;
  person_count: number;
  vehicle_count: number;
  recorded_at: string;
};

type UntypedSupabaseClient = {
  from: (table: string) => {
    insert: (values: Record<string, unknown>) => Promise<{ error: Error | null }>;
    select: (columns?: string) => {
      eq: (column: string, value: string) => {
        order: (column: string, options?: { ascending?: boolean }) => Promise<{ data: CrowdRecord[] | null; error: Error | null }>;
      };
      order: (column: string, options?: { ascending?: boolean }) => {
        limit: (count: number) => Promise<{ data: CrowdRecord[] | null; error: Error | null }>;
      };
    };
  };
};

const crowdClient = supabase as unknown as UntypedSupabaseClient;

export const useCrowdPersistence = (sessionId?: string | null) => {
  const [history, setHistory] = useState<CrowdRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const saveRecord = useCallback(async (record: { 
    username: string; 
    location: string | null; 
    person_count: number; 
    vehicle_count: number 
  }) => {
    if (!sessionId) return;

    try {
      const { error } = await crowdClient
        .from("crowd_records")
        .insert({
          session_id: sessionId,
          username: record.username,
          location: record.location,
          person_count: record.person_count,
          vehicle_count: record.vehicle_count,
        });

      if (error) throw error;
    } catch (err) {
      console.error("Error saving crowd record:", err);
    }
  }, [sessionId]);

  const fetchSessionHistory = useCallback(async (sid: string) => {
    try {
      setLoading(true);
      const { data, error } = await crowdClient
        .from("crowd_records")
        .select("*")
        .eq("session_id", sid)
        .order("recorded_at", { ascending: true });

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error("Error fetching crowd history:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGlobalDensity = useCallback(async () => {
      // Get latest records from all sessions to show global density
      try {
          const { data, error } = await crowdClient
            .from("crowd_records")
            .select("*")
            .order("recorded_at", { ascending: false })
            .limit(100);
          
          if (error) throw error;
          return data || [];
      } catch (err) {
          console.error("Error fetching global density:", err);
          return [];
      }
  }, []);

  return { saveRecord, fetchSessionHistory, fetchGlobalDensity, history, loading };
};
