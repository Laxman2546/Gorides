import "dotenv/config";
import express from "express";
import http from "http";
import userRoute from "./src/routes/userRoute.js";
import mapsRoute from "./src/routes/mapsRoute.js";
import adminRoute from "./src/routes/adminRoute.js";
import captainRoute from "./src/routes/captainRoute.js";
import { connectDb } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const server = http.createServer(app);

connectDb();
const allowedOrigins = ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/auth", userRoute);
app.use("/maps", mapsRoute);
app.use("/admin", adminRoute);
app.use("/captain", captainRoute);
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`server is running ${port}`);
});
