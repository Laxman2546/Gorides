import React, { useMemo, useRef } from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { Navigation } from "lucide-react";

const normalizeLocation = (location) => {
  if (!location) return null;
  if (typeof location.lat === "number" && typeof location.lng === "number") {
    return { lat: location.lat, lng: location.lng };
  }
  if (
    typeof location.latitude === "number" &&
    typeof location.longitude === "number"
  ) {
    return { lat: location.latitude, lng: location.longitude };
  }
  if (Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
    const [lng, lat] = location.coordinates;
    if (typeof lat === "number" && typeof lng === "number") {
      return { lat, lng };
    }
  }
  return null;
};

export default function RideLiveLocationMap({
  isLoaded,
  otherLocation,
  otherLabel,
  selfLabel,
  selfLocation,
  locationError,
}) {
  const mapRef = useRef(null);

  const normalizedOther = useMemo(
    () => normalizeLocation(otherLocation),
    [otherLocation],
  );

  const onLoad = (map) => {
    mapRef.current = map;
    const points = [selfLocation, normalizedOther].filter(Boolean);
    if (points.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      points.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-[220px] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Navigation size={24} className="text-emerald-600 animate-pulse" />
          </div>
          <p className="text-sm text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  if (!selfLocation && locationError) {
    return (
      <div className="h-[220px] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500">{locationError}</p>
      </div>
    );
  }

  if (!selfLocation) {
    return (
      <div className="h-[220px] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500">Fetching current location...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[220px] rounded-xl overflow-hidden border border-gray-200">
      <GoogleMap
        onLoad={onLoad}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        zoom={13}
        center={selfLocation}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker
          position={selfLocation}
          label={selfLabel}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#10b981",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          }}
        />
        {normalizedOther && (
          <Marker
            position={normalizedOther}
            label={otherLabel}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#3b82f6",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
          />
        )}
        {normalizedOther && (
          <Polyline
            path={[selfLocation, normalizedOther]}
            options={{
              strokeColor: "#10b981",
              strokeOpacity: 1,
              strokeWeight: 4,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
