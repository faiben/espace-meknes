"use client";

import { useState, useEffect, useCallback } from "react";
import { ArtisanProfile } from "@/types";
import { supabase } from "@/lib/supabase";

export function useArtisanStore() {
  const [allArtisans, setAllArtisans] = useState<ArtisanProfile[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("artisans").select("*");
      if (data) setAllArtisans(data as ArtisanProfile[]);
      setLoaded(true);
    })();
  }, []);

  const addArtisan = useCallback(async (artisan: ArtisanProfile) => {
    setAllArtisans((prev) => [artisan, ...prev]);
    await supabase.from("artisans").upsert(artisan);
  }, []);

  const updateArtisan = useCallback(async (updated: ArtisanProfile) => {
    setAllArtisans((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    await supabase.from("artisans").upsert(updated);
  }, []);

  const deleteArtisan = useCallback(async (id: string) => {
    setAllArtisans((prev) => prev.filter((a) => a.id !== id));
    await supabase.from("artisans").delete().eq("id", id);
  }, []);

  return { allArtisans, addArtisan, updateArtisan, deleteArtisan, loaded };
}
