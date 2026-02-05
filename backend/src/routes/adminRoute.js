import express from "express";
import {
  getAdmindata,
  getCaptainData,
  updateCaptainStatus,
} from "../controller/adminController.js";
const router = express.Router();

router.post("/login", getAdmindata);
router.get("/getCaptain", getCaptainData);
router.post("/update", updateCaptainStatus);
export default router;
