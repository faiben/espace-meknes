"use client";

import { useState, useEffect, useCallback } from "react";
import { Business } from "@/types";
import { supabase } from "@/lib/supabase";

function toSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    r[k.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase())] = v;
  }
  return r;
}

function toCamel(obj: Record<string, unknown>): Business {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const camel = k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
    r[camel] = v;
  }
  return r as unknown as Business;
}

async function fetchAllBusinesses(): Promise<Business[]> {
  const PAGE = 1000;
  let from = 0;
  const all: Business[] = [];
  while (true) {
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .range(from, from + PAGE - 1);
    if (error || !data || data.length === 0) break;
    all.push(...data.map(toCamel));
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

export function useBusinessStore() {
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await fetchAllBusinesses();
      setAllBusinesses(data);
      setLoaded(true);
    })();
  }, []);

  const addBusiness = useCallback(async (b: Business) => {
    setAllBusinesses((prev) => [b, ...prev]);
    await supabase.from("businesses").upsert(toSnake(b as unknown as Record<string, unknown>));
  }, []);

  const updateBusiness = useCallback(async (updated: Business) => {
    setAllBusinesses((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    await supabase.from("businesses").upsert(toSnake(updated as unknown as Record<string, unknown>));
  }, []);

  const deleteBusiness = useCallback(async (id: string) => {
    setAllBusinesses((prev) => prev.filter((b) => b.id !== id));
    await supabase.from("businesses").delete().eq("id", id);
  }, []);

  return { allBusinesses, addBusiness, updateBusiness, deleteBusiness };
}
