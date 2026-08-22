"use client";

import { useState, useEffect, useCallback } from "react";
import { Business } from "@/types";
import { businesses as seedBusinesses } from "@/data";

const STORAGE_KEY = "espace-meknes-businesses";
const CHANGE_EVENT = "em-businesses-changed";

function readFromStorage(): Business[] {
  if (typeof window === "undefined") return seedBusinesses;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return seedBusinesses;
}

function writeToStorage(list: Business[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useBusinessStore() {
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    setAllBusinesses(readFromStorage());

    const handleChange = () => {
      setAllBusinesses(readFromStorage());
    };
    window.addEventListener(CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(CHANGE_EVENT, handleChange);
  }, []);

  const addBusiness = useCallback((b: Business) => {
    setAllBusinesses((prev) => {
      const next = [b, ...prev];
      writeToStorage(next);
      return next;
    });
  }, []);

  const updateBusiness = useCallback((updated: Business) => {
    setAllBusinesses((prev) => {
      const next = prev.map((b) => (b.id === updated.id ? updated : b));
      writeToStorage(next);
      return next;
    });
  }, []);

  const deleteBusiness = useCallback((id: string) => {
    setAllBusinesses((prev) => {
      const next = prev.filter((b) => b.id !== id);
      writeToStorage(next);
      return next;
    });
  }, []);

  return { allBusinesses, addBusiness, updateBusiness, deleteBusiness };
}
