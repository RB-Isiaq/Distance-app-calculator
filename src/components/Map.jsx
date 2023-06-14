import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ center, markerPosition }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
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

    if (markerRef.current === null) {
      markerRef.current = L.marker(markerPosition).addTo(mapRef.current);
    } else {
      markerRef.current.setLatLng(markerPosition);
    }
  }, [center, markerPosition]);
  return (
    <div
      id="map"
      style={{ height: "500px" }}
      className="border-[3px]  w-full h-full"
      />
  );
};

export default Map;
