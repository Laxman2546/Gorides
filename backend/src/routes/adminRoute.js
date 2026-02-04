import express from "express";
import { getAdmindata } from "../controller/adminController.js";
const router = express.Router();

router.post("/login", getAdmindata);

export default router;
