import axios from "axios";

export const getAddressCoordinates = async (address) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: process.env.GOOGLEMAPS_API,
        },
      },
    );

    const data = response.data;
    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error("Geocoding API error: " + data.status);
    }
  } catch (error) {
    console.error("Error getting coordinates:", error);
    throw error;
  }
};

export const getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("origin or destination required");
  }
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        params: {
          origins: origin,
          destinations: destination,
          key: process.env.GOOGLEMAPS_API,
        },
      },
    );
    const data = response.data;
    if (data.status === "OK") {
      const distance = data.rows[0].elements[0].distance.text;
      const duration = data.rows[0].elements[0].duration.text;
      return { distance, duration };
    } else {
      return { error: "distance not found" };
    }
  } catch (e) {
    console.log(e, "error while getting distance");
    return { error: "distance not found" };
  }
};

export const getAutoCompleteSuggestions = async (query) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input: query,
          key: process.env.GOOGLEMAPS_API,
        },
      },
    );
    return response.data.predictions;
  } catch (e) {
    console.log(e, "error while getting suggestions");
    return { error: "no suggestions found" };
  }
};
