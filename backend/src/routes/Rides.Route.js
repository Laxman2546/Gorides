import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  bookRide,
  createRide,
  listRides,
  listCaptainBookings,
  myBookings,
  generateBookingOtp,
  startBooking,
  acceptBooking,
  declineBooking,
  completeBooking,
  payForBooking,
} from "../controller/rideController.js";

const router = express.Router();

router.post("/create", authMiddleware, createRide);
router.get("/list", authMiddleware, listRides);
router.post("/book/:id", authMiddleware, bookRide);
router.get("/my", authMiddleware, myBookings);
router.get("/captain/bookings", authMiddleware, listCaptainBookings);
router.post("/booking/:id/otp", authMiddleware, generateBookingOtp);
router.post("/booking/:id/accept", authMiddleware, acceptBooking);
router.post("/booking/:id/decline", authMiddleware, declineBooking);
router.post("/booking/:id/start", authMiddleware, startBooking);
router.post("/booking/:id/complete", authMiddleware, completeBooking);
router.post("/booking/:id/pay", authMiddleware, payForBooking);

export default router;
