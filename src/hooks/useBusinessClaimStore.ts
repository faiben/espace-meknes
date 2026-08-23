"use client";

import { useState, useEffect, useCallback } from "react";
import { BusinessClaim } from "@/types";
import { supabase } from "@/lib/supabase";

function toCamel(obj: Record<string, unknown>): BusinessClaim {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    r[k.replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase())] = v;
  }
  return r as unknown as BusinessClaim;
}

function toSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    r[k.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase())] = v;
  }
  return r;
}

export function useBusinessClaimStore() {
  const [claims, setClaims] = useState<BusinessClaim[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("business_claims").select("*");
      if (data) setClaims(data.map(toCamel));
      setLoaded(true);
    })();
  }, []);

  const addClaim = useCallback(async (claim: Omit<BusinessClaim, "id" | "createdAt" | "status">) => {
    const newClaim: BusinessClaim = {
      ...claim,
      id: `claim-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setClaims((prev) => [newClaim, ...prev]);
    await supabase.from("business_claims").upsert(toSnake(newClaim as unknown as Record<string, unknown>));
    return newClaim;
  }, []);

  const updateClaim = useCallback(async (updated: BusinessClaim) => {
    setClaims((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    await supabase.from("business_claims").upsert(toSnake(updated as unknown as Record<string, unknown>));
  }, []);

  const deleteClaim = useCallback(async (id: string) => {
    setClaims((prev) => prev.filter((c) => c.id !== id));
    await supabase.from("business_claims").delete().eq("id", id);
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
