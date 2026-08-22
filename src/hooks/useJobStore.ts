"use client";

import { useState, useEffect, useCallback } from "react";
import { Job } from "@/types";
import { supabase } from "@/lib/supabase";

export function useJobStore() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("jobs").select("*");
      if (data) setAllJobs(data as Job[]);
      setLoaded(true);
    })();
  }, []);

  const addJob = useCallback(async (job: Job) => {
    setAllJobs((prev) => [job, ...prev]);
    await supabase.from("jobs").upsert(job);
  }, []);

  const updateJob = useCallback(async (updated: Job) => {
    setAllJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    await supabase.from("jobs").upsert(updated);
  }, []);

  const deleteJob = useCallback(async (id: string) => {
    setAllJobs((prev) => prev.filter((j) => j.id !== id));
    await supabase.from("jobs").delete().eq("id", id);
  }, []);

  const getJobs = useCallback(() => allJobs, [allJobs]);

  return { allJobs, addJob, updateJob, deleteJob, getJobs, loaded };
}
