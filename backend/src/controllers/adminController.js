import { Booking } from "../models/Booking.js";
import { Item } from "../models/Item.js";
import { User } from "../models/User.js";

export const getAnalytics = async (_req, res) => {
  const [users, items, bookings] = await Promise.all([
    User.find().select("-password").sort({ createdAt: -1 }),
    Item.find().populate("owner", "name email").sort({ createdAt: -1 }),
    Booking.find().populate("item renter owner", "title name email").sort({ createdAt: -1 })
  ]);

  const totalRevenue = bookings
    .filter((booking) => ["approved", "completed"].includes(booking.status))
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

  res.json({
    metrics: {
      totalUsers: users.length,
      totalListings: items.length,
      totalBookings: bookings.length,
      totalRevenue
    },
    users,
    items,
    bookings
  });
};

export const moderateListing = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Listing not found" });
  }

  item.status = req.body.status;
  await item.save();
  res.json(item);
};
