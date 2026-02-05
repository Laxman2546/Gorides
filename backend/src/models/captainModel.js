import mongoose from "mongoose";

const captainSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  licenceNumber: {
    type: String,
  },
  vehicleNumber: {
    type: String,
  },
  vehicleName: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "declined"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Captain", captainSchema);
