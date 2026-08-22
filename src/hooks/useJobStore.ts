"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Job } from "@/types";
import { jobs as seedJobs } from "@/data";

const STORAGE_KEY = "espace-meknes-jobs";

function loadJobs(): Job[] {
  if (typeof window === "undefined") return seedJobs;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return seedJobs;
}

function saveJobs(jobs: Job[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export function useJobStore() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loaded, setLoaded] = useState(false);
  const isLocalChange = useRef(false);

  useEffect(() => {
    setAllJobs(loadJobs());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      isLocalChange.current = true;
      saveJobs(allJobs);
      window.dispatchEvent(new Event("espace-meknes-jobs-change"));
      setTimeout(() => { isLocalChange.current = false; }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allJobs, loaded]);

  useEffect(() => {
    const handler = () => {
      if (!isLocalChange.current) {
        setAllJobs(loadJobs());
      }
    };
    window.addEventListener("espace-meknes-jobs-change", handler);
    return () => window.removeEventListener("espace-meknes-jobs-change", handler);
  }, []);

  const addJob = useCallback((job: Job) => {
    setAllJobs((prev) => [job, ...prev]);
  }, []);

  const updateJob = useCallback((updated: Job) => {
    setAllJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
  }, []);

  const deleteJob = useCallback((id: string) => {
    setAllJobs((prev) => prev.filter((j) => j.id !== id));
  }, []);

  const getJobs = useCallback(() => allJobs, [allJobs]);

  return { allJobs, addJob, updateJob, deleteJob, getJobs, loaded };
}
