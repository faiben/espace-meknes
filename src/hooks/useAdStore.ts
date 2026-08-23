"use client";

import { useState, useEffect, useCallback } from "react";
import { Ad } from "@/types";
import { supabase } from "@/lib/supabase";

function toCamel(obj: Record<string, unknown>): Ad {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    r[k.replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase())] = v;
  }
  return r as unknown as Ad;
}

function toSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    r[k.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase())] = v;
  }
  return r;
}

export function useAdStore() {
  const [allAds, setAllAds] = useState<Ad[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("ads").select("*");
      if (data) setAllAds(data.map(toCamel));
    })();
  }, []);

  const addAd = useCallback(async (ad: Ad) => {
    setAllAds((prev) => [ad, ...prev]);
    await supabase.from("ads").upsert(toSnake(ad as unknown as Record<string, unknown>));
  }, []);

  const updateAd = useCallback(async (updated: Ad) => {
    setAllAds((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    await supabase.from("ads").upsert(toSnake(updated as unknown as Record<string, unknown>));
  }, []);

  const deleteAd = useCallback(async (id: string) => {
    setAllAds((prev) => prev.filter((a) => a.id !== id));
    await supabase.from("ads").delete().eq("id", id);
  }, []);

  const getActiveAds = useCallback(
    (position?: "banner" | "sidebar" | "inline") => {
      const now = new Date().toISOString();
      return allAds.filter((a) => {
        if (a.status !== "approved") return false;
        if (a.expiresAt && a.expiresAt < now) return false;
        if (a.startsAt && a.startsAt > now) return false;
        if (position && a.position !== position) return false;
        return true;
      });
    },
    [allAds]
  );

  return { allAds, addAd, updateAd, deleteAd, getActiveAds };
}
