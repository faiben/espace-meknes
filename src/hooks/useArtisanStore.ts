"use client";

import { useState, useEffect, useCallback } from "react";
import { ArtisanProfile } from "@/types";
import { supabase } from "@/lib/supabase";

function toCamel(obj: Record<string, unknown>): ArtisanProfile {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    r[k.replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase())] = v;
  }
  return r as unknown as ArtisanProfile;
}

function toSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    r[k.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase())] = v;
  }
  return r;
}

export function useArtisanStore() {
  const [allArtisans, setAllArtisans] = useState<ArtisanProfile[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const PAGE = 1000;
      let from = 0;
      const all: ArtisanProfile[] = [];
      while (true) {
        const { data, error } = await supabase.from("artisans").select("*").range(from, from + PAGE - 1);
        if (error || !data || data.length === 0) break;
        all.push(...data.map(toCamel));
        if (data.length < PAGE) break;
        from += PAGE;
      }
      setAllArtisans(all);
      setLoaded(true);
    })();
  }, []);

  const addArtisan = useCallback(async (artisan: ArtisanProfile) => {
    setAllArtisans((prev) => [artisan, ...prev]);
    await supabase.from("artisans").upsert(toSnake(artisan as unknown as Record<string, unknown>));
  }, []);

  const updateArtisan = useCallback(async (updated: ArtisanProfile) => {
    setAllArtisans((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    await supabase.from("artisans").upsert(toSnake(updated as unknown as Record<string, unknown>));
  }, []);

  const deleteArtisan = useCallback(async (id: string) => {
    setAllArtisans((prev) => prev.filter((a) => a.id !== id));
    await supabase.from("artisans").delete().eq("id", id);
  }, []);

  return { allArtisans, addArtisan, updateArtisan, deleteArtisan, loaded };
}
