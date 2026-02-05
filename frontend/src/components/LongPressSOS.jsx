import React, { useRef, useState } from "react";

export default function LongPressSOS() {
  const timerRef = useRef(null);
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);

  const HOLD_TIME = 1500;

  const startPress = () => {
    setHolding(true);
    setProgress(0);

    const start = Date.now();

    timerRef.current = setInterval(() => {
      const diff = Date.now() - start;
      const percent = Math.min((diff / HOLD_TIME) * 100, 100);
      setProgress(percent);

      if (diff >= HOLD_TIME) {
        clearInterval(timerRef.current);
        triggerSOS();
      }
    }, 20);
  };

  const endPress = () => {
    clearInterval(timerRef.current);
    setHolding(false);
    setProgress(0);
  };

  const triggerSOS = () => {
    setHolding(false);
    setProgress(100);

    navigator.vibrate?.([200, 100, 200]);

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;

      alert(`🚨 SOS Activated!\nLat: ${latitude}\nLng: ${longitude}`);

      // Emergency Call
      window.location.href = "tel:112";
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={endPress}
        onTouchStart={startPress}
        onTouchEnd={endPress}
        className="relative w-20 h-20 rounded-full bg-red-600 text-white font-bold shadow-xl active:scale-95 select-none"
      >
        SOS

        {holding && (
          <span
            className="absolute inset-0 rounded-full border-4 border-white"
            style={{
              clipPath: `inset(${100 - progress}% 0 0 0)`,
            }}
          />
        )}
      </button>
    </div>
  );
}
