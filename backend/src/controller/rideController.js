import ridesModel from "../models/rideModel.js";
import captianModel from "../models/captainModel.js";
import { getDistanceTime } from "../utilis/mapservice.js";
export const createRide = async () => {
  const { pickuppoint, destination, time, date } = req.body;
  const { id } = req.user;
  if (!pickuppoint || !destination || !time || !date) {
    return res.status(400).json({ error: "all fields are required" });
  }
  try {
    const captain = await captianModel.findOne({ userId: id });
    if (!captain) {
      return res.status(404).json({ error: "captain deatils not found" });
    }
    const { distance, duration } = await getDistanceTime(
      pickuppoint,
      destination
    );
    const baseFare = 2;
    const distanceCost = distance * 1.5;
    const timeCost = (duration / 60) * 0.2;
    const price = distanceCost + timeCost + baseFare;
    const ride = await ridesModel.create({
      captainId: captain.id,
      pickuppoint,
      destination,
      time,
      date,
      price,
      distance,
      duration,
      fare: baseFare,
    });
    return res.status(201).json(ride);
  } catch (e) {
    console.log(e, "error while creating ride");
    return res.status(500).json({ error: "error while creating ride" });
  }
};

