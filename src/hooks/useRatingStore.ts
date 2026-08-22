"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Rating {
  id: string;
  businessId?: string;
  artisanId?: string;
  userName: string;
  stars: number;
  comment: string;
  createdAt: string;
}

function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("espace-meknes-device-id");
  if (!id) {
    id = `device-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("espace-meknes-device-id", id);
  }
  return id;
}

export function useRatingStore() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("ratings").select("*");
      if (data) setRatings(data as Rating[]);
      setLoaded(true);
    })();
  }, []);

  const addRating = useCallback(async (rating: Omit<Rating, "id" | "createdAt">) => {
    const deviceId = getDeviceId();
    const newRating: Rating = {
      ...rating,
      id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      userName: rating.userName || deviceId.slice(0, 8),
    };
    setRatings((prev) => [newRating, ...prev]);
    await supabase.from("ratings").upsert(newRating);
    return newRating;
  }, []);

  const getBusinessRatings = useCallback(
    (businessId: string) => ratings.filter((r) => r.businessId === businessId),
    [ratings]
  );

  const getArtisanRatings = useCallback(
    (artisanId: string) => ratings.filter((r) => r.artisanId === artisanId),
    [ratings]
  );

  const getBusinessAverage = useCallback(
    (businessId: string) => {
      const br = ratings.filter((r) => r.businessId === businessId);
      if (br.length === 0) return null;
      const sum = br.reduce((acc, r) => acc + r.stars, 0);
      return Math.round((sum / br.length) * 10) / 10;
    },
    [ratings]
  );

  const getArtisanAverage = useCallback(
    (artisanId: string) => {
      const ar = ratings.filter((r) => r.artisanId === artisanId);
      if (ar.length === 0) return null;
      const sum = ar.reduce((acc, r) => acc + r.stars, 0);
      return Math.round((sum / ar.length) * 10) / 10;
    },
    [ratings]
  );

  const hasUserRated = useCallback(
    (businessId: string) => {
      const deviceId = getDeviceId();
      return ratings.some((r) => r.businessId === businessId && r.userName === deviceId.slice(0, 8));
    },
    [ratings]
  );

  const hasUserRatedArtisan = useCallback(
    (artisanId: string) => {
      const deviceId = getDeviceId();
      return ratings.some((r) => r.artisanId === artisanId && r.userName === deviceId.slice(0, 8));
    },
    [ratings]
  );

  const deleteRating = useCallback(async (id: string) => {
    setRatings((prev) => prev.filter((r) => r.id !== id));
    await supabase.from("ratings").delete().eq("id", id);
  }, []);

  return { ratings, addRating, getBusinessRatings, getArtisanRatings, getBusinessAverage, getArtisanAverage, hasUserRated, hasUserRatedArtisan, deleteRating, loaded };
}
