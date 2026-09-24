import { useState, useCallback, useEffect } from "react";


export type CrowdRecord = {
  id: string;
  session_id: string;
  username: string;
  location: string | null;
  person_count: number;
  vehicle_count: number;
  recorded_at: string;
};

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
    // Mock save
  }, [sessionId]);

  const fetchSessionHistory = useCallback(async (sid: string) => {
    setHistory([]);
  }, []);

  const fetchGlobalDensity = useCallback(async () => {
    return [];
  }, []);

  return { saveRecord, fetchSessionHistory, fetchGlobalDensity, history, loading };
};
