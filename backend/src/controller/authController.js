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
  const { username, password } = req.body;
  console.log(username, password);
  if (!username || !password) {
    return res.status(400).json({ error: "all fields are required" });
  }
  try {
    const isExist = await userModel.findOne({ username });
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
    return res.status(200).json({ message: "user logged in successfully" });
  } catch (e) {
    console.log(e, "error while login user");
    return res
      .status(500)
      .json({ error: "error while login user", error: e.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", { expires: new Date(0) });
    return res.status(200).json("sucessfully logout");
  } catch (e) {
    return res.status(500).json({ error: "internal server error,try again!" });
  }
};
