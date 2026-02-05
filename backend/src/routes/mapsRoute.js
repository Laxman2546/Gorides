import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getCordinates,
  distanceCalcutaion,
  getSuggestions,
} from "../controller/mapController.js";
const router = express.Router();

router.get("/getcordinates", authMiddleware, getCordinates);
router.get("/getdistancetime", authMiddleware, distanceCalcutaion);
router.get("/getsuggestions", authMiddleware, getSuggestions);
export default router;
