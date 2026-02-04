import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  sendEmailOtp,
  verifyEmailOtp,
  getUserData,
} from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/api/register", createUser);
router.post("/api/login", loginUser);
router.get("/api/logout", logoutUser);
router.post("/api/sendotp", sendEmailOtp);
router.post("/api/verifyotp", verifyEmailOtp);
router.get("/api/getuser", authMiddleware, getUserData);
export default router;
