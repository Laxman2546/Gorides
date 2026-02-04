import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  emailid: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailOtp: {
    type: String,
  },
  emailOtpExpires: {
    type: Date,
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
