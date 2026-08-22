"use client";

import { useState, useEffect, useCallback } from "react";
import { Business } from "@/types";
import { supabase } from "@/lib/supabase";

export function useBusinessStore() {
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("businesses").select("*");
      if (data) setAllBusinesses(data as Business[]);
      setLoaded(true);
    })();
  }, []);

  const addBusiness = useCallback(async (b: Business) => {
    setAllBusinesses((prev) => [b, ...prev]);
    await supabase.from("businesses").upsert(b);
  }, []);

  const updateBusiness = useCallback(async (updated: Business) => {
    setAllBusinesses((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    await supabase.from("businesses").upsert(updated);
  }, []);

  const deleteBusiness = useCallback(async (id: string) => {
    setAllBusinesses((prev) => prev.filter((b) => b.id !== id));
    await supabase.from("businesses").delete().eq("id", id);
  }, []);

  return { allBusinesses, addBusiness, updateBusiness, deleteBusiness };
}
