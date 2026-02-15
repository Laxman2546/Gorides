import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Navigation } from "lucide-react";

export default function RideRouteMap({ ride, isLoaded }) {
  const [directions, setDirections] = useState(null);
  const [directionsOptions, setDirectionsOptions] = useState(null);

  useEffect(() => {
    if (!ride || !ride.route || ride.route.length < 2) {
      return;
    }

    const origin = ride.route[0];
    const destination = ride.route[ride.route.length - 1];
    const waypoints = ride.route.slice(1, -1).map((location) => ({
      location,
      stopover: true,
    }));

    setDirectionsOptions({
      origin,
      destination,
      waypoints,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });
  }, [ride]);

  const directionsCallback = (response, status) => {
    if (status === "OK" && response) {
      setDirections(response);
    } else {
      console.error(`Directions request failed due to ${status}`);
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
        mapContainerStyle={{ width: "100%", height: "100%" }}
        zoom={6}
        center={{ lat: 17.385, lng: 78.4867 }} // Default center
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {directionsOptions && !directions && (
          <DirectionsService
            options={directionsOptions}
            callback={directionsCallback}
          />
        )}
        {directions && (
          <DirectionsRenderer
            options={{
              directions,
              suppressMarkers: false, // Set to true if you want to use custom markers
              polylineOptions: {
                strokeColor: "#10b981",
                strokeOpacity: 1,
                strokeWeight: 4,
              },
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}
