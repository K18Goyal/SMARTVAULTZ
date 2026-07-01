const Booking = require("../models/Booking");
const Vault = require("../models/Vault");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");
const { getSlotStartDate, getSlotEndDate } = require("../utils/slotDates");

exports.bookVault = async (req, res) => {
  try {
    const { vaultId, paymentMethod } = req.body;
    const vault = await Vault.findById(vaultId);
    if (!vault) return res.status(404).json({ message: "Vault not found" });
    if (vault.status === "booked") return res.status(400).json({ message: "Vault is already booked" });

    const price = Number(vault.price) || 0;
    const method = paymentMethod === "wallet" ? "wallet" : "upi";

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (method === "wallet") {
      const balance = Number(user.walletBalance) || 0;
      if (balance < price) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }
      await User.findByIdAndUpdate(req.user.id, { $inc: { walletBalance: -price } });
    }

    const slotStart = vault.slotDate && vault.timeSlot ? getSlotStartDate(vault.slotDate, vault.timeSlot) : null;
    const slotEnd = vault.slotDate && vault.timeSlot ? getSlotEndDate(vault.slotDate, vault.timeSlot) : null;
    const startDate = slotStart && slotEnd ? slotStart : (req.body.start ? new Date(req.body.start) : new Date());
    const endDate = slotStart && slotEnd ? slotEnd : (req.body.end ? new Date(req.body.end) : new Date(Date.now() + 24 * 60 * 60 * 1000));

    const conflict = await Booking.findOne({
      vault: vaultId,
      bookingStatus: 'active',
      start: { $lt: endDate },
      end: { $gt: startDate },
    });
    if (conflict) return res.status(400).json({ message: "Time slot already booked" });

    const booking = await Booking.create({
      user: req.user.id,
      vault: vaultId,
      start: startDate,
      end: endDate,
      bookingStatus: 'active',
      snapshot: {
        lockerNo: vault.lockerNo || "Locker",
        location: vault.location || "",
        price: price,
        paymentMethod: method
      }
    });
    await Vault.findByIdAndUpdate(vaultId, { status: "booked" });
    const populated = await Booking.findById(booking._id).populate("vault");
    
    // Send email
    if (user.email) {
      const lockerLabel = vault.lockerNo ? `Locker ${vault.lockerNo}` : "your locker";
      sendMail.sendBookingConfirmationEmail(user.email, lockerLabel, price, startDate, endDate).catch(console.error);
    }
    
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message || "Booking failed" });
  }
};

exports.myBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id, bookingStatus: 'active' })
    .populate("vault")
    .sort({ createdAt: -1 });
  const filtered = bookings.filter((b) => b.vault && b.vault.status === "booked");
  res.json(filtered);
};

exports.getBookingHistory = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate("vault")
    .sort({ createdAt: -1 });
  res.json(bookings);
};

function hasHardwareConnected(vault) {
  if (!vault) return false;
  return (vault.lockerNo || "").toString().trim() === "1";
}

exports.openVault = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("vault").populate("user");
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.user._id.toString() !== req.user.id) return res.status(403).json({ message: "Not your booking" });
  booking.lockStatus = "open";
  await booking.save();
  const hasHardware = hasHardwareConnected(booking.vault);
  
  if (booking.user.email) {
    const lockerLabel = booking.vault?.lockerNo ? `Locker ${booking.vault.lockerNo}` : "your locker";
    sendMail.sendLockerUnlockedEmail(booking.user.email, lockerLabel).catch(console.error);
  }
  
  res.json({ message: "Vault opened", hasHardware });
};

exports.closeVault = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("vault");
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  // booking.user might be object if populated, but not here
  if (booking.user.toString() !== req.user.id) return res.status(403).json({ message: "Not your booking" });
  booking.lockStatus = "closed";
  await booking.save();
  const hasHardware = hasHardwareConnected(booking.vault);
  res.json({ message: "Vault closed", hasHardware });
};