"use client";

import { useEffect, useRef, useState } from "react";
import { Business } from "@/types";
import { useLang } from "@/contexts/LanguageContext";

interface BusinessMapProps {
  businesses: Business[];
  visible: boolean;
  height?: string;
  center?: [number, number];
  zoom?: number;
  singleMarker?: boolean;
}

export function BusinessMap({ businesses, visible, height = "h-96", center, zoom, singleMarker }: BusinessMapProps) {
  const { isArabic } = useLang();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapRef2 = useRef<any>(null);
  const markersRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const initDoneRef = useRef(false);

  useEffect(() => {
    if (visible && !ready) {
      const timer = setTimeout(() => setReady(true), 100);
      return () => clearTimeout(timer);
    }
    if (!visible) {
      setReady(false);
      initDoneRef.current = false;
    }
  }, [visible]);

  function addMarkers(biz: Business[]) {
    const L = LRef.current;
    const layer = markersRef.current;
    const m = mapRef2.current;
    if (!L || !layer || !m) return;

    layer.clearLayers();

    const valid = biz.filter((b) => b.lat && b.lng && b.lat !== 0 && b.lng !== 0);
    if (valid.length === 0) return;

    const icon = L.divIcon({
      className: "custom-marker",
      html: `<div style="width:14px;height:14px;background:#059669;border:2.5px solid white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    valid.forEach((b) => {
      const marker = L.marker([b.lat, b.lng], { icon }).addTo(layer);
      const name = isArabic ? b.nameAr : b.nameFr;
      marker.bindPopup(`
        <div style="min-width:150px">
          <strong style="font-size:13px">${name}</strong><br/>
          <span style="font-size:11px;color:#666">${b.address}</span><br/>
          <span style="font-size:11px;color:#666">⭐ ${b.rating}</span>
        </div>
      `);
    });

    if (!singleMarker && valid.length > 1) {
      const bounds = L.latLngBounds(valid.map((b) => [b.lat, b.lng] as [number, number]));
      m.fitBounds(bounds, { padding: [30, 30] });
    } else if (singleMarker && valid.length === 1) {
      m.setView([valid[0].lat, valid[0].lng], zoom || 15);
    }
  }

  useEffect(() => {
    if (!ready || !mapRef.current) return;

    let cancelled = false;

    const init = async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current) return;
      LRef.current = L;

      if (initDoneRef.current && mapRef2.current) {
        addMarkers(businesses);
        return;
      }

      const valid = businesses.filter((b) => b.lat && b.lng && b.lat !== 0 && b.lng !== 0);
      if (valid.length === 0) return;

      const m = L.map(mapRef.current!).setView(
        center || [valid[0].lat, valid[0].lng],
        zoom || 13
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(m);
      markersRef.current = L.layerGroup().addTo(m);
      mapRef2.current = m;
      initDoneRef.current = true;

      addMarkers(businesses);

      if (!center && valid.length > 1) {
        const bounds = L.latLngBounds(valid.map((b) => [b.lat, b.lng] as [number, number]));
        m.fitBounds(bounds, { padding: [30, 30] });
      }
    };

    init();

    return () => {
      cancelled = true;
      if (mapRef2.current) {
        mapRef2.current.remove();
        mapRef2.current = null;
        markersRef.current = null;
        LRef.current = null;
        initDoneRef.current = false;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    if (!initDoneRef.current) return;
    addMarkers(businesses);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businesses, isArabic, singleMarker, zoom]);

  if (!visible || businesses.length === 0) return null;

  return (
    <div
      ref={mapRef}
      className={`${height} w-full rounded-2xl overflow-hidden border border-emerald-200`}
      style={{ minHeight: "300px" }}
    />
  );
}
