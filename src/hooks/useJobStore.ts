"use client";

import { useState, useEffect, useCallback } from "react";
import { Job } from "@/types";
import { supabase } from "@/lib/supabase";

function toCamel(obj: Record<string, unknown>): Job {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    r[k.replace(/_([a-z])/g, (_: string, c: string) => c.toUpperCase())] = v;
  }
  return r as unknown as Job;
}

function toSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    r[k.replace(/[A-Z]/g, (c) => "_" + c.toLowerCase())] = v;
  }
  return r;
}

export function useJobStore() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const PAGE = 1000;
      let from = 0;
      const all: Job[] = [];
      while (true) {
        const { data, error } = await supabase.from("jobs").select("*").range(from, from + PAGE - 1);
        if (error || !data || data.length === 0) break;
        all.push(...data.map(toCamel));
        if (data.length < PAGE) break;
        from += PAGE;
      }
      setAllJobs(all);
      setLoaded(true);
    })();
  }, []);

  const addJob = useCallback(async (job: Job) => {
    setAllJobs((prev) => [job, ...prev]);
    await supabase.from("jobs").upsert(toSnake(job as unknown as Record<string, unknown>));
  }, []);

  const updateJob = useCallback(async (updated: Job) => {
    setAllJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    await supabase.from("jobs").upsert(toSnake(updated as unknown as Record<string, unknown>));
  }, []);

  const deleteJob = useCallback(async (id: string) => {
    setAllJobs((prev) => prev.filter((j) => j.id !== id));
    await supabase.from("jobs").delete().eq("id", id);
  }, []);

  const getJobs = useCallback(() => allJobs, [allJobs]);

  return { allJobs, addJob, updateJob, deleteJob, getJobs, loaded };
}
