import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createRide } from "../controller/rideController.js";

const router = express.Router();

router.post("/create", authMiddleware, createRide);

export default router;
