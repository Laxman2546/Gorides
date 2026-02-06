import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, User, Users, X } from "lucide-react";
import axios from "axios";
import CaptainBookingsPanel from "./CaptainBookingsPanel.jsx";
import RideLiveLocationMap from "./RideLiveLocationMap.jsx";
import RideRouteMap from "./RideRouteMap.jsx";
import LongPressSOS from "../components/LongPressSOS.jsx";
export default function RideCard({
  ride,
  isCaptainOwner,
  expanded,
  onToggleExpand,
  bookingsExpanded,
  onToggleBookings,
  onJoinRide,
  onGenerateOtp,
  onPayBooking,
  onStartBooking,
  onAcceptBooking,
  onDeclineBooking,
  onCompleteBooking,
  captainBookings,
  isLoaded,
  buildRoute,
  getShortCity,
  userLocation,
  locationError,
}) {
  const [dropLocation, setDropLocation] = useState("");
  const [dropSuggestions, setDropSuggestions] = useState([]);
  const dropDebounceRef = useRef(null);
  const showPaymentDetails = Boolean(ride.paymentStatus);
  const bookingStatus = ride.bookingStatus;
  const isPending = bookingStatus === "pending";
  const canPay =
    bookingStatus === "completed" && ride.paymentStatus === "pending";
  const showLiveLocation = bookingStatus === "confirmed";

  useEffect(() => {
    if (!dropLocation || dropLocation.trim().length < 2) {
      setDropSuggestions([]);
      return;
    }

    if (dropDebounceRef.current) {
      clearTimeout(dropDebounceRef.current);
    }

    dropDebounceRef.current = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/maps/getsuggestions?query=${encodeURIComponent(
            dropLocation.trim(),
          )}`,
          { withCredentials: true },
        );
        setDropSuggestions(Array.isArray(response.data) ? response.data : []);
      } catch (e) {
        setDropSuggestions([]);
      }
    }, 300);

    return () => {
      if (dropDebounceRef.current) {
        clearTimeout(dropDebounceRef.current);
      }
    };
  }, [dropLocation]);
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {ride.bookingStatus && (
        <div
          className={`px-5 py-2.5 border-b flex items-center justify-between ${
            ride.bookingStatus === "confirmed"
              ? "bg-emerald-50 border-emerald-100"
              : ride.bookingStatus === "completed"
                ? "bg-gray-50 border-gray-100"
                : "bg-yellow-50 border-yellow-100"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                ride.bookingStatus === "confirmed"
                  ? "bg-emerald-500"
                  : ride.bookingStatus === "completed"
                    ? "bg-gray-500"
                    : "bg-yellow-500"
              }`}
            ></div>
            <span
              className={`text-sm font-semibold capitalize ${
                ride.bookingStatus === "confirmed"
                  ? "text-emerald-700"
                  : ride.bookingStatus === "completed"
                    ? "text-gray-700"
                    : "text-yellow-700"
              }`}
            >
              {ride.bookingStatus}
            </span>
          </div>
          <span
            className={`text-xs font-medium ${
              ride.bookingStatus === "confirmed"
                ? "text-emerald-600"
                : ride.bookingStatus === "completed"
                  ? "text-gray-600"
                  : "text-yellow-600"
            }`}
          >
            ID: {ride.bookingId}
          </span>
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 pr-12">
              <h3 className="text-lg font-bold text-gray-900">
                {ride.route.map(getShortCity).join(" -> ")}
              </h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{ride.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{ride.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>
                  {ride.bookedSeats
                    ? `${ride.bookedSeats} booked`
                    : `${ride.seats} seats`}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">
              {ride.totalAmount || ride.price}
            </div>
            <p className="text-xs text-gray-500">per seat</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <User size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{ride.driver}</p>
              <p className="text-sm text-gray-500">Captain</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{ride.vehicle} Bike</p>
            {bookingStatus == "confirmed" && (
              <p className="text-sm text-black font-bold ">
                {ride?.vehicleNumber?.split("").join(" ")}
              </p>
            )}
          </div>
        </div>
        {ride.bookingDropLocation && (
          <div className="mb-3 text-sm text-gray-600">
            Passenger Drop:{" "}
            <span className="font-medium text-gray-900">
              {ride.bookingDropLocation}
            </span>
          </div>
        )}
        {ride.bookingStatus == "confirmed" && (
          <div>
            <p className="font-medium text-gray-600  pb-3">
              Captain Number: {ride.phone || "N/A"}
            </p>
          </div>
        )}

        <div className="flex gap-3 relative">
          {isCaptainOwner ? (
            <>
              <button
                onClick={onToggleBookings}
                className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
              >
                {bookingsExpanded ? "Hide Bookings" : "View Bookings"}
              </button>
              <button
                className="  px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={onToggleExpand}
              >
                {expanded ? "Hide" : "View Route"}
              </button>
            </>
          ) : bookingStatus ? (
            <>
              {isPending && (
                <button
                  className="flex-1 bg-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold cursor-default"
                  disabled
                >
                  Awaiting Captain
                </button>
              )}
              {bookingStatus === "confirmed" && (
                <div className="flex-1 bg-emerald-50 text-emerald-700 py-2.5 rounded-xl font-semibold text-center">
                  {ride.bookingOtp
                    ? ride.bookingOtp.split("").join(" ")
                    : "OTP pending"}
                </div>
              )}
              {canPay && (
                <button
                  onClick={onPayBooking}
                  className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Pay Now
                </button>
              )}
              <button
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={onToggleExpand}
              >
                {expanded ? "Hide" : "Details"}
              </button>
            </>
          ) : (
            <>
              <div className="flex-1 flex flex-col gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Drop location (optional)
                  </label>
                  <div className="relative">
                    <input
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                      placeholder={`e.g. ${getShortCity(ride.dropPoint) || "City"}`}
                      value={dropLocation}
                      onChange={(e) => setDropLocation(e.target.value)}
                    />
                    {dropSuggestions.length > 0 && (
                      <ul className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto">
                        {dropSuggestions.map((suggestion) => (
                          <li
                            key={suggestion.place_id}
                            className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setDropLocation(suggestion.description);
                              setDropSuggestions([]);
                            }}
                          >
                            {suggestion.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onJoinRide?.(dropLocation)}
                  className="w-full bg-emerald-500 text-white py-2.5 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Join Ride
                </button>
                <button
                  className="max-h-fit  px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  onClick={onToggleExpand}
                >
                  {expanded ? "Hide" : "View Route"}
                </button>
              </div>
            </>
          )}
          {bookingStatus == "confirmed" ||
            (bookingStatus == "ongoing" && (
              <div className="absolute right-0">
                <LongPressSOS />
              </div>
            ))}
        </div>
      </div>

      {(expanded || bookingsExpanded) && (
        <div className="px-5 pb-5">
          <div className="border-t border-gray-100 pt-5 space-y-4">
            {expanded && (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">
                    {showLiveLocation ? "Live Location" : "Route Details"}
                  </h4>
                  <button
                    onClick={onToggleExpand}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>

                {showLiveLocation ? (
                  <RideLiveLocationMap
                    isLoaded={isLoaded}
                    selfLabel={isCaptainOwner ? "Captain" : "User"}
                    otherLabel={isCaptainOwner ? "User" : "Captain"}
                    selfLocation={userLocation}
                    locationError={locationError}
                    otherLocation={
                      isCaptainOwner ? ride.riderLocation : ride.captainLocation
                    }
                  />
                ) : (
                  <RideRouteMap
                    ride={ride}
                    isLoaded={isLoaded}
                    buildRoute={buildRoute}
                  />
                )}

                {!showLiveLocation && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    {ride.route.map((city, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              idx === 0
                                ? "bg-emerald-500"
                                : idx === ride.route.length - 1
                                  ? "bg-red-500"
                                  : "bg-gray-300"
                            }`}
                          ></div>
                          {idx < ride.route.length - 1 && (
                            <div className="w-0.5 h-8 bg-gray-300"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {getShortCity(city)}
                          </p>
                          {idx === 0 && (
                            <p className="text-xs text-gray-500">Pickup</p>
                          )}
                          {idx > 0 && idx < ride.route.length - 1 && (
                            <p className="text-xs text-gray-500">
                              Passenger Drop
                            </p>
                          )}
                          {idx === ride.route.length - 1 && (
                            <p className="text-xs text-gray-500">
                              {ride.bookingDropLocation
                                ? "Captain Destination"
                                : "Drop"}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {ride.bookingDropLocation && ride.dropPoint && (
                      <p className="mt-3 text-xs text-gray-500">
                        Remaining route:{" "}
                        {getShortCity(ride.bookingDropLocation)} {"->"}{" "}
                        {getShortCity(ride.dropPoint)}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {bookingsExpanded && isCaptainOwner && (
              <>
                <h4 className="font-semibold text-gray-900">Bookings</h4>
                <CaptainBookingsPanel
                  bookings={captainBookings}
                  onAccept={onAcceptBooking}
                  onDecline={onDeclineBooking}
                  onStart={onStartBooking}
                  onComplete={onCompleteBooking}
                  defaultDropLabel={ride.dropPoint}
                />
              </>
            )}

            {expanded && showPaymentDetails && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h5 className="font-semibold text-gray-900 mb-3">
                  Payment Details
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Booking ID</span>
                    <span className="font-medium text-gray-900">
                      {ride.bookingId}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Seats Booked</span>
                    <span className="font-medium text-gray-900">
                      {ride.bookedSeats || ride.bookingSeats || 1}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-medium text-gray-900">
                      {ride.totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Payment Status</span>
                    <span className="font-medium text-emerald-600 capitalize">
                      {ride.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
