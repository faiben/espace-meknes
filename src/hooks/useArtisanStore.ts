"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArtisanProfile } from "@/types";
import { artisans as seedArtisans } from "@/data";

const STORAGE_KEY = "espace-meknes-artisans";

function loadArtisans(): ArtisanProfile[] {
  if (typeof window === "undefined") return seedArtisans;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return seedArtisans;
}

function saveAndNotify(artisanList: ArtisanProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(artisanList));
  window.dispatchEvent(new CustomEvent("em-artisans-changed"));
}

export function useArtisanStore() {
  const [allArtisans, setAllArtisans] = useState<ArtisanProfile[]>(loadArtisans);
  const [loaded, setLoaded] = useState(false);
  const isLocalChange = useRef(false);

  useEffect(() => {
    setAllArtisans(loadArtisans());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      isLocalChange.current = true;
      saveAndNotify(allArtisans);
      const t = setTimeout(() => { isLocalChange.current = false; }, 100);
      return () => clearTimeout(t);
    }
  }, [allArtisans, loaded]);

  useEffect(() => {
    const handler = () => {
      if (!isLocalChange.current) {
        setAllArtisans(loadArtisans());
      }
    };
    window.addEventListener("em-artisans-changed", handler);
    return () => window.removeEventListener("em-artisans-changed", handler);
  }, []);

  const addArtisan = useCallback((artisan: ArtisanProfile) => {
    setAllArtisans((prev) => [artisan, ...prev]);
  }, []);

  const updateArtisan = useCallback((updated: ArtisanProfile) => {
    setAllArtisans((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  }, []);

  const deleteArtisan = useCallback((id: string) => {
    setAllArtisans((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { allArtisans, addArtisan, updateArtisan, deleteArtisan, loaded };
}
