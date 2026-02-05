import React, { useState } from "react";
import { Users, Shield } from "lucide-react";

export default function CaptainBookingsPanel({
  bookings,
  onAccept,
  onDecline,
  onStart,
  onComplete,
}) {
  const [otpInputs, setOtpInputs] = useState({});

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-500">
        No bookings yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const bookingId = booking._id || booking.id;
        const riderName =
          booking.userId?.username || booking.user?.username || "Rider";
        return (
          <div
            key={bookingId}
            className="border border-gray-200 rounded-xl p-4 bg-white"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Users size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {riderName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {booking.status}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Seats: {booking.seats || 1}
              </div>
            </div>
            <p className="text-sm font-semibold mb-2 text-gray-900">
              Rider Number: {booking.userId?.phone || "N/A"}
            </p>

            {booking.status === "pending" && (
              <div className="flex items-center gap-2">
                <button
                  className="flex-1 px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600"
                  onClick={() => onAccept?.(bookingId)}
                >
                  Accept
                </button>
                <button
                  className="flex-1 px-3 py-2 rounded-lg border bg-red-600 border-gray-200 text-white text-sm font-semibold hover:bg-red-500 hover:border-red-500"
                  onClick={() => onDecline?.(bookingId)}
                >
                  Decline
                </button>
              </div>
            )}

            {booking.status === "confirmed" && (
              <div className="flex items-center gap-2">
                <input
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter rider OTP"
                  value={otpInputs[bookingId] || ""}
                  onChange={(e) =>
                    setOtpInputs((prev) => ({
                      ...prev,
                      [bookingId]: e.target.value,
                    }))
                  }
                />
                <button
                  className="px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600"
                  onClick={() => onStart(bookingId, otpInputs[bookingId])}
                >
                  Start
                </button>
              </div>
            )}

            {booking.status === "ongoing" && (
              <button
                className="w-full mt-2 px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 flex items-center justify-center gap-2"
                onClick={() => onComplete(bookingId)}
              >
                <Shield size={16} />
                End Ride
              </button>
            )}

            {booking.status === "completed" && (
              <div className="text-xs text-gray-500 mt-2">
                Payment status: {booking.paymentStatus || "pending"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
