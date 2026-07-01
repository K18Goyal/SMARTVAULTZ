const express = require("express");
const router = express.Router();
const { dashboard, getAllBookings } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { role } = require("../middleware/roleMiddleware");

router.get("/dashboard", protect, role("superadmin"), dashboard);
router.get("/bookings", protect, role("superadmin"), getAllBookings);

module.exports = router;