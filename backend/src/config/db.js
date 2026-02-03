import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("database connected successfully");
  } catch (e) {
    console.log("error while connecting to database", e);
  }
};
