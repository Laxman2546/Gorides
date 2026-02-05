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
  seats: {
    type: Number,
    required: true,
    min: 1,
  },
  bookedSeats: {
    type: Number,
    default: 0,
    min: 0,
  },
  passengers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  bookings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      seats: {
        type: Number,
        default: 1,
        min: 1,
      },
      status: {
        type: String,
        enum: ["pending", "confirmed", "ongoing", "completed", "cancelled", "declined"],
        default: "pending",
      },
      otp: {
        type: String,
      },
      otpExpires: {
        type: Date,
      },
      paymentStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
      },
      paymentOrderId: {
        type: String,
      },
      paymentId: {
        type: String,
      },
      paymentSignature: {
        type: String,
      },
      paymentAmount: {
        type: Number,
      },
      paidAt: {
        type: Date,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
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

export default mongoose.model("Ride", rideSchema);
