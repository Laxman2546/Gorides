import adminModel from "../models/adminModel.js";
import bcrypt from "bcrypt";
import captianModel from "../models/captainModel.js";
export const getAdmindata = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "emailid is required" });
  }
  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "invalid credentials" });
    }
    return res.status(200).json({
      message: "admin logged in successfully",
      email: admin.email,
    });
  } catch (e) {
    console.log(e, "error while getting user data");
    return res.status(500).json({ error: "error while getting user data" });
  }
};

export const getCaptainData = async (req, res) => {
  try {
    const data = await captianModel.find().populate("userId");
    return res.status(200).json(data);
  } catch (e) {
    console.log(e, "error while getting captain data");
    return res.status(500).json({ error: "error while getting captain data" });
  }
};

export const updateCaptainStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!["approved", "declined"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    const captain = await captianModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!captain) {
      return res.status(404).json({ error: "Captain not found" });
    }
    res.json(captain);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};