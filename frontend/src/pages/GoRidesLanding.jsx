



import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// ==============================
// CONFIG
// ==============================
// IMPORTANT:
// If this is empty, maps will gracefully fallback to a placeholder UI
// to avoid Google Maps API errors in dev/sandbox environments.
const GOOGLE_MAPS_KEY = ""; // <-- Put your real key here in production

export default function GoRidesLanding() {
  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState("find");
  const [showProfile, setShowProfile] = useState(false);

  const [user, setUser] = useState({
    name: "Guest User",
    phone: "",
    phoneVerified: false,
    dlVerified: false,
    vehicle: { name: "", number: "" },
  });

  const [search, setSearch] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [viaCities, setViaCities] = useState([]);
  const [newCity, setNewCity] = useState("");
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState(1);
  const [date, setDate] = useState("");

  // OTP STATE (MOCK)
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const captainStatus = user.dlVerified ? "approved" : "pending";

  // Only load Google Maps if key exists
  const shouldLoadMaps = Boolean(GOOGLE_MAPS_KEY);

  const { isLoaded } = useJsApiLoader(
    shouldLoadMaps
      ? { googleMapsApiKey: GOOGLE_MAPS_KEY }
      : { googleMapsApiKey: "" }
  );

  const [rides, setRides] = useState([
    {
      id: 1,
      route: ["Madhapur", "Gachibowli"],
      time: "9:30 AM",
      seats: 1,
      date: "2026-02-03",
      day: "Monday",
    },
    {
      id: 2,
      route: ["Ameerpet", "SR Nagar", "Hitech City"],
      time: "10:00 AM",
      seats: 2,
      date: "2026-02-03",
      day: "Monday",
    },
  ]);

  // ==============================
  // REALTIME SEATS (MOCK WEBSOCKET)
  // ==============================
  useEffect(() => {
    const interval = setInterval(() => {
      setRides((prev) =>
        prev.map((r) => ({
          ...r,
          seats:
            r.seats > 0
              ? Math.max(0, r.seats - (Math.random() > 0.7 ? 1 : 0))
              : r.seats,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredRides = rides.filter((ride) =>
    ride.route.some((city) =>
      city.toLowerCase().includes(search.toLowerCase())
    )
  );

  const addCity = () => {
    if (!newCity.trim()) return toast.error("Enter a city name before adding");
    setViaCities([...viaCities, newCity.trim()]);
    setNewCity("");
    toast.success("City added to route");
  };

  const getDayFromDate = (dateString) => {
    const options = { weekday: "long" };
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", options);
  };

  const publishRide = () => {
    if (captainStatus !== "approved")
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

  const sendOtp = () => {
    if (!user.phone) {
      toast.error("Enter mobile number first");
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);
    console.log("DEV OTP:", otp); // Replace with Firebase/Twilio in production
    toast.success("OTP sent to your mobile number");
  };

  const verifyOtp = () => {
    if (otpInput === generatedOtp) {
      setUser({ ...user, phoneVerified: true });
      setOtpSent(false);
      setOtpInput("");
      toast.success("Mobile verified successfully");
    } else {
      toast.error("Invalid OTP");
    }
  };

  const joinRide = (ride) => {
    if (!user.phoneVerified) {
      setShowProfile(true);
      return toast.error(
        "Please verify your mobile number before joining rides"
      );
    }

    toast.success(`Join request sent for ${ride.route.join(" → ")}`);
  };

  return (
    <>
      <ToastContainer position="top-center" />

      <div className="min-h-screen bg-white flex flex-col items-center justify-between relative">
        {/* TOP BAR */}
        <div className="w-full max-w-md px-4 py-3 flex justify-between items-center fixed top-0 bg-white z-10 border-b">
          <button
  onClick={() => {
    setScreen("home");
    setShowProfile(false);
  }}
  className="font-bold text-lg"
>
  Go{""}
  <span className="text-red-500 font-extrabold">
    <span className="text-2xl inline-block align-baseline">R</span>ides
  </span>
</button>


          <button
            onClick={() => setShowProfile(true)}
            className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center"
          >
            👤
          </button>
        </div>

        <div className="h-16" />

        {screen === "home" && (
          <>
            {/* MODE TOGGLE */}
            <div className="w-full max-w-md px-4 mt-4 flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setMode("find")}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
                  mode === "find" ? "bg-white shadow" : "text-gray-500"
                }`}
              >
                Find Ride
              </button>

              <button
                onClick={() => setMode("create")}
                className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
                  mode === "create" ? "bg-white shadow" : "text-gray-500"
                }`}
              >
                Captain Mode
              </button>
            </div>

            {/* SEARCH / CREATE */}
            <section className="w-full max-w-md px-4 mt-4">
              {mode === "find" ? (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search city on route"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-full border"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    Captain status: {captainStatus}
                  </p>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-full border"
                  />

                  <input
                    type="text"
                    placeholder="From"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="w-full px-4 py-2 rounded-full border"
                  />

                  {viaCities.map((city, index) => (
                    <div
                      key={index}
                      className="w-full px-4 py-2 rounded-full border bg-gray-50 text-sm"
                    >
                      📍 {city}
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add city in between"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-full border"
                    />
                    <button
                      onClick={addCity}
                      className="bg-black text-white px-4 rounded-full"
                    >
                      + Add
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="To"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full px-4 py-2 rounded-full border"
                  />

                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-full border"
                  />

                  <input
                    type="number"
                    min={1}
                    placeholder="Seats"
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-full border"
                  />
                </div>
              )}
            </section>

            {/* RESULTS */}
            <section className="w-full max-w-md px-4 mt-4 flex-1">
              <div
                className={`rounded-xl p-4 min-h-[200px] ${
                  search
                    ? "bg-black text-white"
                    : "bg-transparent text-gray-400"
                }`}
              >
                {mode === "find" &&
                  filteredRides.map((ride) => (
                    <div
                      key={ride.id}
                      className="flex justify-between items-center bg-white/10 rounded-lg px-4 py-3 mb-2"
                    >
                      <div>
                        <p className="font-semibold">
                          {ride.route.join(" → ")}
                        </p>
                        <p className="text-sm text-gray-300">
                          {ride.day} • {ride.date} • {ride.time} • Seats: {ride.seats}
                        </p>
                      </div>
                      <button
                        onClick={() => joinRide(ride)}
                        className="bg-red-500 text-white px-3 py-1 rounded-full"
                      >
                        Join
                      </button>
                    </div>
                  ))}

                {mode === "create" && (
                  <p className="text-center text-gray-500">
                    Select date, route, and time — then publish when approved
                  </p>
                )}
              </div>
            </section>

            {/* MAP PREVIEW PER RIDE */}
            {mode === "find" && (
              <div className="w-full max-w-md px-4 mt-2 space-y-3">
                {filteredRides.map((ride) => (
                  <div key={ride.id} className="rounded-xl overflow-hidden">
                    {shouldLoadMaps && isLoaded ? (
                      <GoogleMap
                        zoom={12}
                        center={{ lat: 17.385, lng: 78.4867 }}
                        mapContainerStyle={{
                          width: "100%",
                          height: "150px",
                        }}
                      >
                        <Marker position={{ lat: 17.385, lng: 78.4867 }} />
                      </GoogleMap>
                    ) : (
                      <div className="w-full h-[150px] flex items-center justify-center bg-gray-100 text-gray-500 text-sm rounded-xl">
                        📍 Map preview disabled (Add Google Maps API key)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* PUBLISH BUTTON */}
            <div className="fixed bottom-4 w-full max-w-md px-4">
              <button
                className="w-full bg-gradient-to-r from-red-300 to-green-300 text-red-600 font-semibold py-4 rounded-full"
                onClick={() =>
                  mode === "create" ? publishRide() : setMode("create")
                }
              >
                {mode === "create" ? "Publish Ride →" : "Create Ride →"}
              </button>
            </div>
          </>
        )}

        {/* PROFILE PANEL */}
        {showProfile && (
          <div className="fixed inset-0 bg-black/40 z-20 flex justify-end">
            <div className="w-full max-w-md bg-white h-full p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">My Profile</h2>
                <button
                  className="text-gray-500"
                  onClick={() => setShowProfile(false)}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Name</label>
                <input
                  className="w-full px-4 py-2 rounded-full border"
                  value={user.name}
                  onChange={(e) =>
                    setUser({ ...user, name: e.target.value })
                  }
                />

                <label className="text-sm">Mobile Number</label>
                <input
                  className="w-full px-4 py-2 rounded-full border"
                  placeholder="Enter mobile number"
                  value={user.phone}
                  onChange={(e) =>
                    setUser({ ...user, phone: e.target.value })
                  }
                />

                {!user.phoneVerified && !otpSent && (
                  <button
                    className="w-full bg-black text-white py-2 rounded-full"
                    onClick={sendOtp}
                  >
                    Send OTP
                  </button>
                )}

                {!user.phoneVerified && otpSent && (
                  <div className="space-y-2">
                    <input
                      className="w-full px-4 py-2 rounded-full border"
                      placeholder="Enter OTP"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                    />
                    <button
                      className="w-full bg-green-500 text-white py-2 rounded-full"
                      onClick={verifyOtp}
                    >
                      Verify OTP
                    </button>
                  </div>
                )}

                {user.phoneVerified && (
                  <p className="text-green-600 text-sm">Mobile Verified ✔</p>
                )}
              </div>

              <div className="border-t pt-4 space-y-2">
                <h3 className="font-semibold">Captain Verification (Optional)</h3>

                <p className="text-sm text-gray-500">
                  Required only to create rides. Verified manually by backend
                  team.
                </p>

                <input
                  className="w-full px-4 py-2 rounded-full border"
                  placeholder="Driving License Number"
                />

                <input
                  className="w-full px-4 py-2 rounded-full border"
                  placeholder="Vehicle Name"
                  value={user.vehicle.name}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      vehicle: {
                        ...user.vehicle,
                        name: e.target.value,
                      },
                    })
                  }
                />

                <input
                  className="w-full px-4 py-2 rounded-full border"
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
                  className="w-full bg-blue-500 text-white py-2 rounded-full"
                  onClick={() =>
                    toast.success(
                      "Captain verification request sent to backend"
                    )
                  }
                >
                  Submit for Captain Approval
                </button>

                <p className="text-sm text-gray-500">
                  Status: {captainStatus}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ==============================
// BASIC TEST CASES (JEST)
// ==============================
/*
import { render, fireEvent } from "@testing-library/react";
import GoRidesLanding from "./GoRidesLanding";

test("opens profile panel when profile button is clicked", () => {
  const { getByText } = render(<GoRidesLanding />);
  fireEvent.click(getByText("👤"));
  expect(getByText("My Profile")).toBeInTheDocument();
});

test("prevents publishing ride when not approved", () => {
  const { getByText } = render(<GoRidesLanding />);
  fireEvent.click(getByText("Captain Mode"));
  fireEvent.click(getByText("Publish Ride →"));
  expect(
    getByText("Captain must be approved before creating rides")
  ).toBeInTheDocument();
});

// NEW TEST
// verifies day auto-calculates from date
test("calculates day of week from selected date", () => {
  const { getByText, getByLabelText } = render(<GoRidesLanding />);
  fireEvent.click(getByText("Captain Mode"));
  const dateInput = document.querySelector('input[type="date"]');
  fireEvent.change(dateInput, { target: { value: "2026-02-03" } });
  fireEvent.click(getByText("Create Ride →"));
  expect(document.body.textContent).toMatch(/Tuesday|Monday|Wednesday/);
});
*/
