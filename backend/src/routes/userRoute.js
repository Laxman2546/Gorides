import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  sendEmailOtp,
  verifyEmailOtp,
} from "../controller/authController.js";
const router = express.Router();

router.post("/api/register", createUser);
router.post("/api/login", loginUser);
router.get("/api/logout", logoutUser);
router.post("/api/sendotp", sendEmailOtp);
router.post("/api/verifyotp", verifyEmailOtp);
export default router;
