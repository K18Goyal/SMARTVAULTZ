# SmartVault 🔐

SmartVault is a modern, responsive full-stack MERN web application designed for secure locker booking and management. It features a seamless user experience, real-time availability tracking, and automated email notifications for booking lifecycles.

## 🚀 Features

- **User Authentication:** Secure signup/login with JWT and encrypted passwords.
- **Smart Recommendations:** Recommends alternative lockers if the requested one is unavailable.
- **Real-Time Booking:** Instantly book lockers and manage time slots.
- **Wallet System:** Integrated virtual wallet for seamless payments.
- **Automated Email Alerts:** Sends "booking confirmed", "10-minutes remaining", and "booking ended" notifications automatically using Nodemailer and Cron jobs.
- **Super Admin Dashboard:** A dedicated interface for admins to manage all lockers, user bookings, and system health.
- **Fully Responsive UI:** Built with a mobile-first approach, featuring an intuitive bottom navigation bar on mobile devices and a beautiful premium dark theme.

## 🛠️ Technology Stack

- **Frontend:** React, Vite, React Router DOM, Vanilla CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **Emails:** Nodemailer

## 📦 Monolithic Deployment Structure

This repository contains both the Node.js backend and the bundled React frontend (`dist/` folder). The backend is configured to serve the frontend as a static site, meaning the entire application can be deployed as a single web service.

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file or hosting provider (e.g. Render):

- `MONGO_URI` = Your MongoDB connection string
- `JWT_SECRET` = A secure random string for signing tokens
- `EMAIL_USER` = Your Gmail address (for sending notifications)
- `EMAIL_PASS` = Your Gmail App Password
- `PORT` = Server port (default: 5000)

## 💻 Local Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Server:**
   ```bash
   npm run dev
   # or
   node src/server.js
   ```

3. **Access the App:**
   Open `http://localhost:5000` in your browser. The backend will serve the React UI and handle all `/api` requests automatically.

## 🌐 Deployment (Render)

1. Connect this repository to a new **Web Service** on Render.
2. Set the Build Command to `npm install`.
3. Set the Start Command to `node src/server.js`.
4. Add all required environment variables in the Render dashboard.
5. Deploy!
