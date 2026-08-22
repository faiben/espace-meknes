"use client";

import { useEffect, useRef, useState } from "react";
import { Business } from "@/types";
import { useLang } from "@/contexts/LanguageContext";

interface BusinessMapProps {
  businesses: Business[];
  visible: boolean;
  height?: string;
}

export function BusinessMap({ businesses, visible, height = "h-96" }: BusinessMapProps) {
  const { isArabic } = useLang();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (visible && !ready) {
      const timer = setTimeout(() => setReady(true), 100);
      return () => clearTimeout(timer);
    }
    if (!visible) {
      setReady(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!ready || !mapRef.current || businesses.length === 0) return;

    let cancelled = false;

    const init = async () => {
      const L = (await import("leaflet")).default;

      if (cancelled || !mapRef.current) return;

      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }

      const validBusinesses = businesses.filter(
        (b) => b.lat && b.lng && b.lat !== 0 && b.lng !== 0
      );

      if (validBusinesses.length === 0) return;

      const avgLat = validBusinesses.reduce((s, b) => s + b.lat, 0) / validBusinesses.length;
      const avgLng = validBusinesses.reduce((s, b) => s + b.lng, 0) / validBusinesses.length;

      const m = L.map(mapRef.current).setView([avgLat, avgLng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(m);

      const defaultIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="width:14px;height:14px;background:#059669;border:2.5px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      validBusinesses.forEach((b) => {
        const marker = L.marker([b.lat, b.lng], { icon: defaultIcon }).addTo(m);
        const name = isArabic ? b.nameAr : b.nameFr;
        marker.bindPopup(`
          <div style="min-width:150px">
            <strong style="font-size:13px">${name}</strong><br/>
            <span style="font-size:11px;color:#666">${b.address}</span><br/>
            <span style="font-size:11px;color:#666">⭐ ${b.rating}</span>
          </div>
        `);
      });

      const bounds = L.latLngBounds(validBusinesses.map((b) => [b.lat, b.lng] as [number, number]));
      m.fitBounds(bounds, { padding: [30, 30] });

      mapInstanceRef.current = m;
    };

    init();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, [ready, businesses, isArabic]);

  if (!visible || businesses.length === 0) return null;

  return (
    <div
      ref={mapRef}
      className={`${height} w-full rounded-2xl overflow-hidden border border-emerald-200`}
      style={{ minHeight: "300px" }}
    />
  );
}
