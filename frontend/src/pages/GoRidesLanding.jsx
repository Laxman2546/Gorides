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
const NavtoLogin=()=>{
    navigate("\login")
  }

  const NavtoReg=()=>{
    navigate("\register")
  }
  const NavtoHome=()=>{
    navigate("")
  }

  

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
            <button onClick={NavtoReg}><a
              href=""
              className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            >
              Sign Up
            </a></button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* ================= HERO ================= */}
      <section
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('image.png')",
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
              <button onClick={NavtoReg}><a
                href=""
                className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 transition font-semibold"
              >
                Get Started
              </a></button>
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
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            About GoRides
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            GoRides is a community-driven ride-sharing platform that helps people
            travel efficiently by connecting riders and captains along the same
            route. Whether you're commuting daily or planning a one-time trip,
            GoRides makes it easy, safe, and affordable.
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
