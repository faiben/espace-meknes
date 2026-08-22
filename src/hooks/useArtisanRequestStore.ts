"use client";

import { useState, useEffect, useCallback } from "react";
import { ArtisanRequest } from "@/types";
import { supabase } from "@/lib/supabase";

export function useArtisanRequestStore() {
  const [requests, setRequests] = useState<ArtisanRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("artisan_requests").select("*");
      if (data) setRequests(data as ArtisanRequest[]);
      setLoaded(true);
    })();
  }, []);

  const addRequest = useCallback(async (req: ArtisanRequest) => {
    setRequests((prev) => [req, ...prev]);
    await supabase.from("artisan_requests").upsert(req);
  }, []);

  const updateRequest = useCallback(async (updated: ArtisanRequest) => {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    await supabase.from("artisan_requests").upsert(updated);
  }, []);

  const deleteRequest = useCallback(async (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    await supabase.from("artisan_requests").delete().eq("id", id);
  }, []);

  return { requests, addRequest, updateRequest, deleteRequest, loaded };
}
