import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  MapPin,
  Car,
  DollarSign,
} from "lucide-react";

// ==============================
// GoRides — SINGLE COMPONENT LANDING PAGE
// React + Vite + Tailwind + Framer Motion
// ==============================

export default function GoRidesLanding() {
  const navigate = useNavigate();
  const NavtoLogin = () => {
    navigate("/login");
  };

  const NavtoReg = () => {
    navigate("/register");
  };
  const NavtoHome = () => {
    navigate("/");
  };

  return (
    <div className="w-full min-h-screen bg-white text-gray-800">
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur border-b z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <button onClick={NavtoHome}>
            <h1 className="text-xl md:text-2xl font-bold text-black cursor-pointer">
              Go<span className="text-red-600">Rides</span>
            </h1>
          </button>
          <div className="space-x-2">
            <button onClick={NavtoLogin}>
              <a
                href=""
                className="px-4 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-50 transition"
              >
                Log In
              </a>
            </button>
            <button onClick={NavtoReg}>
              <a
                href=""
                className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              >
                Sign Up
              </a>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* ================= HERO ================= */}
      <section
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('image.png')",
        }}
      >
        <div className="bg-black/60 w-full min-h-screen flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto px-6 text-center text-white"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ride Together. Save More. Travel Smarter.
            </h2>
            <p className="text-lg md:text-xl mb-8 text-gray-200">
              GoRides connects drivers and riders going the same way. Share your
              ride, split costs, and make every journey social and affordable.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button onClick={NavtoReg}>
                <a
                  href=""
                  className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 transition font-semibold"
                >
                  Get Started
                </a>
              </button>
              <a
                href=""
                className="px-6 py-3 rounded-full border border-white hover:bg-white hover:text-black transition font-semibold"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="py-16 px-4 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">About GoRides</h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            GoRides is a community-driven ride-sharing platform that helps
            people travel efficiently by connecting riders and captains along
            the same route. Whether you're commuting daily or planning a
            one-time trip, GoRides makes it easy, safe, and affordable.
          </p>
        </motion.div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            <MapPin className="w-10 h-10 mx-auto mb-4 text-red-500" />
            <h4 className="font-semibold text-lg mb-2">Find Rides</h4>
            <p className="text-gray-600">
              Search rides by city, route, date, and time. Join rides instantly
              with verified captains.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            <Car className="w-10 h-10 mx-auto mb-4 text-red-500" />
            <h4 className="font-semibold text-lg mb-2">Create Rides</h4>
            <p className="text-gray-600">
              Become a captain, publish your route, and help others travel along
              the way.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            <DollarSign className="w-10 h-10 mx-auto mb-4 text-red-500" />
            <h4 className="font-semibold text-lg mb-2">Split Costs</h4>
            <p className="text-gray-600">
              Fair and transparent fare splitting using distance-based
              calculations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="py-16 px-4 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Contact Us</h3>
          <p className="text-gray-600 mb-8">
            Have questions or feedback? We'd love to hear from you.
          </p>

          <form className="max-w-xl mx-auto grid gap-4 mb-8">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <textarea
              rows={4}
              placeholder="Your Message"
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition"
            >
              Send Message
            </button>
          </form>

          {/* SOCIAL / CONTACT BUTTONS */}
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="tel:+911234567890"
              className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-red-50 transition"
            >
              <Phone className="w-5 h-5 text-red-500" /> Phone
            </a>
            <a
              href="mailto:support@gorides.com"
              className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-red-50 transition"
            >
              <Mail className="w-5 h-5 text-red-500" /> Email
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-red-50 transition"
            >
              <Facebook className="w-5 h-5 text-red-500" /> Facebook
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-red-50 transition"
            >
              <Instagram className="w-5 h-5 text-red-500" /> Instagram
            </a>
          </div>
        </motion.div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-black text-gray-300 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 GoRides. All rights reserved.</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#contact" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==============================
// BASIC TEST CASES (JEST)
// ==============================
/*
import { render } from "@testing-library/react";
import GoRidesLanding from "./GoRidesLanding";

test("renders GoRides header", () => {
  const { getByText } = render(<GoRidesLanding />);
  expect(getByText("GoRides")).toBeInTheDocument();
});

test("renders hero CTA button", () => {
  const { getByText } = render(<GoRidesLanding />);
  expect(getByText("Get Started")).toBeInTheDocument();
});
*/

// import React, { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// // ==============================
// // CONFIG
// // ==============================
// // IMPORTANT:
// // If this is empty, maps will gracefully fallback to a placeholder UI
// // to avoid Google Maps API errors in dev/sandbox environments.
// const GOOGLE_MAPS_KEY = "3Hzr-SQx8DfbP_y4KI86R2Mi1SE="; // <-- Put your real key here in production

// export default function GoRidesLanding() {
//   const [screen, setScreen] = useState("home");
//   const [mode, setMode] = useState("find");
//   const [showProfile, setShowProfile] = useState(false);

//   const [user, setUser] = useState({
//     name: "Guest User",
//     phone: "",
//     emailid: "",
//     emailVerifed: false,
//     dlVerified: false,
//     vehicle: { name: "", number: "" },
//   });

//   const [search, setSearch] = useState("");
//   const [fromCity, setFromCity] = useState("");
//   const [toCity, setToCity] = useState("");
//   const [viaCities, setViaCities] = useState([]);
//   const [newCity, setNewCity] = useState("");
//   const [time, setTime] = useState("");
//   const [seats, setSeats] = useState(1);
//   const [date, setDate] = useState("");

//   // OTP STATE
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpInput, setOtpInput] = useState("");

//   const captainStatus = user.dlVerified ? "approved" : "pending";

//   // Only load Google Maps if key exists
//   const shouldLoadMaps = Boolean(GOOGLE_MAPS_KEY);

//   const { isLoaded } = useJsApiLoader(
//     shouldLoadMaps
//       ? { googleMapsApiKey: GOOGLE_MAPS_KEY }
//       : { googleMapsApiKey: "" },
//   );

//   const [rides, setRides] = useState([
//     {
//       id: 1,
//       route: ["Madhapur", "Gachibowli"],
//       time: "9:30 AM",
//       seats: 1,
//       date: "2026-02-03",
//       day: "Monday",
//     },
//     {
//       id: 2,
//       route: ["Ameerpet", "SR Nagar", "Hitech City"],
//       time: "10:00 AM",
//       seats: 2,
//       date: "2026-02-03",
//       day: "Monday",
//     },
//   ]);

//   // ==============================
//   // REALTIME SEATS (MOCK WEBSOCKET)
//   // ==============================
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setRides((prev) =>
//         prev.map((r) => ({
//           ...r,
//           seats:
//             r.seats > 0
//               ? Math.max(0, r.seats - (Math.random() > 0.7 ? 1 : 0))
//               : r.seats,
//         })),
//       );
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       const userData = JSON.parse(storedUser);
//       setUser((prevUser) => ({
//         ...prevUser,
//         name: userData.name || prevUser.name,
//         emailid: userData.email || prevUser.emailid,
//       }));
//     }
//   }, []);

//   const filteredRides = rides.filter((ride) =>
//     ride.route.some((city) =>
//       city.toLowerCase().includes(search.toLowerCase()),
//     ),
//   );

//   const addCity = () => {
//     if (!newCity.trim()) return toast.error("Enter a city name before adding");
//     setViaCities([...viaCities, newCity.trim()]);
//     setNewCity("");
//     toast.success("City added to route");
//   };

//   const getDayFromDate = (dateString) => {
//     const options = { weekday: "long" };
//     const d = new Date(dateString);
//     return d.toLocaleDateString("en-US", options);
//   };

//   const publishRide = () => {
//     if (captainStatus !== "approved")
//       return toast.error("Captain must be approved before creating rides");

//     if (!fromCity || !toCity)
//       return toast.error("Please enter From and To cities");

//     if (!date) return toast.error("Please select a date");

//     const newRide = {
//       id: Date.now(),
//       route: [fromCity, ...viaCities, toCity],
//       time: time || "Anytime",
//       seats: Number(seats),
//       date: date,
//       day: getDayFromDate(date),
//     };

//     setRides([newRide, ...rides]);
//     setFromCity("");
//     setToCity("");
//     setViaCities([]);
//     setTime("");
//     setSeats(1);
//     setDate("");

//     toast.success("Ride Published Successfully 🚀");
//   };

//   const sendOtp = async () => {
//     if (!user.emailid) {
//       toast.error("Enter email address first");
//       return;
//     }
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/auth/api/sendotp`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ emailid: user.emailid }),
//         },
//       );
//       const data = await response.json();
//       if (response.ok) {
//         setOtpSent(true);
//         toast.success("OTP sent to your email");
//       } else {
//         toast.error(data.error || "Failed to send OTP");
//       }
//     } catch (error) {
//       console.error(error, "error while sending otp");
//       toast.error("Error sending OTP: " + error.message);
//     }
//   };

//   const verifyOtp = async () => {
//     if (!otpInput) {
//       toast.error("Enter OTP first");
//       return;
//     }
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/auth/api/verifyotp`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ emailid: user.emailid, otp: otpInput }),
//         },
//       );
//       const data = await response.json();
//       if (response.ok) {
//         setUser({ ...user, emailVerifed: true });
//         setOtpSent(false);
//         setOtpInput("");
//         toast.success("Email verified successfully");
//       } else {
//         toast.error(data.error || "Invalid or expired OTP");
//       }
//     } catch (error) {
//       console.error(error, "error while verifying otp");
//       toast.error("Error verifying OTP: " + error.message);
//     }
//   };

//   const joinRide = (ride) => {
//     if (!user.emailVerifed) {
//       setShowProfile(true);
//       return toast.error(
//         "Please verify your mobile number before joining rides",
//       );
//     }

//     toast.success(`Join request sent for ${ride.route.join(" → ")}`);
//   };

//   return (
//     <>
//       <ToastContainer position="top-center" />

//       <div className="min-h-screen bg-white flex flex-col items-center justify-between relative">
//         {/* TOP BAR */}
//         <div className="w-full max-w-md px-4 py-3 flex justify-between items-center fixed top-0 bg-white z-10 border-b">
//           <button
//             onClick={() => {
//               setScreen("home");
//               setShowProfile(false);
//             }}
//             className="font-bold text-lg"
//           >
//             Go{""}
//             <span className="text-red-500 font-extrabold">
//               <span className="text-2xl inline-block align-baseline">R</span>
//               ides
//             </span>
//           </button>

//           <button
//             onClick={() => setShowProfile(true)}
//             className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center"
//           >
//             👤
//           </button>
//         </div>

//         <div className="h-16" />

//         {screen === "home" && (
//           <>
//             {/* MODE TOGGLE */}
//             <div className="w-full max-w-md px-4 mt-4 flex bg-gray-100 rounded-full p-1">
//               <button
//                 onClick={() => setMode("find")}
//                 className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
//                   mode === "find" ? "bg-white shadow" : "text-gray-500"
//                 }`}
//               >
//                 Find Ride
//               </button>

//               <button
//                 onClick={() => setMode("create")}
//                 className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
//                   mode === "create" ? "bg-white shadow" : "text-gray-500"
//                 }`}
//               >
//                 Captain Mode
//               </button>
//             </div>

//             {/* SEARCH / CREATE */}
//             <section className="w-full max-w-md px-4 mt-4">
//               {mode === "find" ? (
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="Search city on route"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="w-full px-4 py-3 pl-10 rounded-full border"
//                   />
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                     🔍
//                   </span>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   <p className="text-sm text-gray-500">
//                     Captain status: {captainStatus}
//                   </p>

//                   <input
//                     type="date"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     className="w-full px-4 py-2 rounded-full border"
//                   />

//                   <input
//                     type="text"
//                     placeholder="From"
//                     value={fromCity}
//                     onChange={(e) => setFromCity(e.target.value)}
//                     className="w-full px-4 py-2 rounded-full border"
//                   />

//                   {viaCities.map((city, index) => (
//                     <div
//                       key={index}
//                       className="w-full px-4 py-2 rounded-full border bg-gray-50 text-sm"
//                     >
//                       📍 {city}
//                     </div>
//                   ))}

//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       placeholder="Add city in between"
//                       value={newCity}
//                       onChange={(e) => setNewCity(e.target.value)}
//                       className="flex-1 px-4 py-2 rounded-full border"
//                     />
//                     <button
//                       onClick={addCity}
//                       className="bg-black text-white px-4 rounded-full"
//                     >
//                       + Add
//                     </button>
//                   </div>

//                   <input
//                     type="text"
//                     placeholder="To"
//                     value={toCity}
//                     onChange={(e) => setToCity(e.target.value)}
//                     className="w-full px-4 py-2 rounded-full border"
//                   />

//                   <input
//                     type="time"
//                     value={time}
//                     onChange={(e) => setTime(e.target.value)}
//                     className="w-full px-4 py-2 rounded-full border"
//                   />

//                   <input
//                     type="number"
//                     min={1}
//                     placeholder="Seats"
//                     value={seats}
//                     onChange={(e) => setSeats(Number(e.target.value))}
//                     className="w-full px-4 py-2 rounded-full border"
//                   />
//                 </div>
//               )}
//             </section>

//             {/* RESULTS */}
//             <section className="w-full max-w-md px-4 mt-4 flex-1">
//               <div
//                 className={`rounded-xl p-4 min-h-[200px] ${
//                   search
//                     ? "bg-black text-white"
//                     : "bg-transparent text-gray-400"
//                 }`}
//               >
//                 {mode === "find" &&
//                   filteredRides.map((ride) => (
//                     <div
//                       key={ride.id}
//                       className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-3 mb-2"
//                     >
//                       <div>
//                         <p className="font-semibold">
//                           {ride.route.join(" → ")}
//                         </p>
//                         <p className="text-sm text-gray-300">
//                           {ride.day} • {ride.date} • {ride.time} • Seats:{" "}
//                           {ride.seats}
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => joinRide(ride)}
//                         className="bg-red-500 text-white px-3 py-1 rounded-full"
//                       >
//                         Join
//                       </button>
//                     </div>
//                   ))}

//                 {mode === "create" && (
//                   <p className="text-center text-gray-500">
//                     Select date, route, and time — then publish when approved
//                   </p>
//                 )}
//               </div>
//             </section>

//             {/* MAP PREVIEW PER RIDE */}
//             {mode === "find" && (
//               <div className="w-full max-w-md px-4 mt-2 space-y-3">
//                 {filteredRides.map((ride) => (
//                   <div key={ride.id} className="rounded-xl overflow-hidden">
//                     {shouldLoadMaps && isLoaded ? (
//                       <GoogleMap
//                         zoom={12}
//                         center={{ lat: 17.385, lng: 78.4867 }}
//                         mapContainerStyle={{
//                           width: "100%",
//                           height: "150px",
//                         }}
//                       >
//                         <Marker position={{ lat: 17.385, lng: 78.4867 }} />
//                       </GoogleMap>
//                     ) : (
//                       <div className="w-full h-[150px] flex items-center justify-center bg-gray-100 text-gray-500 text-sm rounded-xl">
//                         📍 Map preview disabled (Add Google Maps API key)
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* PUBLISH BUTTON */}
//             <div className="fixed bottom-4 w-full max-w-md px-4">
//               <button
//                 className="w-full bg-gradient-to-r from-red-300 to-green-300 text-red-600 font-semibold py-4 rounded-full"
//                 onClick={() =>
//                   mode === "create" ? publishRide() : setMode("create")
//                 }
//               >
//                 {mode === "create" ? "Publish Ride →" : "Create Ride →"}
//               </button>
//             </div>
//           </>
//         )}

//         {/* PROFILE PANEL */}
//         {showProfile && (
//           <div className="fixed inset-0 bg-black/40 z-20 flex justify-end">
//             <div className="w-full max-w-md bg-white h-full p-4 space-y-4">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-lg font-bold">My Profile</h2>
//                 <button
//                   className="text-gray-500"
//                   onClick={() => setShowProfile(false)}
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-sm">Name</label>
//                 <input
//                   className="w-full px-4 py-2 rounded-full border"
//                   value={user.name}
//                   onChange={(e) => setUser({ ...user, name: e.target.value })}
//                 />

//                 <label className="text-sm">Mobile Number</label>
//                 <input
//                   className="w-full px-4 py-2 rounded-full border"
//                   placeholder="Enter mobile number"
//                   value={user.phone}
//                   onChange={(e) => setUser({ ...user, phone: e.target.value })}
//                 />
//                 <label className="text-sm">Email Id</label>
//                 <input
//                   className="w-full px-4 py-2 rounded-full border"
//                   placeholder="Enter Email Id"
//                   value={user.emailid}
//                   onChange={(e) =>
//                     setUser({ ...user, emailid: e.target.value })
//                   }
//                 />

//                 {!user.emailVerifed && !otpSent && (
//                   <button
//                     className="w-full bg-black text-white py-2 rounded-full"
//                     onClick={sendOtp}
//                   >
//                     Send OTP
//                   </button>
//                 )}

//                 {!user.emailVerifed && otpSent && (
//                   <div className="space-y-2">
//                     <input
//                       className="w-full px-4 py-2 rounded-full border"
//                       placeholder="Enter Email OTP"
//                       value={otpInput}
//                       onChange={(e) => setOtpInput(e.target.value)}
//                     />
//                     <button
//                       className="w-full bg-green-500 text-white py-2 rounded-full"
//                       onClick={verifyOtp}
//                     >
//                       Verify OTP
//                     </button>
//                   </div>
//                 )}

//                 {user.emailVerifed && (
//                   <p className="text-green-600 text-sm">Email Verified ✔</p>
//                 )}
//               </div>

//               <div className="border-t pt-4 space-y-2">
//                 <h3 className="font-semibold">
//                   Captain Verification (Optional)
//                 </h3>

//                 <p className="text-sm text-gray-500">
//                   Required only to create rides. Verified manually by backend
//                   team.
//                 </p>

//                 <input
//                   className="w-full px-4 py-2 rounded-full border"
//                   placeholder="Driving License Number"
//                 />

//                 <input
//                   className="w-full px-4 py-2 rounded-full border"
//                   placeholder="Vehicle Name"
//                   value={user.vehicle.name}
//                   onChange={(e) =>
//                     setUser({
//                       ...user,
//                       vehicle: {
//                         ...user.vehicle,
//                         name: e.target.value,
//                       },
//                     })
//                   }
//                 />

//                 <input
//                   className="w-full px-4 py-2 rounded-full border"
//                   placeholder="Vehicle Number"
//                   value={user.vehicle.number}
//                   onChange={(e) =>
//                     setUser({
//                       ...user,
//                       vehicle: {
//                         ...user.vehicle,
//                         number: e.target.value,
//                       },
//                     })
//                   }
//                 />

//                 <button
//                   className="w-full bg-blue-500 text-white py-2 rounded-full"
//                   onClick={() =>
//                     toast.success(
//                       "Captain verification request sent to backend",
//                     )
//                   }
//                 >
//                   Submit for Captain Approval
//                 </button>

//                 <p className="text-sm text-gray-500">Status: {captainStatus}</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// // ==============================
// // BASIC TEST CASES (JEST)
// // ==============================
// /*
// import { render, fireEvent } from "@testing-library/react";
// import GoRidesLanding from "./GoRidesLanding";

// test("opens profile panel when profile button is clicked", () => {
//   const { getByText } = render(<GoRidesLanding />);
//   fireEvent.click(getByText("👤"));
//   expect(getByText("My Profile")).toBeInTheDocument();
// });

// test("prevents publishing ride when not approved", () => {
//   const { getByText } = render(<GoRidesLanding />);
//   fireEvent.click(getByText("Captain Mode"));
//   fireEvent.click(getByText("Publish Ride →"));
//   expect(
//     getByText("Captain must be approved before creating rides")
//   ).toBeInTheDocument();
// });

// // NEW TEST
// // verifies day auto-calculates from date
// test("calculates day of week from selected date", () => {
//   const { getByText, getByLabelText } = render(<GoRidesLanding />);
//   fireEvent.click(getByText("Captain Mode"));
//   const dateInput = document.querySelector('input[type="date"]');
//   fireEvent.change(dateInput, { target: { value: "2026-02-03" } });
//   fireEvent.click(getByText("Create Ride →"));
//   expect(document.body.textContent).toMatch(/Tuesday|Monday|Wednesday/);
// });
// */
