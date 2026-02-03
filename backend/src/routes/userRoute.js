import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
} from "../controller/authController.js";
const router = express.Router();

router.post("/api/register", createUser);
router.post("/api/login", loginUser);
router.get("/api/logout", logoutUser);
export default router;
