"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Ad } from "@/types";
import { ads as seedAds } from "@/data";

const STORAGE_KEY = "espace-meknes-ads";
const CHANGE_EVENT = "em-ads-changed";

function readFromStorage(): Ad[] {
  if (typeof window === "undefined") return seedAds;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return seedAds;
}

function writeToStorage(list: Ad[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useAdStore() {
  const [allAds, setAllAds] = useState<Ad[]>([]);
  const isLocalChange = useRef(false);

  useEffect(() => {
    setAllAds(readFromStorage());

    const handleChange = () => {
      if (!isLocalChange.current) {
        setAllAds(readFromStorage());
      }
      isLocalChange.current = false;
    };
    window.addEventListener(CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(CHANGE_EVENT, handleChange);
  }, []);

  const addAd = useCallback((ad: Ad) => {
    setAllAds((prev) => {
      const next = [ad, ...prev];
      isLocalChange.current = true;
      writeToStorage(next);
      return next;
    });
  }, []);

  const updateAd = useCallback((updated: Ad) => {
    setAllAds((prev) => {
      const next = prev.map((a) => (a.id === updated.id ? updated : a));
      isLocalChange.current = true;
      writeToStorage(next);
      return next;
    });
  }, []);

  const deleteAd = useCallback((id: string) => {
    setAllAds((prev) => {
      const next = prev.filter((a) => a.id !== id);
      isLocalChange.current = true;
      writeToStorage(next);
      return next;
    });
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
