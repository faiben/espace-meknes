"use client";

import { useState, useEffect, useCallback } from "react";
import { AppSettings } from "@/types";
import { supabase } from "@/lib/supabase";

const DEFAULTS: AppSettings = {
  whatsappNumber: "+212600000000",
  supportEmail: "admin@espace-meknes.ma",
  adsEnabled: true,
};

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("app_settings").select("*").eq("id", "main").single();
      if (data) {
        setSettings({
          whatsappNumber: data.whatsapp_number || DEFAULTS.whatsappNumber,
          supportEmail: data.support_email || DEFAULTS.supportEmail,
          adsEnabled: data.ads_enabled ?? DEFAULTS.adsEnabled,
        });
      }
      setLoaded(true);
    })();
  }, []);

  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      supabase.from("app_settings").upsert({
        id: "main",
        whatsapp_number: next.whatsappNumber,
        support_email: next.supportEmail,
        ads_enabled: next.adsEnabled,
      });
      return next;
    });
  }, []);

  return { settings, updateSettings, loaded };
}
