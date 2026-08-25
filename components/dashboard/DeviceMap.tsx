"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    naver: any;
  }
}

export type DeviceMarker = {
  id: string;
  lat: number;
  lng: number;
  status: "active" | "check_needed" | "ended";
  name?: string;
};

export type DeviceMapHandle = {
  zoomIn: () => void;
  zoomOut: () => void;
  fitAll: () => void;
};

const STATUS_COLOR: Record<DeviceMarker["status"], string> = {
  active: "#1E5BFF",
  check_needed: "#F59E0B",
  ended: "#9CA3AF",
};

const DeviceMap = forwardRef<DeviceMapHandle, { devices: DeviceMarker[] }>(function DeviceMap(
  { devices },
  ref
) {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapObjRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // 지도 최초 생성
  useEffect(() => {
    if (!scriptLoaded || !mapElRef.current || !window.naver || mapObjRef.current) return;

    const center = devices.length
      ? new window.naver.maps.LatLng(devices[0].lat, devices[0].lng)
      : new window.naver.maps.LatLng(37.5665, 126.978); // 서울시청 기본값

    mapObjRef.current = new window.naver.maps.Map(mapElRef.current, {
      center,
      zoom: 11,
      zoomControl: false,
    });
  }, [scriptLoaded, devices]);

  // devices 변경 시 마커 갱신
  useEffect(() => {
    if (!mapObjRef.current || !window.naver) return;
    const map = mapObjRef.current;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    devices.forEach((d) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(d.lat, d.lng),
        map,
        icon: {
          content: `<div style="width:16px;height:16px;border-radius:50% 50% 50% 4px;transform:rotate(-45deg);background:${STATUS_COLOR[d.status]};box-shadow:0 4px 10px -4px ${STATUS_COLOR[d.status]}99,0 0 0 3px #fff;"></div>`,
          anchor: new window.naver.maps.Point(8, 8),
        },
      });

      if (d.name) {
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `<div style="padding:6px 10px;font-size:12.5px;font-weight:600;">${d.name}</div>`,
          borderWidth: 0,
        });
        window.naver.maps.Event.addListener(marker, "click", () => {
          if (infoWindow.getMap()) infoWindow.close();
          else infoWindow.open(map, marker);
        });
      }

      markersRef.current.push(marker);
    });

    if (devices.length > 1 && window.naver) {
      const bounds = new window.naver.maps.LatLngBounds();
      devices.forEach((d) => bounds.extend(new window.naver.maps.LatLng(d.lat, d.lng)));
      map.fitBounds(bounds);
    }
  }, [devices]);

  useImperativeHandle(ref, () => ({
    zoomIn: () => mapObjRef.current?.setZoom(mapObjRef.current.getZoom() + 1),
    zoomOut: () => mapObjRef.current?.setZoom(mapObjRef.current.getZoom() - 1),
    fitAll: () => {
      if (!mapObjRef.current || !window.naver || devices.length === 0) return;
      const bounds = new window.naver.maps.LatLngBounds();
      devices.forEach((d) => bounds.extend(new window.naver.maps.LatLng(d.lat, d.lng)));
      mapObjRef.current.fitBounds(bounds);
    },
  }));

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={mapElRef} style={{ width: "100%", height: "100%" }} />
    </>
  );
});

export default DeviceMap;