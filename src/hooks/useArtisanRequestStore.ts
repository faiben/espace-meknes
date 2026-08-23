"use client";

import { useState, useEffect, useCallback } from "react";
import { ArtisanRequest } from "@/types";
import { supabase } from "@/lib/supabase";

function toCamel(obj: Record<string, unknown>): ArtisanRequest {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    r[k.replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase())] = v;
  }
  return r as unknown as ArtisanRequest;
}

function toSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    r[k.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase())] = v;
  }
  return r;
}

export function useArtisanRequestStore() {
  const [requests, setRequests] = useState<ArtisanRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("artisan_requests").select("*");
      if (data) setRequests(data.map(toCamel));
      setLoaded(true);
    })();
  }, []);

  const addRequest = useCallback(async (req: ArtisanRequest) => {
    setRequests((prev) => [req, ...prev]);
    await supabase.from("artisan_requests").upsert(toSnake(req as unknown as Record<string, unknown>));
  }, []);

  const updateRequest = useCallback(async (updated: ArtisanRequest) => {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    await supabase.from("artisan_requests").upsert(toSnake(updated as unknown as Record<string, unknown>));
  }, []);

  const deleteRequest = useCallback(async (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    await supabase.from("artisan_requests").delete().eq("id", id);
  }, []);

  return { requests, addRequest, updateRequest, deleteRequest, loaded };
}
