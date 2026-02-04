import adminModel from "../models/adminModel.js";
import bcrypt from "bcrypt";
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

export default getAdmindata;
