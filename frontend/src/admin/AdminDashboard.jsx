import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // TEMP DATA (later fetch from backend)
    const saved = JSON.parse(localStorage.getItem("captainData")) || [];

    setRequests([
      {
        id: 1,
        name: "MK",
        phone: "4562365152",
        dlNumber: "DL12345",
        vehicleName: "Honda",
        vehicleNumber: "TS12T5623",
        status: "pending",
      },
    ]);
  }, []);

  const updateStatus = (id, status) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );

    toast.success(`Request ${status}`);

    // later backend API here
    // fetch("/admin/update", { method:"POST", body: JSON.stringify({id,status}) })
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Captain Verification Panel</h1>

      {requests.map((r) => (
        <div
          key={r.id}
          className="bg-white p-4 rounded shadow mb-3 flex justify-between items-center"
        >
          <div>
            <p><b>Name:</b> {r.name}</p>
            <p><b>Phone:</b> {r.phone}</p>
            <p><b>DL:</b> {r.dlNumber}</p>
            <p><b>Vehicle:</b> {r.vehicleName}</p>
            <p><b>Number:</b> {r.vehicleNumber}</p>
            <p><b>Status:</b> {r.status}</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => updateStatus(r.id, "approved")}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Approve
            </button>

            <button
              onClick={() => updateStatus(r.id, "declined")}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
