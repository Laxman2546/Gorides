import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { all } from "axios";
import {
  MapPin,
  User,
  Calendar,
  Clock,
  Users,
  Car,
  Phone,
  Mail,
  Plus,
  X,
  Shield,
  ChevronDown,
  Search,
  Navigation,
} from "lucide-react";
import axios from "axios";

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const GOOGLE_MAPS_KEY = "AIzaSyD92ayKlcL87JfAN771lykAN47g8Hy4Bx8";

export default function GoRidesLanding() {
  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState("find");
  const [showProfile, setShowProfile] = useState(false);

  // MAP EXPAND STATE
  const [expandedRide, setExpandedRide] = useState(null);
  const [routeCache, setRouteCache] = useState({});

  // USER
  const [captainData, setCaptainData] = useState(null);
  const [user, setUser] = useState({
    name: "Guest User",
    phone: "",
    emailid: "",
    emailVerifed: false,
    vehicle: { name: "", number: "" },
  });

  // FORM STATE
  const [search, setSearch] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [viaCities, setViaCities] = useState([]);
  const [newCity, setNewCity] = useState("");
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState(1);
  const [date, setDate] = useState("");
  const [dlNumber, setDlNumber] = useState("");

  // OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const navigate = useNavigate();

  // GOOGLE MAPS LOADER
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_KEY,
    libraries: ["places"],
  });

  // RIDES
  const [rides, setRides] = useState([
    {
      id: 1,
      route: ["Madhapur", "Gachibowli"],
      time: "9:30 AM",
      seats: 1,
      date: "2026-02-03",
      day: "Monday",
    },
  ]);

  // GEO HELPERS
  const geocodeCity = async (city) => {
    if (routeCache[city]) return routeCache[city];

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          city,
        )}&key=${GOOGLE_MAPS_KEY}`,
      );
      const data = await res.json();
      const location = data.results?.[0]?.geometry?.location;

      if (location) {
        setRouteCache((prev) => ({ ...prev, [city]: location }));
        return location;
      }
    } catch (err) {
      console.error("Geocode error:", err);
    }
    return null;
  };

  const buildRoute = async (ride) => {
    const points = [];
    for (const city of ride.route) {
      const loc = await geocodeCity(city);
      if (loc) points.push(loc);
    }
    return points;
  };

  // MOCK REALTIME SEATS
  useEffect(() => {
    const interval = setInterval(() => {
      setRides((prev) =>
        prev.map((r) => ({
          ...r,
          seats:
            r.seats > 0
              ? Math.max(0, r.seats - (Math.random() > 0.7 ? 1 : 0))
              : r.seats,
        })),
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // LOAD USER
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser((prevUser) => ({
        ...prevUser,
        name: userData.name || prevUser.name,
        emailid: userData.email || prevUser.emailid,
      }));
    }
  }, []);
  const getUserData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/api/getuser`,
        {
          withCredentials: true,
        },
      );
      const data = response.data;
      setUser((prevUser) => ({
        ...prevUser,
        name: data.username || prevUser.name,
        emailid: data.emailid || prevUser.emailid,
        phone: data.phone || prevUser.phone,
        emailVerifed: data.isEmailVerified,
      }));
      if (data.captain) {
        setCaptainData(data.captain);
      }
    } catch (e) {
      console.error("Error fetching user data:", e);
      if (e.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      getUserData();
    }
  }, []);
  // FILTER
  const filteredRides = rides.filter((ride) =>
    ride.route.some((city) =>
      city.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  // HELPERS
  const getLogOut = () => {
    localStorage.clear(all);
    navigate("/login");
  };

  const handleSuggestionSearch = async (query, type) => {
    if (query.length < 2) {
      if (type === "from") setFromSuggestions([]);
      else setToSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/maps/getsuggestions?query=${encodeURIComponent(
          query,
        )}`,
        {
          withCredentials: true,
        },
      );
      if (type === "from") {
        setFromSuggestions(response.data);
      } else {
        setToSuggestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error.response);
    }
  };

  const debouncedSearch = useRef(
    debounce((query, type) => {
      handleSuggestionSearch(query, type);
    }, 300),
  ).current;

  const handleFromChange = (e) => {
    const value = e.target.value;
    setFromCity(value);
    debouncedSearch(value, "from");
  };

  const handleToChange = (e) => {
    const value = e.target.value;
    setToCity(value);
    debouncedSearch(value, "to");
  };

  const getDayFromDate = (dateString) => {
    const options = { weekday: "long" };
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", options);
  };

  const publishRide = () => {
    if (captainData?.status !== "approved")
      return toast.error("Captain must be approved before creating rides");

    if (!fromCity || !toCity)
      return toast.error("Please enter From and To cities");

    if (!date) return toast.error("Please select a date");

    const newRide = {
      id: Date.now(),
      route: [fromCity, ...viaCities, toCity],
      time: time || "Anytime",
      seats: Number(seats),
      date: date,
      day: getDayFromDate(date),
    };

    setRides([newRide, ...rides]);
    setFromCity("");
    setToCity("");
    setViaCities([]);
    setTime("");
    setSeats(1);
    setDate("");

    toast.success("Ride Published Successfully 🚀");
  };

  const joinRide = (ride) => {
    if (!user.emailVerifed || !user.phone) {
      setShowProfile(true);
      return toast.error("Please verify profile before joining rides");
    }
    toast.success(`Join request sent for ${ride.route.join(" → ")}`);
  };

  const sendOtp = async () => {
    if (!user.phone || user.phone.trim().length < 10) {
      toast.error("Please enter a valid mobile number first");
      return;
    }

    if (!user.emailid) {
      toast.error("Email not found");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/api/sendotp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailid: user.emailid }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        toast.success("OTP sent successfully");
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Error sending OTP");
    }
  };
  const verifyOtp = async () => {
    if (!otpInput) {
      toast.error("Enter OTP first");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/api/verifyotp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emailid: user.emailid,
            otp: otpInput,
            phone: user.phone,
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setUser({ ...user, emailVerifed: true });
        setOtpSent(false);
        setOtpInput("");
        toast.success("Email verified successfully");
        getUserData();
      } else {
        toast.error(data.error || "Invalid or expired OTP");
      }
    } catch (error) {
      console.error(error, "error while verifying otp");
      toast.error("Error verifying OTP: " + error.message);
    }
  };
  const handleCaptainApproval = () => {
    if (!dlNumber) {
      toast.error("please enter your licence Number");
      return;
    }
    if (!user.vehicle.name) {
      toast.error("please enter your vehicle name");
      return;
    }
    if (!user.vehicle.number) {
      toast.error("please enter your vehicle number");
      return;
    }
    createCaptain();
  };
  const vehiclePayload = {
    vehicleName: user.vehicle.name,
    vehicleNumber: user.vehicle.number,
    dlNumber,
  };
  const createCaptain = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/captain/create`,
        vehiclePayload,
        {
          withCredentials: true,
        },
      );
      console.log(response.data);
      toast.success("Captain created successfully,will be verified soon");
      getUserData();
    } catch (e) {
      console.log(e.response);
      toast.error(e.response.data.error || "Error creating captain");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />

      <div className="min-h-screen bg-gray-50 flex flex-col relative font-sans">
        {/* ENHANCED TOP BAR */}
        <div className="w-full bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-md mx-auto px-5 py-4 flex justify-between items-center">
            <button
              onClick={() => {
                setScreen("home");
                setShowProfile(false);
              }}
              className="flex items-center gap-1"
            >
              <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                <Car className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900 ml-1">
                Go<span className="text-emerald-500">Rides</span>
              </span>
            </button>

            <button
              onClick={() => setShowProfile(true)}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <User size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        {screen === "home" && (
          <>
            {/* MODE TOGGLE */}
            <div className="w-full max-w-md mx-auto px-5 mt-5">
              <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => setMode("find")}
                    className={`py-3 rounded-xl font-semibold text-sm transition-all ${
                      mode === "find"
                        ? "bg-emerald-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Search size={16} className="inline mr-2" />
                    Find Ride
                  </button>

                  <button
                    onClick={() => setMode("create")}
                    className={`py-3 rounded-xl font-semibold text-sm transition-all ${
                      mode === "create"
                        ? "bg-emerald-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Plus size={16} className="inline mr-2" />
                    Offer Ride
                  </button>
                </div>
              </div>
            </div>

            {/* SEARCH / CREATE SECTION */}
            <section className="w-full max-w-md mx-auto px-5 mt-5">
              {mode === "find" ? (
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by city or route"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
                  />
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Pickup location"
                      value={fromCity}
                      onChange={handleFromChange}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {fromSuggestions.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-2 shadow-lg max-h-48 overflow-auto">
                        {fromSuggestions.map((suggestion) => (
                          <li
                            key={suggestion.place_id}
                            onClick={() => {
                              setFromCity(suggestion.description);
                              setFromSuggestions([]);
                            }}
                            className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
                          >
                            <MapPin
                              size={16}
                              className="inline mr-2 text-gray-400"
                            />
                            {suggestion.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Drop location"
                      value={toCity}
                      onChange={handleToChange}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    {toSuggestions.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-2 shadow-lg max-h-48 overflow-auto">
                        {toSuggestions.map((suggestion) => (
                          <li
                            key={suggestion.place_id}
                            onClick={() => {
                              setToCity(suggestion.description);
                              setToSuggestions([]);
                            }}
                            className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
                          >
                            <MapPin
                              size={16}
                              className="inline mr-2 text-gray-400"
                            />
                            {suggestion.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-11 pr-3 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="relative">
                      <Clock
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-11 pr-3 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* RIDES LIST */}
            <section className="w-full max-w-md mx-auto px-5 mt-5 pb-24 flex-1">
              {mode === "find" && filteredRides.length > 0 ? (
                <div className="space-y-4">
                  {filteredRides.map((ride) => (
                    <div
                      key={ride.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      {/* RIDE HEADER */}
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span className="font-semibold text-gray-900">
                                {ride.route[0]}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 ml-1">
                              <div className="w-0.5 h-4 bg-gray-300 ml-0.5"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="font-semibold text-gray-900">
                                {ride.route[ride.route.length - 1]}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {ride.price}
                            </div>
                            <div className="text-xs text-gray-500">
                              per seat
                            </div>
                          </div>
                        </div>

                        {/* RIDE DETAILS */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={16} className="text-gray-400" />
                            <span>{ride.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock size={16} className="text-gray-400" />
                            <span>{ride.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users size={16} className="text-gray-400" />
                            <span>{ride.seats} seats</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Car size={16} className="text-gray-400" />
                            <span>{ride.vehicle}</span>
                          </div>
                        </div>

                        {/* DRIVER INFO */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User size={18} className="text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-gray-900">
                                {ride.driver}
                              </div>
                              <div className="text-xs text-gray-500">
                                ⭐ {ride.rating} • Captain
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => joinRide(ride)}
                              className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold text-sm hover:bg-emerald-600 transition-colors shadow-sm"
                            >
                              Book Now
                            </button>
                            <button
                              onClick={() =>
                                setExpandedRide(
                                  expandedRide === ride.id ? null : ride.id,
                                )
                              }
                              className="px-3 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                              <ChevronDown
                                size={18}
                                className={`transform transition-transform ${
                                  expandedRide === ride.id ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* EXPANDED ROUTE */}
                      {expandedRide === ride.id && (
                        <div className="px-5 pb-5 space-y-4">
                          {/* Map */}
                          <LazyRouteMap
                            ride={ride}
                            isLoaded={isLoaded}
                            buildRoute={buildRoute}
                          />

                          {/* Route Details */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Navigation
                                size={16}
                                className="text-emerald-600"
                              />
                              <span className="text-sm font-semibold text-gray-700">
                                Route Stops
                              </span>
                            </div>
                            <div className="space-y-3">
                              {ride.route.map((city, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-3"
                                >
                                  <div className="flex flex-col items-center">
                                    <div
                                      className={`w-3 h-3 rounded-full ${
                                        idx === 0
                                          ? "bg-emerald-500"
                                          : idx === ride.route.length - 1
                                            ? "bg-red-500"
                                            : "bg-gray-400"
                                      }`}
                                    ></div>
                                    {idx < ride.route.length - 1 && (
                                      <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                                    )}
                                  </div>
                                  <div className="flex-1 pb-2">
                                    <div className="font-medium text-sm text-gray-900">
                                      {city}
                                    </div>
                                    {idx === 0 && (
                                      <div className="text-xs text-gray-500 mt-0.5">
                                        Pickup point
                                      </div>
                                    )}
                                    {idx === ride.route.length - 1 && (
                                      <div className="text-xs text-gray-500 mt-0.5">
                                        Drop point
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : mode === "find" ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500">No rides found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try searching for a different route
                  </p>
                </div>
              ) : null}
            </section>

            {/* FLOATING ACTION BUTTON */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-40">
              <div className="max-w-md mx-auto px-5 py-4">
                <button
                  className="w-full bg-emerald-500 text-white font-semibold py-4 rounded-2xl hover:bg-emerald-600 transition-colors shadow-md flex items-center justify-center gap-2"
                  onClick={() =>
                    mode === "create" ? publishRide() : setMode("create")
                  }
                >
                  {mode === "create" ? (
                    <>
                      <Plus size={20} />
                      Publish Ride
                    </>
                  ) : (
                    <>
                      <Car size={20} />
                      Become a Captain
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* PROFILE PANEL */}
        {showProfile && (
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm">
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl overflow-y-auto">
              {/* Profile Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
                <button
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  onClick={() => setShowProfile(false)}
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Profile Content */}
              <div className="p-5 space-y-6">
                {/* User Avatar */}
                <div className="flex flex-col items-center py-6">
                  <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                    <User size={40} className="text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Member since 2024
                  </p>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Personal Information
                  </h4>

                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900"
                        value={user.name}
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Enter mobile number"
                        value={user.phone}
                        onChange={(e) =>
                          setUser({ ...user, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900"
                        value={user.emailid}
                        readOnly
                      />
                      {user.emailVerifed && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
                            Verified
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {!user.emailVerifed && !otpSent && (
                    <button
                      className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
                      onClick={sendOtp}
                    >
                      Verify Email
                    </button>
                  )}

                  {!user.emailVerifed && otpSent && (
                    <div className="space-y-3">
                      <input
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Enter OTP"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                      />
                      <button
                        className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
                        onClick={verifyOtp}
                      >
                        Confirm OTP
                      </button>
                    </div>
                  )}
                </div>

                {/* Captain Verification */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="text-emerald-600" size={20} />
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Become a Captain
                    </h4>
                  </div>

                  {captainData ? (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-2 h-2 rounded-full ${captainData.status === "approved" ? "bg-emerald-500" : captainData.status === "pending" ? "bg-yellow-500" : "bg-red-500"}`}
                        ></div>
                        <span className="text-sm font-semibold text-gray-900 capitalize">
                          {captainData.status}
                        </span>
                      </div>
                      {captainData.status === "declined" && (
                        <p className="text-sm text-gray-600 mt-2">
                          Your application was declined. Please contact support
                          for more information.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Driving License Number"
                        value={dlNumber}
                        onChange={(e) => setDlNumber(e.target.value)}
                      />

                      <input
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Vehicle Name (e.g., Honda City)"
                        value={user.vehicle.name}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            vehicle: { ...user.vehicle, name: e.target.value },
                          })
                        }
                      />

                      <input
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Vehicle Number"
                        value={user.vehicle.number}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            vehicle: {
                              ...user.vehicle,
                              number: e.target.value,
                            },
                          })
                        }
                      />

                      <button
                        className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                        onClick={handleCaptainApproval}
                      >
                        <Shield size={18} />
                        Submit for Verification
                      </button>
                    </div>
                  )}
                </div>

                {/* Logout */}
                <div className="pt-6">
                  <button
                    onClick={getLogOut}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function LazyRouteMap({ ride, isLoaded, buildRoute }) {
  const [points, setPoints] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const loadRoute = async () => {
      const routePoints = await buildRoute(ride);
      if (mounted) setPoints(routePoints);
    };
    loadRoute();
    return () => (mounted = false);
  }, [ride, buildRoute]);

  const onLoad = (map) => {
    mapRef.current = map;
    if (points.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      points.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-[220px] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Navigation size={24} className="text-emerald-600 animate-pulse" />
          </div>
          <p className="text-sm text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[220px] rounded-xl overflow-hidden border border-gray-200">
      <GoogleMap
        onLoad={onLoad}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        zoom={12}
        center={points[0] || { lat: 17.385, lng: 78.4867 }}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {points.map((p, i) => (
          <Marker
            key={i}
            position={p}
            icon={
              i === 0
                ? {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#10b981",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                  }
                : i === points.length - 1
                  ? {
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 8,
                      fillColor: "#ef4444",
                      fillOpacity: 1,
                      strokeColor: "#ffffff",
                      strokeWeight: 2,
                    }
                  : undefined
            }
          />
        ))}

        {points.length > 1 && (
          <Polyline
            path={points}
            options={{
              strokeColor: "#10b981",
              strokeOpacity: 1,
              strokeWeight: 4,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}

/*
==============================
OLD WRONG MAP CODE (COMMENTED)
==============================

This rendered maps in a SEPARATE SECTION:

{mode === "find" && (
  <div className="w-full max-w-md px-4 mt-2 space-y-3">
    {filteredRides.map((ride) => (
      <div key={ride.id}>
        <GoogleMap />
      </div>
    ))}
  </div>
)}

FIX:
Maps now live INSIDE the ride card
and only load when "View Route" is clicked.
*/

// import React, { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
// import { LogOut } from "lucide-react";
// import { Navigate, useNavigate } from "react-router-dom";
// import { all } from "axios";

// // ==============================
// // // CONFIG
// // ==============================
// // // IMPORTANT:
// // // If this is empty, maps will gracefully fallback to a placeholder UI
// // to avoid Google Maps API errors in dev/sandbox environments.
// const GOOGLE_MAPS_KEY = "AIzaSyD92ayKlcL87JfAN771lykAN47g8Hy4Bx80"; // <-- Put your real key here in production

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
//   const [dlNumber, setDlNumber] = useState("");

//   // OTP STATE
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpInput, setOtpInput] = useState("");

//   const captainStatus = user.dlVerified ? "approved" : "pending";

//   // Only load Google Maps if key exists
//   const shouldLoadMaps = Boolean(GOOGLE_MAPS_KEY);

//   const { isLoaded } = useJsApiLoader(
//     shouldLoadMaps
//       ? { googleMapsApiKey: GOOGLE_MAPS_KEY }
//       : { googleMapsApiKey: "" }
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
//   ]);

//   const navigate = useNavigate();

//   const getLogOut = () => {
//     localStorage.clear(all);
//     navigate("/login");
//   };

//   const submitCaptainVerification = () => {
//     if (!user.phone || user.phone.trim().length < 10) {
//       toast.error("Mobile number is required");
//       return;
//     }

//     if (!dlNumber.trim()) {
//       toast.error("Driving License number is required");
//       return;
//     }

//     if (!user.vehicle.name.trim()) {
//       toast.error("Vehicle name is required");
//       return;
//     }

//     if (!user.vehicle.number.trim()) {
//       toast.error("Vehicle number is required");
//       return;
//     }

//     toast.success("Captain verification request sent to backend 🚀");

//     // later you can call backend API here
//   };

//  // ==============================
//   // REALTIME SEATS (MOCK WEBSOCKET)
// ==============================
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setRides((prev) =>
//         prev.map((r) => ({
//           ...r,
//           seats:
//             r.seats > 0
//               ? Math.max(0, r.seats - (Math.random() > 0.7 ? 1 : 0))
//               : r.seats,
//         }))
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
//     ride.route.some((city) => city.toLowerCase().includes(search.toLowerCase()))
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
//     if (!user.phone || user.phone.trim().length < 10) {
//       toast.error("Please enter a valid mobile number first");
//       return;
//     }

//     if (!user.emailid) {
//       toast.error("Email not found");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/auth/api/sendotp`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ emailid: user.emailid }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         setOtpSent(true);
//         toast.success("OTP sent successfully");
//       } else {
//         toast.error(data.error || "Failed to send OTP");
//       }
//     } catch (error) {
//       toast.error("Error sending OTP");
//     }
//   };

//   // const sendOtp = async () => {
//   //   if (!user.emailid) {
//   //     toast.error("Enter email address first");
//   //     return;
//   //   }
//   //   try {
//   //     const response = await fetch(
//   //       `${import.meta.env.VITE_BACKEND_URL}/auth/api/sendotp`,
//   //       {
//   //         method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify({ emailid: user.emailid }),
//   //       },
//   //     );
//   //     const data = await response.json();
//   //     if (response.ok) {
//   //       setOtpSent(true);
//   //       toast.success("OTP sent to your email");
//   //     } else {
//   //       toast.error(data.error || "Failed to send OTP");
//   //     }
//   //   } catch (error) {
//   //     console.error(error, "error while sending otp");
//   //     toast.error("Error sending OTP: " + error.message);
//   //   }
//   // };

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
//         }
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
//     if (!user.emailVerifed || !user.phone) {
//       setShowProfile(true);
//       return toast.error(
//         "Please verify your mobile number before joining rides"
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
//                   readOnly
//                   onChange={(e) => setUser({ ...user, name: e.target.value })}
//                 />

//                 <label className="text-sm">Mobile Number</label>
//                 <input
//                   className="w-full px-4 py-2 rounded-full border"
//                   placeholder="Enter mobile number"
//                   value={user.phone}
//                   required
//                   onChange={(e) => setUser({ ...user, phone: e.target.value })}
//                 />
//                 <label className="text-sm">Email Id</label>
//                 <input
//                   className="w-full px-4 py-2 rounded-full border"
//                   placeholder="Enter Email Id"
//                   value={user.emailid}
//                   readOnly
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
//                   value={dlNumber}
//                   onChange={(e) => setDlNumber(e.target.value)}
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
//                   onClick={submitCaptainVerification}
//                 >
//                   Submit for Captain Approval
//                 </button>

//                 <p className="text-sm text-gray-500">Status: {captainStatus}</p>

//                 <div className="mt-10 flex justify-center">
//                   <p>
//                     <button
//                       onClick={getLogOut}
//                       className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500 text-white font-semibold
//                         hover:bg-red-600 transition-all shadow-md"
//                     >
//                       Logout <LogOut size={18} />
//                     </button>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// // ==============================
// // // BASIC TEST CASES (JEST)
// // ==============================
// // /*
// // import { render, fireEvent } from "@testing-library/react";
// // import GoRidesLanding from "./GoRidesLanding";

// // test("opens profile panel when profile button is clicked", () => {
// //   const { getByText } = render(<GoRidesLanding />);
// //   fireEvent.click(getByText("👤"));
// //   expect(getByText("My Profile")).toBeInTheDocument();
// // });

// // test("prevents publishing ride when not approved", () => {
// //   const { getByText } = render(<GoRidesLanding />);
// //   fireEvent.click(getByText("Captain Mode"));
// //   fireEvent.click(getByText("Publish Ride →"));
// //   expect(
// //     getByText("Captain must be approved before creating rides")
// //   ).toBeInTheDocument();
// // });

// // // NEW TEST
// // // verifies day auto-calculates from date
// // test("calculates day of week from selected date", () => {
// //   const { getByText, getByLabelText } = render(<GoRidesLanding />);
// //   fireEvent.click(getByText("Captain Mode"));
// //   const dateInput = document.querySelector('input[type="date"]');
// //   fireEvent.change(dateInput, { target: { value: "2026-02-03" } });
// //   fireEvent.click(getByText("Create Ride →"));
// //   expect(document.body.textContent).toMatch(/Tuesday|Monday|Wednesday/);
// // });
// // */
