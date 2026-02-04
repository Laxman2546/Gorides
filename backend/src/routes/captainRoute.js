import express from "express";
import { createCaptain } from "../controller/captainController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create", authMiddleware, createCaptain);

export default router;
