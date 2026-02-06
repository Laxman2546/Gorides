# 🚗 GoRides

> A community-driven ride-sharing platform for daily commuters to earn side income while sharing their routes

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-brightgreen.svg)](https://www.mongodb.com/)

## 📋 Table of Contents

- [About](#about)
- [Problem Statement](#problem-statement)
- [Key Differentiators](#key-differentiators)
- [How It Works](#how-it-works)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [User Flows](#user-flows)
- [Pricing Model](#pricing-model)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## 🎯 About

**GoRides is NOT Uber or Rapido.** It's a route-based commute-sharing platform designed specifically for daily workers and regular commuters.

### Main Goal

Build a reliable and ethical ride-sharing platform where:

- 🚗 Daily office-goers can earn extra income without changing their routine
- 💰 Passengers get cheaper, predictable rides for short and medium distances
- 🌱 Travel costs, traffic, and carbon emissions are reduced through seat sharing
- 📊 Pricing stays fair and transparent, based on actual shared distance

## 🧠 Problem Statement

Current challenges in urban commuting:

- ❌ Ride-hailing apps are expensive for daily use
- 🪑 Many commuters travel alone with empty seats
- 💼 Drivers want side income but don't want full-time driving commitments
- 🛣️ Existing platforms don't focus on route-based daily travel

**GoRides converts unused commute capacity into value.**

## 💡 Key Differentiators

| Feature         | Uber / Rapido         | GoRides                      |
| --------------- | --------------------- | ---------------------------- |
| **Driver Type** | Full-time / on-demand | Daily workers / commuters    |
| **Ride Type**   | Instant booking       | Route & time based           |
| **Pricing**     | Surge-based           | Distance-based & shared      |
| **Purpose**     | Taxi service          | Side income + sustainability |

## 🔄 How It Works

1. **User Registration** - Sign up and choose your role (Captain or Passenger)
2. **Captain Creates Ride** - Post daily route with start/destination, time, and available seats
3. **Passenger Searches** - Find rides matching their route and schedule
4. **Booking** - Add personal drop location (can be mid-route) and view fare
5. **Captain Accepts** - Review and approve passenger requests
6. **OTP Verification** - Secure ride start with OTP
7. **Ride Completion** - Payment processed, remaining seats stay available

## ⭐ Features

### Core Features

- 🔐 **Authentication & Role-Based Access** - Separate flows for Passengers and Captains
- 📍 **Route-Based Ride Creation** - Post your daily commute route
- 📏 **Distance-Based Pricing** - Fair pricing based on actual shared distance
- 🧍‍♂️ **Mid-Route Drop Support** - Passengers can exit before final destination
- 🔢 **OTP Verification** - Enhanced safety for ride initiation
- 📊 **Live Ride Status** - Real-time tracking of ride progress
- 💳 **Secure Payments** - Razorpay integration for safe transactions
- 🗺️ **Location Auto-Suggestions** - Google Maps API integration
- ♻️ **Sustainable Travel** - Better seat utilization, lower emissions

### Planned Enhancements

- 🤖 AI-based route matching & suggestions
- 🔄 Dynamic remainder-route ride generation
- 💬 Real-time driver-passenger chat
- 📅 Scheduled daily rides
- 👥 Ride-sharing groups (office/college)
- ⭐ Ratings & reviews system
- 💰 In-app wallet & rewards
- 🌱 Carbon-saving analytics

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 18+ with Vite
- **Styling:** Tailwind CSS
- **Maps:** Google Maps API (Geocoding, Distance Matrix, Autocomplete)

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JWT-based auth

### Database

- **Database:** MongoDB

### Payment

- **Gateway:** Razorpay

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v6 or higher)
- Google Maps API Key
- Razorpay Account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/gorides.git
   cd gorides
   ```

2. **Install dependencies**

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**

   Create `.env` file in the backend directory:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

   Create `.env` file in the frontend directory:

   ```env
   VITE_API_URL=http://localhost:5000
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Run the application**

   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend (in another terminal)
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 👥 User Flows

### 🧳 Passenger Flow

1. Register / Login
2. Search available rides by route & date
3. Select ride and enter drop location
4. View estimated fare before booking
5. Receive OTP after captain accepts
6. Complete ride & pay securely

### 👨‍✈️ Captain Flow

1. Register & get verified
2. Create a ride for daily commute
3. View passenger requests with pricing
4. Accept or decline requests
5. Start ride using OTP verification
6. Complete ride and earn extra income
7. Continue remaining route if seats are available

## 💰 Pricing Model

GoRides follows a **fair-pricing philosophy**:

- ✅ Short shared rides → Very affordable
- ✅ Longer rides → Lower per-km cost
- ❌ **No surge pricing**

**Goal:** Cost-sharing, not profit maximization

## 🗺️ Roadmap

### Phase 1: Core Platform ✅

- [x] User authentication
- [x] Route-based ride creation
- [x] Basic booking flow
- [x] OTP verification
- [x] Payment integration

### Phase 2: Intelligence 🔄

- [ ] Smart route-matching algorithm
- [ ] Dynamic fare optimization
- [ ] Trust & reliability scoring
- [ ] Fuel cost awareness

### Phase 3: Community Features 📅

- [ ] Scheduled daily rides
- [ ] Ride-sharing groups
- [ ] Real-time chat
- [ ] Ratings & reviews

### Phase 4: Advanced Features 🚀

- [ ] In-app wallet
- [ ] Rewards system
- [ ] Carbon-saving analytics
- [ ] AI-based suggestions

## 🌍 Impact

- 💵 **Reduces daily travel costs** for passengers
- 💰 **Creates side income opportunities** for commuters
- 🚦 **Reduces traffic congestion** through carpooling
- 🌱 **Encourages sustainable commuting** and lowers emissions

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Google Maps API for location services
- Razorpay for secure payment processing
- All contributors who help make commuting better
👨‍💻 Contributors
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/marennagarikurumurthy2005">
        <img src="https://avatars.githubusercontent.com/u/151370122?v=4" width="100px;" alt="Kurumurthy M"/>
        <br />
        <sub><b>Kurumurthy M</b></sub>
      </a>
      <br />
      <sub>Frontend Developer</sub>
    </td>
  </tr>
</table>

## 📞 Contact

Project Link: [https://github.com/laxman2546/gorides](https://github.com/yourusername/gorides)

---

**Made with ❤️ for sustainable urban mobility**

_GoRides - Empowering daily commuters, not replacing taxis._
