import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  MapPin,
  Car,
  DollarSign,
  Shield,
  Clock,
  Users,
  Star,
  CheckCircle,
  ChevronRight,
  Twitter,
  Linkedin,
} from "lucide-react";
import axios from "axios";

export default function GoRidesLanding() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavtoLogin = () => navigate("/login");
  const NavtoReg = () => navigate("/register");
  const NavtoHome = () => navigate("/");

  const features = [
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Live updates on your ride status",
    },
    {
      icon: Shield,
      title: "Verified Captains",
      description:
        "All drivers undergo through verification for your safety and peace of mind",
    },
    {
      icon: DollarSign,
      title: "Fair Pricing",
      description:
        "Transparent, distance-based fare splitting. No hidden charges, ever",
    },
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "100K+", label: "Rides Completed" },
    { number: "4.8★", label: "Average Rating" },
    { number: "25+", label: "Cities" },
  ];
  const serverWakeup = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/wakeup`,
      );
      console.log(response);
    } catch (e) {
      console.log("failed to wakeup the server", e);
    }
  };
  useEffect(() => {
    serverWakeup();
  }, []);
  return (
    <div className="w-full min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-md"
            : "bg-black/20 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={NavtoHome} className="flex items-center gap-2 group">
            <div className="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:bg-emerald-600 transition-all">
              <Car className="text-white" size={24} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              <span
                className={
                  scrolled ? "text-gray-900" : "text-white drop-shadow-lg"
                }
              >
                Go
              </span>
              <span className="text-emerald-500">Rides</span>
            </h1>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className={`font-medium transition-colors ${
                scrolled
                  ? "text-gray-700 hover:text-emerald-600"
                  : "text-white drop-shadow-md hover:text-emerald-300"
              }`}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className={`font-medium transition-colors ${
                scrolled
                  ? "text-gray-700 hover:text-emerald-600"
                  : "text-white drop-shadow-md hover:text-emerald-300"
              }`}
            >
              How It Works
            </a>
            <a
              href="#contact"
              className={`font-medium transition-colors ${
                scrolled
                  ? "text-gray-700 hover:text-emerald-600"
                  : "text-white drop-shadow-md hover:text-emerald-300"
              }`}
            >
              Contact
            </a>
          </nav>

          <div className="flex gap-3">
            <button
              onClick={NavtoLogin}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                scrolled
                  ? "border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  : "border-2 border-white/80 text-white drop-shadow-lg hover:bg-white/20 backdrop-blur-sm"
              }`}
            >
              Log In
            </button>
            <button
              onClick={NavtoReg}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-xl"
            >
              Sign Up
            </button>
          </div>
        </div>
      </motion.header>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://img.freepik.com/premium-vector/isometric-gps-map-navigation-own-pin-city-top-view-abstract-transportation-background-track_753943-557.jpg"
            alt="Motorcycle ride"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 to-gray-900/85"></div>

          <motion.div
            style={{ opacity }}
            className="absolute inset-0 bg-gradient-to-t from-emerald-200/20 to-transparent"
          ></motion.div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              Share Rides.
              <br />
              <span className="text-emerald-400 drop-shadow-lg">
                Save Money.
              </span>
              <br />
              Travel Smarter.
            </h1>

            <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Connect with verified riders and captains on your route. Split
              costs, reduce carbon footprint, and make every journey social.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={NavtoReg}
                className="px-8 py-4 rounded-xl bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-600 transition-colors shadow-2xl flex items-center justify-center gap-2"
              >
                Get Started Free
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      <section
        id="features"
        className="py-24 px-6 bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose GoRides?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of ride-sharing with features designed for
              safety, convenience, and community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-200 transition-colors">
                  <feature.icon className="text-emerald-600" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500"></div>

            {[
              {
                step: "01",
                title: "Sign Up & Verify",
                description:
                  "Create your account and complete quick verification for safety",
                image:
                  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop",
              },
              {
                step: "02",
                title: "Find or Offer Rides",
                description:
                  "Search for rides on your route or publish your own as a captain",
                image:
                  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2069&auto=format&fit=crop",
              },
              {
                step: "03",
                title: "Travel & Save",
                description:
                  "Enjoy your journey, meet new people, and split the costs fairly",
                image:
                  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative z-10 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <div className="text-5xl font-bold text-emerald-500/20 mb-2">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto drop-shadow-md">
            Join GoRides today and experience the smarter way to travel. Save
            money, meet new people, and reduce your carbon footprint.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={NavtoReg}
            className="px-10 py-5 rounded-xl bg-white text-emerald-600 font-bold text-lg hover:bg-gray-50 transition-colors shadow-2xl inline-flex items-center gap-2"
          >
            Get Started Now
            <ChevronRight size={24} />
          </motion.button>
        </motion.div>
      </section>

      <section id="contact" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? We're here to help you get started
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-500 text-white font-semibold py-4 rounded-xl hover:bg-emerald-600 transition-colors shadow-md"
                >
                  Send Message
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <a
                    href="mailto:support@gorides.com"
                    className="flex items-center gap-4 text-gray-700 hover:text-emerald-600 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                      <Mail className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-semibold">support@gorides.com</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, href: "https://facebook.com" },
                    { icon: Instagram, href: "https://instagram.com" },
                    { icon: Twitter, href: "https://twitter.com" },
                    { icon: Linkedin, href: "https://linkedin.com" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm hover:shadow-md"
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Car className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Go<span className="text-emerald-500">Rides</span>
                </h3>
              </div>
              <p className="text-sm text-gray-400">
                Making ride-sharing safer, smarter, and more affordable for
                everyone.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a
                  href="#features"
                  className="block hover:text-emerald-400 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="block hover:text-emerald-400 transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#contact"
                  className="block hover:text-emerald-400 transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <div className="space-y-2">
                <a
                  target="_blank"
                  href="https://www.termsfeed.com/live/3dd25c5e-f031-4755-8b2d-47b7a8b3bfbb"
                  className="block hover:text-emerald-400 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  target="_blank"
                  href="https://www.termsfeed.com/live/938b07fe-145f-471d-8418-9ce9c4210b3b"
                  className="block hover:text-emerald-400 transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  target="_blank"
                  href="https://www.termsfeed.com/live/91052487-d68d-42f0-8bfc-b1fe37c1d49b"
                  className="block hover:text-emerald-400 transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-3">
                Subscribe to get updates and special offers
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-emerald-500 outline-none text-sm"
                />
                <button className="px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2026 GoRides. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
