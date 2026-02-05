import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  captainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Captain",
    required: true,
  },
  pickuppoint: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  distance: {
    type: Number,
  },
  fare: {
    type: Number,
  },
  duration: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "ongoing", "completed", "declined"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
