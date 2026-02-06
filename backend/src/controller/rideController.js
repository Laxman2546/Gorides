import ridesModel from "../models/rideModel.js";
import captianModel from "../models/captainModel.js";
import { getDistanceTime } from "../utilis/mapservice.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const parseDistanceKm = (distanceText) => {
  if (!distanceText) return 0;
  const normalized = String(distanceText).replace(/,/g, "");
  const match = normalized.match(/([\d.]+)/);
  return match ? Number(match[1]) : 0;
};

const parseDurationMinutes = (durationText) => {
  if (!durationText) return 0;
  const text = String(durationText).toLowerCase();
  let minutes = 0;
  const dayMatch = text.match(/(\d+)\s*day/);
  const hourMatch = text.match(/(\d+)\s*hour/);
  const minMatch = text.match(/(\d+)\s*min/);
  if (dayMatch) minutes += Number(dayMatch[1]) * 24 * 60;
  if (hourMatch) minutes += Number(hourMatch[1]) * 60;
  if (minMatch) minutes += Number(minMatch[1]);
  if (minutes === 0) {
    const asNumber = text.match(/([\d.]+)/);
    minutes = asNumber ? Number(asNumber[1]) : 0;
  }
  return minutes;
};

const calculatePrice = (distanceKm, durationMin) => {
  const baseFare = 10;
  const perKmRate =
    distanceKm <= 3
      ? 5
      : distanceKm <= 10
        ? 4
        : distanceKm <= 25
          ? 3.5
          : 3.2;
  const distanceCost = distanceKm * perKmRate;
  const timeCost = (durationMin / 60) * 0.6;
  const rawPrice = distanceCost + timeCost + baseFare;
  const minFare = 12;
  const price = Math.max(rawPrice, minFare);
  return { price, baseFare };
};

const generateSixDigitOtp = () =>
  Math.floor(100000 + Math.random() * 9000).toString();

const getRazorpayClient = () => {
  const keyId = process.env.RZP_KEY_ID;
  const keySecret = process.env.RZP_KEY_TEST;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys are missing");
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  const secret = process.env.RZP_KEY_TEST || "";
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expected === signature;
};

export const createRide = async (req, res) => {
  const { pickuppoint, destination, time, date, seats } = req.body;
  const { id } = req.user;
  if (!pickuppoint || !destination || !time || !date || !seats) {
    return res.status(400).json({ error: "all fields are required" });
  }
  const rideDateTime = new Date(`${date}T${time}`);
  if (Number.isNaN(rideDateTime.getTime())) {
    return res.status(400).json({ error: "invalid date or time" });
  }
  if (rideDateTime <= new Date()) {
    return res
      .status(400)
      .json({ error: "ride date and time must be in the future" });
  }
  const seatCount = Number(seats);
  if (!Number.isFinite(seatCount) || seatCount < 1) {
    return res.status(400).json({ error: "invalid seats" });
  }
  try {
    const captain = await captianModel.findOne({ userId: id });
    if (!captain) {
      return res.status(404).json({ error: "captain deatils not found" });
    }
    const distanceData = await getDistanceTime(pickuppoint, destination);
    if (distanceData?.error) {
      return res.status(400).json({ error: "distance not found" });
    }
    const distanceKm = parseDistanceKm(distanceData.distance);
    const durationMin = parseDurationMinutes(distanceData.duration);
    const { price, baseFare } = calculatePrice(distanceKm, durationMin);

    const ride = await ridesModel.create({
      captainId: captain.id,
      pickuppoint,
      destination,
      time,
      date,
      seats: seatCount,
      bookedSeats: 0,
      price,
      distance: distanceKm,
      duration: durationMin,
      fare: baseFare,
    });
    return res.status(201).json(ride);
  } catch (e) {
    console.log(e, "error while creating ride");
    return res.status(500).json({ error: "error while creating ride" });
  }
};

export const listRides = async (req, res) => {
  const { from, to, date } = req.query;
  const query = {};
  if (from) query.pickuppoint = new RegExp(from, "i");
  if (to) query.destination = new RegExp(to, "i");
  if (date) query.date = date;
  try {
    const rides = await ridesModel
      .find(query)
      .populate({
        path: "captainId",
        populate: { path: "userId" },
      })
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json(rides);
  } catch (e) {
    console.log(e, "error while listing rides");
    return res.status(500).json({ error: "error while listing rides" });
  }
};

export const bookRide = async (req, res) => {
  const { id } = req.params;
  const { seats = 1, dropLocation } = req.body;
  const userId = req.user?.id;
  try {
    const ride = await ridesModel.findById(id);
    if (!ride) {
      return res.status(404).json({ error: "ride not found" });
    }
    if (
      ride.bookings?.some(
        (booking) => String(booking.userId) === String(userId),
      )
    ) {
      return res.status(409).json({ error: "already booked" });
    }
    const seatCount = Number(seats);
    const available = ride.seats - ride.bookedSeats;
    if (seatCount < 1 || seatCount > available) {
      return res.status(400).json({ error: "not enough seats" });
    }

    const bookingData = {
      userId,
      seats: seatCount,
      status: "pending",
      paymentStatus: "pending",
    };

    const cleanedDropLocation =
      typeof dropLocation === "string" ? dropLocation.trim() : "";
    if (cleanedDropLocation) {
      bookingData.dropLocation = cleanedDropLocation;
    } else if (ride.destination) {
      bookingData.dropLocation = ride.destination;
    }
    if (
      cleanedDropLocation &&
      cleanedDropLocation.toLowerCase() !==
        String(ride.destination || "").trim().toLowerCase()
    ) {
      const dropDistanceData = await getDistanceTime(
        ride.pickuppoint,
        cleanedDropLocation,
      );
      if (dropDistanceData?.error) {
        return res.status(400).json({ error: "drop location not found" });
      }
      const dropDistanceKm = parseDistanceKm(dropDistanceData.distance);
      const dropDurationMin = parseDurationMinutes(dropDistanceData.duration);
      const { price } = calculatePrice(dropDistanceKm, dropDurationMin);
      bookingData.dropLocation = cleanedDropLocation;
      bookingData.dropDistance = dropDistanceKm;
      bookingData.dropDuration = dropDurationMin;
      bookingData.unitPrice = price;
    }

    ride.passengers = [...(ride.passengers || []), userId];
    ride.bookings = [...(ride.bookings || []), bookingData];
    await ride.save();
    return res.status(200).json(ride);
  } catch (e) {
    console.log(e, "error while booking ride");
    return res.status(500).json({ error: "error while booking ride" });
  }
};

export const myBookings = async (req, res) => {
  const userId = req.user?.id;
  try {
    const rides = await ridesModel
      .find({ "bookings.userId": userId })
      .populate({
        path: "captainId",
        populate: { path: "userId" },
      })
      .sort({ createdAt: -1 })
      .lean();
    const data = rides.map((ride) => {
      const booking = (ride.bookings || []).find(
        (entry) => String(entry.userId) === String(userId),
      );
      return { ...ride, booking };
    });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e, "error while getting bookings");
    return res.status(500).json({ error: "error while getting bookings" });
  }
};

export const listCaptainBookings = async (req, res) => {
  const userId = req.user?.id;
  try {
    const captain = await captianModel.findOne({ userId });
    if (!captain) {
      return res.status(404).json({ error: "captain deatils not found" });
    }
    const rides = await ridesModel
      .find({ captainId: captain._id })
      .populate({
        path: "captainId",
        populate: { path: "userId" },
      })
      .populate("bookings.userId")
      .sort({ createdAt: -1 })
      .lean();
    const data = rides.map((ride) => {
      const destination =
        typeof ride.destination === "string" ? ride.destination.trim() : "";
      const bookings = (ride.bookings || []).map((booking) => {
        if (booking?.dropLocation || !destination) return booking;
        return { ...booking, dropLocation: destination };
      });
      return { ...ride, bookings };
    });
    return res.status(200).json(data);
  } catch (e) {
    console.log(e, "error while listing captain bookings");
    return res
      .status(500)
      .json({ error: "error while listing captain bookings" });
  }
};

export const generateBookingOtp = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  try {
    const ride = await ridesModel.findById(id);
    if (!ride) {
      return res.status(404).json({ error: "ride not found" });
    }
    const booking = (ride.bookings || []).find(
      (entry) => String(entry.userId) === String(userId),
    );
    if (!booking) {
      return res.status(404).json({ error: "booking not found" });
    }
    const otp = generateSixDigitOtp();
    booking.otp = otp;
    booking.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await ride.save();
    return res.status(200).json({
      otp,
      expiresAt: booking.otpExpires,
      bookingId: booking._id,
    });
  } catch (e) {
    console.log(e, "error while generating otp");
    return res.status(500).json({ error: "error while generating otp" });
  }
};

export const startBooking = async (req, res) => {
  const { id } = req.params;
  const { bookingId, otp } = req.body;
  const userId = req.user?.id;
  if (!bookingId || !otp) {
    return res.status(400).json({ error: "bookingId and otp are required" });
  }
  try {
    const captain = await captianModel.findOne({ userId });
    if (!captain) {
      return res.status(404).json({ error: "captain deatils not found" });
    }
    const ride = await ridesModel.findById(id);
    if (!ride) {
      return res.status(404).json({ error: "ride not found" });
    }
    if (String(ride.captainId) !== String(captain._id)) {
      return res.status(403).json({ error: "not authorized" });
    }
    const booking = (ride.bookings || []).find(
      (entry) => String(entry._id) === String(bookingId),
    );
    if (!booking) {
      return res.status(404).json({ error: "booking not found" });
    }
    if (booking.status !== "confirmed") {
      return res.status(400).json({ error: "booking not confirmed" });
    }
    if (!booking.otp || booking.otp !== otp) {
      return res.status(400).json({ error: "invalid otp" });
    }
    if (booking.otpExpires && booking.otpExpires < Date.now()) {
      return res.status(400).json({ error: "otp expired" });
    }
    booking.status = "ongoing";
    await ride.save();
    return res.status(200).json({ message: "ride started", booking });
  } catch (e) {
    console.log(e, "error while starting ride");
    return res.status(500).json({ error: "error while starting ride" });
  }
};

export const acceptBooking = async (req, res) => {
  const { id } = req.params;
  const { bookingId } = req.body;
  const userId = req.user?.id;
  if (!bookingId) {
    return res.status(400).json({ error: "bookingId is required" });
  }
  try {
    const captain = await captianModel.findOne({ userId });
    if (!captain) {
      return res.status(404).json({ error: "captain deatils not found" });
    }
    const ride = await ridesModel.findById(id);
    if (!ride) {
      return res.status(404).json({ error: "ride not found" });
    }
    if (String(ride.captainId) !== String(captain._id)) {
      return res.status(403).json({ error: "not authorized" });
    }
    const booking = (ride.bookings || []).find(
      (entry) => String(entry._id) === String(bookingId),
    );
    if (!booking) {
      return res.status(404).json({ error: "booking not found" });
    }
    if (booking.status === "confirmed") {
      return res.status(200).json({ message: "already confirmed", booking });
    }
    if (booking.status !== "pending") {
      return res.status(400).json({ error: "booking not pending" });
    }
    const available = ride.seats - ride.bookedSeats;
    if (booking.seats > available) {
      return res.status(400).json({ error: "not enough seats" });
    }
    booking.status = "confirmed";
    ride.bookedSeats += booking.seats;

    if (ride.seats === 1) {
      ride.bookings = (ride.bookings || []).map((entry) =>
        String(entry._id) !== String(bookingId) &&
        ["pending", "confirmed"].includes(entry.status)
          ? { ...entry, status: "declined" }
          : entry,
      );
    }
    await ride.save();
    return res.status(200).json({ message: "booking accepted", booking });
  } catch (e) {
    console.log(e, "error while accepting booking");
    return res.status(500).json({ error: "error while accepting booking" });
  }
};

export const declineBooking = async (req, res) => {
  const { id } = req.params;
  const { bookingId } = req.body;
  const userId = req.user?.id;
  if (!bookingId) {
    return res.status(400).json({ error: "bookingId is required" });
  }
  try {
    const captain = await captianModel.findOne({ userId });
    if (!captain) {
      return res.status(404).json({ error: "captain deatils not found" });
    }
    const ride = await ridesModel.findById(id);
    if (!ride) {
      return res.status(404).json({ error: "ride not found" });
    }
    if (String(ride.captainId) !== String(captain._id)) {
      return res.status(403).json({ error: "not authorized" });
    }
    const booking = (ride.bookings || []).find(
      (entry) => String(entry._id) === String(bookingId),
    );
    if (!booking) {
      return res.status(404).json({ error: "booking not found" });
    }
    if (booking.status !== "pending") {
      return res.status(400).json({ error: "booking not pending" });
    }
    booking.status = "declined";
    await ride.save();
    return res.status(200).json({ message: "booking declined", booking });
  } catch (e) {
    console.log(e, "error while declining booking");
    return res.status(500).json({ error: "error while declining booking" });
  }
};

export const completeBooking = async (req, res) => {
  const { id } = req.params;
  const { bookingId } = req.body;
  const userId = req.user?.id;
  if (!bookingId) {
    return res.status(400).json({ error: "bookingId is required" });
  }
  try {
    const captain = await captianModel.findOne({ userId });
    if (!captain) {
      return res.status(404).json({ error: "captain deatils not found" });
    }
    const ride = await ridesModel.findById(id);
    if (!ride) {
      return res.status(404).json({ error: "ride not found" });
    }
    if (String(ride.captainId) !== String(captain._id)) {
      return res.status(403).json({ error: "not authorized" });
    }
    const booking = (ride.bookings || []).find(
      (entry) => String(entry._id) === String(bookingId),
    );
    if (!booking) {
      return res.status(404).json({ error: "booking not found" });
    }
    booking.status = "completed";
    booking.paymentStatus = "pending";
    await ride.save();
    if (
      ride.seats === 1 &&
      booking.dropLocation &&
      String(booking.dropLocation).trim().toLowerCase() !==
        String(ride.destination || "").trim().toLowerCase()
    ) {
      const remainderDistanceData = await getDistanceTime(
        booking.dropLocation,
        ride.destination,
      );
      if (!remainderDistanceData?.error) {
        const remainderDistanceKm = parseDistanceKm(
          remainderDistanceData.distance,
        );
        const remainderDurationMin = parseDurationMinutes(
          remainderDistanceData.duration,
        );
        const { price: remainderPrice, baseFare: remainderFare } =
          calculatePrice(remainderDistanceKm, remainderDurationMin);
        const now = new Date();
        const remainderMinutes = Math.max(1, Math.round(remainderDurationMin));
        const startAt = new Date(now.getTime() + remainderMinutes * 60 * 1000);
        const remainderDate = startAt.toISOString().slice(0, 10);
        const remainderTime = startAt.toTimeString().slice(0, 5);
        await ridesModel.create({
          captainId: ride.captainId,
          pickuppoint: booking.dropLocation,
          destination: ride.destination,
          time: remainderTime,
          date: remainderDate,
          seats: 1,
          bookedSeats: 0,
          price: remainderPrice,
          distance: remainderDistanceKm,
          duration: remainderDurationMin,
          fare: remainderFare,
        });
      }
    }
    return res.status(200).json({ message: "ride completed", booking });
  } catch (e) {
    console.log(e, "error while completing ride");
    return res.status(500).json({ error: "error while completing ride" });
  }
};

export const payForBooking = async (req, res) => {
  const { id } = req.params;
  const {
    bookingId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
  } = req.body;
  const userId = req.user?.id;
  if (!bookingId) {
    return res.status(400).json({ error: "bookingId is required" });
  }
  try {
    const ride = await ridesModel.findById(id);
    if (!ride) {
      return res.status(404).json({ error: "ride not found" });
    }
    const booking = (ride.bookings || []).find(
      (entry) => String(entry._id) === String(bookingId),
    );
    if (!booking || String(booking.userId) !== String(userId)) {
      return res.status(404).json({ error: "booking not found" });
    }
    if (booking.status !== "completed") {
      return res.status(400).json({ error: "booking not completed" });
    }
    if (
      razorpayPaymentId &&
      razorpayOrderId &&
      razorpaySignature
    ) {
      const valid = verifyRazorpaySignature({
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      });
      if (!valid) {
        return res.status(400).json({ error: "invalid payment signature" });
      }
      booking.paymentStatus = "paid";
      booking.paymentId = razorpayPaymentId;
      booking.paymentOrderId = razorpayOrderId;
      booking.paymentSignature = razorpaySignature;
      booking.paidAt = new Date();
      await ride.save();
      return res.status(200).json({ message: "payment completed", booking });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(200).json({ message: "already paid", booking });
    }

    const seatCount = Number(booking.seats || 1);
    const basePrice = Number(booking.unitPrice || ride.price || 0);
    const amount = Math.round(basePrice * seatCount * 100);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: "invalid amount" });
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `booking_${booking._id}`,
      notes: {
        rideId: String(ride._id),
        bookingId: String(booking._id),
        userId: String(userId),
      },
    });

    booking.paymentOrderId = order.id;
    booking.paymentAmount = amount;
    await ride.save();

    return res.status(200).json({
      keyId: process.env.RZP_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking._id,
    });
  } catch (e) {
    console.log(e, "error while paying for ride");
    return res.status(500).json({ error: "error while paying for ride" });
  }
};
