import runGemini from "../config/gemini.js";
import userModel from "../models/userModel.js";

export const supportChat = async (req, res) => {
  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required" });
    }

    const emailid = req.user?.emailid;
    const user = emailid ? await userModel.findOne({ emailid }).lean() : null;

    const reply = await runGemini(
      message,
      Array.isArray(history) ? history : [],
      { email: user?.emailid, userId: user?._id },
    );

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("supportChat error:", error);
    return res.status(500).json({ error: "Unable to process support chat" });
  }
};
