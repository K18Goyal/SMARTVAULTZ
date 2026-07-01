const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vault: { type: mongoose.Schema.Types.ObjectId, ref: "Vault" },
  start: Date,
  end: Date,
  status: { type: String, default: "booked" }, // status of the physical lock booking
  lockStatus: { type: String, default: "closed" },
  reminderSentAt: { type: Date, default: null }, // set when "10 min left" email is sent
  bookingStatus: { type: String, enum: ['active', 'completed', 'expired'], default: 'active' },
  snapshot: {
    lockerNo: String,
    location: String,
    price: Number,
    paymentMethod: String,
  }
});

module.exports = mongoose.model("Booking", bookingSchema);