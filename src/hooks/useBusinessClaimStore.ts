"use client";

import { useState, useEffect, useCallback } from "react";
import { BusinessClaim } from "@/types";
import { supabase } from "@/lib/supabase";

export function useBusinessClaimStore() {
  const [claims, setClaims] = useState<BusinessClaim[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("business_claims").select("*");
      if (data) setClaims(data as BusinessClaim[]);
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
    await supabase.from("business_claims").upsert(newClaim);
    return newClaim;
  }, []);

  const updateClaim = useCallback(async (updated: BusinessClaim) => {
    setClaims((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    await supabase.from("business_claims").upsert(updated);
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
