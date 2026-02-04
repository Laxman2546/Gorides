import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
export const createUser = async (req, res) => {
  const { username, emailid, password } = req.body;
  if (!username || !emailid || !password) {
    return res.status(400).json({ error: "all fields are required" });
  }
  try {
    console.log(emailid);
    const isExisted = await userModel.findOne({ emailid });
    if (isExisted) {
      return res.status(400).json({ error: "user already existed" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      emailid,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 9000000),
    });
    return res
      .status(201)
      .json({ message: "user created successfully", username: user.username });
  } catch (e) {
    console.log(e, "error while creating user");
    return res
      .status(500)
      .json({ error: e.message, error: "error while creating user" });
  }
};

export const loginUser = async (req, res) => {
  const { emailid, password } = req.body;
  if (!emailid || !password) {
    return res.status(400).json({ error: "all fields are required" });
  }
  try {
    const isExist = await userModel.findOne({ emailid });
    if (!isExist) {
      return res.status(400).json({ error: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, isExist.password);
    if (!isMatch) {
      return res.status(400).json({ error: "invalid credentials" });
    }
    const token = jwt.sign({ id: isExist._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 9000000),
    });
    return res
      .status(200)
      .json({
        message: "user logged in successfully",
        username: isExist.username,
        emailid: isExist.emailid,
      });
  } catch (e) {
    console.log(e, "error while login user");
    return res
      .status(500)
      .json({ error: "error while login user", error: e.message });
  }
};

import { sendEmail } from "../utilis/mail.js";

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", { expires: new Date(0) });
    return res.status(200).json("sucessfully logout");
  } catch (e) {
    return res.status(500).json({ error: "internal server error,try again!" });
  }
};

export const sendEmailOtp = async (req, res) => {
  const { emailid } = req.body;
  try {
    const user = await userModel.findOne({ emailid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailOtp = otp;
    user.emailOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const subject = "Your OTP for Email Verification";
    const text = `Your OTP is: ${otp}. It will expire in 10 minutes.`;
    await sendEmail(user.emailid, subject, text);

    res.status(200).json({ message: "OTP sent to your email address." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Error sending OTP email" });
  }
};

export const verifyEmailOtp = async (req, res) => {
  const { emailid, otp } = req.body;
  try {
    const user = await userModel.findOne({ emailid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.emailOtp !== otp || user.emailOtpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Error verifying OTP" });
  }
};
