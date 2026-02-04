
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";
import { connectDb } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDb();

    const adminExists = await Admin.findOne({ email: "goridesadmin@gmail.com" });

    if (adminExists) {
      console.log("Admin user already exists.");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("rides123", salt);

    const newAdmin = new Admin({
      email: "goridesadmin@gmail.com",
      password: hashedPassword,
    });

    await newAdmin.save();
    console.log("Admin user created successfully.");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    mongoose.disconnect();
    console.log("database disconnected successfully");
  }
};

seedAdmin();
