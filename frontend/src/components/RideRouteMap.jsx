import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { Navigation } from "lucide-react";

export default function RideRouteMap({ ride, isLoaded, buildRoute }) {
  const [points, setPoints] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const loadRoute = async () => {
      const routePoints = await buildRoute(ride);
      if (mounted) setPoints(routePoints);
    };
    loadRoute();
    return () => {
      mounted = false;
    };
  }, [ride, buildRoute]);

  const onLoad = (map) => {
    mapRef.current = map;
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

  return (
    <div className="w-full h-[220px] rounded-xl overflow-hidden border border-gray-200">
      <GoogleMap
        onLoad={onLoad}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        zoom={12}
        center={points[0] || { lat: 17.385, lng: 78.4867 }}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {points.map((p, i) => (
          <Marker
            key={i}
            position={p}
            icon={
              i === 0
                ? {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#10b981",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                  }
                : i === points.length - 1
                  ? {
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 8,
                      fillColor: "#ef4444",
                      fillOpacity: 1,
                      strokeColor: "#ffffff",
                      strokeWeight: 2,
                    }
                  : undefined
            }
          />
        ))}

        {points.length > 1 && (
          <Polyline
            path={points}
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
