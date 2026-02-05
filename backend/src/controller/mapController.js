import {
  getAddressCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
} from "../utilis/mapservice.js";
export const getCordinates = async (req, res) => {
  const { address } = req.query;
  try {
    const cordinates = await getAddressCoordinates(address);
    return res.status(200).json(cordinates);
  } catch (e) {
    console.log(e, "error while getting cordinates");
    return res.status(404).json({ error: "cordinate not found" });
  }
};
export const distanceCalcutaion = async (req, res) => {
  const { origin, destination } = req.query;
  if (!origin || !destination) {
    return res.status(400).json({ error: "origin or destination required" });
  }
  try {
    const distance = await getDistanceTime(origin, destination);
    return res.status(200).json(distance);
  } catch (e) {
    console.log(e, "error while getting distance");
    return res.status(404).json({ error: "distance not found" });
  }
};

export const getSuggestions = async (req, res) => {
  const { query } = req.query;
  try {
    const suggestions = await getAutoCompleteSuggestions(query);
    return res.status(200).json(suggestions);
  } catch (e) {
    console.log(e, "error while getting suggestions");
    return res.status(404).json({ error: "suggestions not found" });
  }
};
