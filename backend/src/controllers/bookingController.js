import { Booking } from "../models/Booking.js";
import { Item } from "../models/Item.js";
import { calcBookingPrice } from "../utils/calcBookingPrice.js";

const overlaps = async (itemId, startDate, endDate, excludeId = null) => {
  const query = {
    item: itemId,
    status: { $in: ["pending", "approved", "completed"] },
    startDate: { $lte: new Date(endDate) },
    endDate: { $gte: new Date(startDate) }
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const booking = await Booking.findOne(query);
  return Boolean(booking);
};

export const createBooking = async (req, res) => {
  const { itemId, startDate, endDate } = req.body;
  const item = await Item.findById(itemId);

  if (!item || item.status !== "approved") {
    return res.status(404).json({ message: "Item not available" });
  }

  const requestedStart = new Date(startDate);
  const requestedEnd = new Date(endDate);

  if (
    requestedStart < new Date(item.availabilityStart) ||
    requestedEnd > new Date(item.availabilityEnd)
  ) {
    return res.status(400).json({ message: "Requested dates are outside item availability" });
  }

  if (await overlaps(item._id, startDate, endDate)) {
    return res.status(409).json({ message: "These dates are already reserved" });
  }

  const { total, days } = calcBookingPrice(startDate, endDate, item.pricePerDay);
  if (days <= 0) {
    return res.status(400).json({ message: "Invalid booking dates" });
  }

  const booking = await Booking.create({
    item: item._id,
    owner: item.owner,
    renter: req.user._id,
    startDate,
    endDate,
    totalPrice: total
  });

  const populated = await Booking.findById(booking._id).populate("item owner renter", "title name email");
  res.status(201).json(populated);
};

export const getRenterBookings = async (req, res) => {
  const bookings = await Booking.find({ renter: req.user._id })
    .populate("item owner", "title name email imageUrl")
    .sort({ createdAt: -1 });
  res.json(bookings);
};

export const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id).populate("item");

  if (!booking || String(booking.owner) !== String(req.user._id)) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (status === "approved" && (await overlaps(booking.item._id, booking.startDate, booking.endDate, booking._id))) {
    return res.status(409).json({ message: "Booking conflicts with another reservation" });
  }

  booking.status = status;
  await booking.save();
  res.json(booking);
};

export const markBookingComplete = async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    renter: req.user._id,
    status: "approved"
  });

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  booking.status = "completed";
  await booking.save();
  res.json(booking);
};
