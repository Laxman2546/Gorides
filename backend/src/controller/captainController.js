import captianModel from "../models/captainModel.js";

export const createCaptain = async (req, res) => {
  const { dlNumber, vehicleName, vehicleNumber } = req.body;
  const { id } = req.user;
  if (!dlNumber || !vehicleName || !vehicleNumber) {
    return res.status(400).json({ error: "all fields are required" });
  }
  const isExisted = await captianModel.findOne({ userId: id });
  if (isExisted) {
    return res
      .status(400)
      .json({ error: "captain already existed with this userid" });
  }
  try {
    const captain = await captianModel.create({
      userId: id,
      licenceNumber: dlNumber,
      vehicleName,
      vehicleNumber,
    });
    return res.status(201).json(captain);
  } catch (e) {
    console.log(e, "error while creating captain");
    return res.status(500).json({ error: "error while creating captain" });
  }
};
