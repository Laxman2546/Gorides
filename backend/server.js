import "dotenv/config";
import express from "express";
import http from "http";
import userRoute from "./src/routes/userRoute.js";
import mapsRoute from "./src/routes/mapsRoute.js";
import adminRoute from "./src/routes/adminRoute.js";
import captainRoute from "./src/routes/captainRoute.js";
import ridesRoute from "./src/routes/Rides.Route.js";
import { connectDb } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const server = http.createServer(app);

connectDb();

const allowedOrigins = ["http://localhost:5173", "https://gorides.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

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
app.use("/rides", ridesRoute);
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`server is running ${port}`);
});
