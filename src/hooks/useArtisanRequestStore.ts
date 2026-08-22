"use client";

import { useState, useEffect, useCallback } from "react";
import { ArtisanRequest } from "@/types";

const STORAGE_KEY = "espace-meknes-artisan-requests";

function loadRequests(): ArtisanRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveRequests(requests: ArtisanRequest[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export function useArtisanRequestStore() {
  const [requests, setRequests] = useState<ArtisanRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRequests(loadRequests());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveRequests(requests);
  }, [requests, loaded]);

  const addRequest = useCallback((req: ArtisanRequest) => {
    setRequests((prev) => [req, ...prev]);
  }, []);

  const updateRequest = useCallback((updated: ArtisanRequest) => {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  }, []);

  const deleteRequest = useCallback((id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { requests, addRequest, updateRequest, deleteRequest, loaded };
}
