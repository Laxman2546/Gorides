import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useJsApiLoader } from "@react-google-maps/api";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { all } from "axios";
import {
  MapPin,
  User,
  Calendar,
  Clock,
  Car,
  Phone,
  Mail,
  Plus,
  X,
  Shield,
  Search,
} from "lucide-react";
import axios from "axios";
import RideCard from "../components/RideCard.jsx";

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
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showProfile, setShowProfile] = useState(false);

  // MAP EXPAND STATE
  const [expandedRide, setExpandedRide] = useState(null);
  const [expandedBookingsRide, setExpandedBookingsRide] = useState(null);
  const [routeCache, setRouteCache] = useState({});

  // USER
  const [captainData, setCaptainData] = useState(null);
  const [user, setUser] = useState({
    id: "",
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
  const [loading, setLoading] = useState(false);
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
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [myBookedRides, setMyBookedRides] = useState([]);
  const [ridesLoading, setRidesLoading] = useState(false);
  const [ridesError, setRidesError] = useState("");
  const [captainRideBookings, setCaptainRideBookings] = useState({});

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

  const formatPrice = (value) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "₹--";
    }
    return `₹${Number(value).toFixed(0)}`;
  };

  const normalizeRide = (ride, options = {}) => {
    const isBooking = options.isBooking === true;
    const seatsTotal = Number(ride.seats || 0);
    const bookedSeats = Number(ride.bookedSeats || 0);
    const availableSeats = Math.max(0, seatsTotal - bookedSeats);
    const booking = ride.booking || null;
    const bookingSeats = booking?.seats || 0;
    const captainUserId =
      ride.captainId?.userId?._id ||
      ride.captainId?.userId ||
      ride.captainUserId;
    return {
      id: ride._id || ride.id,
      route: [ride.pickuppoint, ride.destination].filter(Boolean),
      time: ride.time,
      date: ride.date,
      day: getDayFromDate(ride.date),
      seats: availableSeats,
      bookedSeats: bookingSeats || bookedSeats,
      driver: ride.captainId?.userId?.username || "Captain",
      vehicle: ride.captainId?.vehicleName || "Bike",
      price: formatPrice(ride.price),
      pickupPoint: ride.pickuppoint,
      dropPoint: ride.destination,
      captainUserId,
      bookingStatus: booking?.status || (isBooking ? "confirmed" : undefined),
      bookingId: booking?._id || (isBooking ? ride._id || ride.id : undefined),
      bookingSeats,
      bookingOtp: booking?.otp,
      bookingOtpExpires: booking?.otpExpires,
      paymentStatus: booking?.paymentStatus || (isBooking ? "pending" : undefined),
      totalAmount: booking
        ? formatPrice(Number(ride.price || 0) * bookingSeats)
        : isBooking
          ? formatPrice(ride.price)
          : undefined,
    };
  };

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
        id: data._id || prevUser.id,
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

  const fetchUpcomingRides = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/rides/list`,
      {
        withCredentials: true,
      },
    );
    console.log(response.data, "iam upcoming rides");
    return response.data.map((ride) => normalizeRide(ride));
  };

  const fetchMyBookings = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/rides/my`,
      {
        withCredentials: true,
      },
    );
    return response.data.map((ride) =>
      normalizeRide(ride, { isBooking: true }),
    );
  };

  const fetchCaptainBookings = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/rides/captain/bookings`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  };

  const refreshCaptainBookings = async () => {
    if (!captainData) return;
    try {
      const rides = await fetchCaptainBookings();
      const map = rides.reduce((acc, ride) => {
        acc[ride._id] = ride.bookings || [];
        return acc;
      }, {});
      setCaptainRideBookings(map);
    } catch (e) {
      console.error("Error fetching captain bookings:", e);
    }
  };

  const refreshRides = async (options = {}) => {
    const silent = options.silent === true;
    if (!silent) {
      setRidesLoading(true);
      setRidesError("");
    }
    try {
      const [upcoming, myBookings] = await Promise.all([
        fetchUpcomingRides(),
        fetchMyBookings(),
      ]);
      setUpcomingRides(upcoming);
      setMyBookedRides(myBookings);
      if (captainData) {
        refreshCaptainBookings();
      }
    } catch (e) {
      console.error("Error fetching rides:", e);
      if (!silent) {
        setRidesError("Unable to load rides right now");
      }
    } finally {
      if (!silent) {
        setRidesLoading(false);
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      getUserData();
      refreshRides();
    }
  }, []);

  useEffect(() => {
    if (captainData) {
      refreshCaptainBookings();
    }
  }, [captainData]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const interval = setInterval(() => {
      refreshRides({ silent: true });
    }, 6000);

    return () => clearInterval(interval);
  }, [captainData]);
  // FILTER
  // const filteredRides = rides.filter((ride) =>
  //   ride.route.some((city) =>
  //     city.toLowerCase().includes(search.toLowerCase()),
  //   ),
  // );

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

  const getShortCity = (value) => {
    if (!value || typeof value !== "string") return value;
    const [first] = value.split(",");
    return first?.trim() || value;
  };

  const publishRide = async () => {
    if (captainData?.status !== "approved")
      return toast.error("Captain must be approved before creating rides");

    if (!fromCity || !toCity)
      return toast.error("Please enter From and To cities");

    if (!date) return toast.error("Please select a date");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/rides/create`,
        {
          pickuppoint: fromCity,
          destination: toCity,
          time: time || "Anytime",
          date,
          seats: Number(seats),
        },
        {
          withCredentials: true,
        },
      );
      const createdRide = normalizeRide(response.data);
      setUpcomingRides((prev) => [createdRide, ...prev]);
      setFromCity("");
      setToCity("");
      setViaCities([]);
      setTime("");
      setSeats(1);
      setDate("");

      toast.success("Ride Published Successfully");
    } catch (e) {
      console.error("Error publishing ride:", e);
      toast.error(e.response?.data?.error || "Failed to publish ride");
    }
  };

  const joinRide = async (ride) => {
    if (!user.emailVerifed || !user.phone) {
      setShowProfile(true);
      return toast.error("Please verify profile before joining rides");
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/rides/book/${ride.id}`,
        { seats: 1 },
        { withCredentials: true },
      );
      toast.success(
        `Ride booked for ${ride.route.map(getShortCity).join(" -> ")}`,
      );
      refreshRides();
    } catch (e) {
      console.error("Error booking ride:", e);
      toast.error(e.response?.data?.error || "Failed to book ride");
    }
  };

  const generateRideOtp = async (ride) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/rides/booking/${ride.id}/otp`,
        {},
        { withCredentials: true },
      );
      const { otp } = response.data;
      setMyBookedRides((prev) =>
        prev.map((item) =>
          item.id === ride.id ? { ...item, bookingOtp: otp } : item,
        ),
      );
      toast.success("OTP generated");
    } catch (e) {
      console.error("Error generating OTP:", e);
      toast.error(e.response?.data?.error || "Failed to generate OTP");
    }
  };

  const payForRide = async (ride) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/rides/booking/${ride.id}/pay`,
        { bookingId: ride.bookingId },
        { withCredentials: true },
      );
      toast.success("Payment completed");
      refreshRides();
    } catch (e) {
      console.error("Error paying for ride:", e);
      toast.error(e.response?.data?.error || "Failed to pay");
    }
  };

  const startRideBooking = async (rideId, bookingId, otp) => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/rides/booking/${rideId}/start`,
        { bookingId, otp },
        { withCredentials: true },
      );
      toast.success("Ride started");
      refreshCaptainBookings();
      refreshRides();
    } catch (e) {
      console.error("Error starting ride:", e);
      toast.error(e.response?.data?.error || "Failed to start ride");
    }
  };

  const completeRideBooking = async (rideId, bookingId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/rides/booking/${rideId}/complete`,
        { bookingId },
        { withCredentials: true },
      );
      toast.success("Ride completed");
      refreshCaptainBookings();
      refreshRides();
    } catch (e) {
      console.error("Error completing ride:", e);
      toast.error(e.response?.data?.error || "Failed to complete ride");
    }
  };

  const acceptRideBooking = async (rideId, bookingId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/rides/booking/${rideId}/accept`,
        { bookingId },
        { withCredentials: true },
      );
      toast.success("Booking accepted");
      refreshCaptainBookings();
      refreshRides();
    } catch (e) {
      console.error("Error accepting booking:", e);
      toast.error(e.response?.data?.error || "Failed to accept booking");
    }
  };

  const declineRideBooking = async (rideId, bookingId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/rides/booking/${rideId}/decline`,
        { bookingId },
        { withCredentials: true },
      );
      toast.success("Booking declined");
      refreshCaptainBookings();
      refreshRides();
    } catch (e) {
      console.error("Error declining booking:", e);
      toast.error(e.response?.data?.error || "Failed to decline booking");
    }
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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };
  const verifyOtp = async () => {
    if (!otpInput) {
      toast.error("Enter OTP first");
      return;
    }
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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

  const searchTerm = search.trim().toLowerCase();
  const bookedRideIds = new Set(
    myBookedRides
      .filter((ride) => ride.bookingStatus && ride.bookingStatus !== "pending")
      .map((ride) => ride.id),
  );
  const visibleUpcomingRides = searchTerm
    ? upcomingRides.filter((ride) =>
        ride.route.some((city) => city.toLowerCase().includes(searchTerm)),
      )
    : upcomingRides;

  const filteredRides =
    activeTab === "upcoming"
      ? visibleUpcomingRides.filter((ride) => !bookedRideIds.has(ride.id))
      : myBookedRides;

  return (
    <>
      <ToastContainer position="top-center" />

      <div className="min-h-screen bg-gray-50 flex flex-col relative font-sans">
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

            {mode === "find" && (
              <div className="w-full max-w-md mx-auto px-5 mt-5">
                <div className="flex gap-2 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
                      activeTab === "upcoming"
                        ? "text-emerald-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Available Rides
                    {activeTab === "upcoming" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("my-rides")}
                    className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
                      activeTab === "my-rides"
                        ? "text-emerald-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      My Rides
                      {myBookedRides.filter(
                        (r) => r.bookingStatus === "confirmed",
                      ).length > 0 && (
                        <span className="w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                          {
                            myBookedRides.filter(
                              (r) => r.bookingStatus === "confirmed",
                            ).length
                          }
                        </span>
                      )}
                    </div>
                    {activeTab === "my-rides" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"></div>
                    )}
                  </button>
                </div>
              </div>
            )}

            <section className="w-full max-w-md mx-auto px-5 mt-5 pb-24 flex-1">
              {mode === "find" && ridesLoading && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-gray-400 animate-pulse" />
                  </div>
                  <p className="text-gray-500">Loading rides...</p>
                </div>
              )}
              {mode === "find" && !ridesLoading && ridesError && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-red-400" />
                  </div>
                  <p className="text-gray-500">{ridesError}</p>
                  <button
                    className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
                    onClick={refreshRides}
                  >
                    Retry
                  </button>
                </div>
              )}
              {mode === "find" &&
              !ridesLoading &&
              !ridesError &&
              filteredRides.length > 0 ? (
                <div className="space-y-4">
                  {filteredRides.map((ride) => {
                    const isCaptainOwner =
                      user.id && ride.captainUserId === user.id;
                    return (
                      <RideCard
                        key={ride.id}
                        ride={ride}
                        isCaptainOwner={isCaptainOwner}
                        expanded={expandedRide === ride.id}
                        bookingsExpanded={expandedBookingsRide === ride.id}
                        onToggleExpand={() =>
                          setExpandedRide(
                            expandedRide === ride.id ? null : ride.id,
                          )
                        }
                        onToggleBookings={() =>
                          setExpandedBookingsRide(
                            expandedBookingsRide === ride.id ? null : ride.id,
                          )
                        }
                        onJoinRide={() => joinRide(ride)}
                        onGenerateOtp={() => generateRideOtp(ride)}
                        onPayBooking={() => payForRide(ride)}
                        onStartBooking={(bookingId, otp) =>
                          startRideBooking(ride.id, bookingId, otp)
                        }
                        onAcceptBooking={(bookingId) =>
                          acceptRideBooking(ride.id, bookingId)
                        }
                        onDeclineBooking={(bookingId) =>
                          declineRideBooking(ride.id, bookingId)
                        }
                        onCompleteBooking={(bookingId) =>
                          completeRideBooking(ride.id, bookingId)
                        }
                        captainBookings={captainRideBookings[ride.id]}
                        isLoaded={isLoaded}
                        buildRoute={buildRoute}
                        getShortCity={getShortCity}
                      />
                    );
                  })}
                </div>
              ) : mode === "find" && !ridesLoading && !ridesError ? (
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

        {showProfile && (
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm">
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
                <button
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  onClick={() => setShowProfile(false)}
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              <div className="p-5 space-y-6">
                <div className="flex flex-col items-center py-6">
                  <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                    <User size={40} className="text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {user.name}
                  </h3>
                </div>

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
                      {loading ? "sending otp..." : "Verify Email"}
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
                        {loading ? "verifying otp..." : " Confirm OTP"}
                      </button>
                    </div>
                  )}
                </div>

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
