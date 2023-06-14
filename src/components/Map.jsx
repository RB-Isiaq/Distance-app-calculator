import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.js";

const Map = ({ center, markerPosition, distance }) => {
  const mapRef = useRef(null);
  const centerMarkerRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = L.map("map", {
        center: center,
        zoom: 10,
        layers: [
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
          }),
        ],
      });
    } else {
      mapRef.current.setView(center, 10);
    }

    if (centerMarkerRef.current === null) {
      centerMarkerRef.current = L.marker(center, {
        icon: L.icon({
          iconUrl: "/pin.jpg",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        }),
      }).addTo(mapRef.current);
    } else {
      centerMarkerRef.current.setLatLng(center);
    }

    if (markerRef.current === null) {
      markerRef.current = L.marker(markerPosition, {
        icon: L.icon({
          iconUrl: "/icon.png",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        }),
      }).addTo(mapRef.current);
    } else {
      markerRef.current.setLatLng(markerPosition);
    }

    if (polylineRef.current === null) {
      polylineRef.current = L.polyline([center, markerPosition], {
        color: "red",
      }).addTo(mapRef.current);
    } else {
      polylineRef.current.setLatLngs([center, markerPosition]);
    }

    if (tooltipRef.current === null) {
      tooltipRef.current = L.tooltip({
        permanent: true,
        direction: "center",
        className: "custom-tooltip bg-transparent mt-2",
      }).setContent(distance);

      polylineRef.current.bindTooltip(tooltipRef.current).openTooltip();
    } else {
      tooltipRef.current.setContent(distance);
    }
  }, [center, markerPosition, distance]);

  return (
    <div
      id="map"
      style={{ height: "500px" }}
      className="border-[3px]  w-full h-full"
    />
  );
};

export default Map;
