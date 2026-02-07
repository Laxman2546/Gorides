import express from "express";
import { supportChat } from "../controller/supportController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/chat", authMiddleware, supportChat);

export default router;
