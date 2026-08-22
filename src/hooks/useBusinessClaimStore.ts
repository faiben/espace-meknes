"use client";

import { useState, useEffect, useCallback } from "react";
import { BusinessClaim } from "@/types";

const STORAGE_KEY = "espace-meknes-claims";

function loadClaims(): BusinessClaim[] {
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

function saveClaims(claims: BusinessClaim[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
}

export function useBusinessClaimStore() {
  const [claims, setClaims] = useState<BusinessClaim[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setClaims(loadClaims());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveClaims(claims);
  }, [claims, loaded]);

  const addClaim = useCallback((claim: Omit<BusinessClaim, "id" | "createdAt" | "status">) => {
    const newClaim: BusinessClaim = {
      ...claim,
      id: `claim-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setClaims((prev) => [newClaim, ...prev]);
    return newClaim;
  }, []);

  const updateClaim = useCallback((updated: BusinessClaim) => {
    setClaims((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  const deleteClaim = useCallback((id: string) => {
    setClaims((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getClaimForBusiness = useCallback(
    (businessId: string) => claims.find((c) => c.businessId === businessId),
    [claims]
  );

  const getClaimForUser = useCallback(
    (userId: string) => claims.find((c) => c.userId === userId),
    [claims]
  );

  return { claims, addClaim, updateClaim, deleteClaim, getClaimForBusiness, getClaimForUser, loaded };
}
