const express = require("express");
const router = express.Router();
const { bookVault, myBookings, openVault, closeVault, getBookingHistory } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, myBookings);
router.get("/history", protect, getBookingHistory);
router.post("/", protect, bookVault);
router.post("/open/:id", protect, openVault);
router.post("/close/:id", protect, closeVault);

module.exports = router;