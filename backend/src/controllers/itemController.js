import { Item } from "../models/Item.js";
import { Booking } from "../models/Booking.js";
import { Review } from "../models/Review.js";

const withImageUrl = (req) =>
  req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl || "";

const normalizeCategory = (value) => {
  const category = String(value || "").trim().toLowerCase();
  if (!category) return "General";

  return category
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const createItem = async (req, res) => {
  const item = await Item.create({
    owner: req.user._id,
    title: req.body.title,
    description: req.body.description,
    category: normalizeCategory(req.body.category),
    pricePerHour: req.body.pricePerHour,
    availabilityStart: req.body.availabilityStart,
    availabilityEnd: req.body.availabilityEnd,
    imageUrl: withImageUrl(req),
    status: "approved"
  });

  res.status(201).json(item);
};

export const updateItem = async (req, res) => {
  const item = await Item.findOne({ _id: req.params.id, owner: req.user._id });
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  Object.assign(item, {
    title: req.body.title ?? item.title,
    description: req.body.description ?? item.description,
    category: req.body.category ? normalizeCategory(req.body.category) : item.category,
    pricePerHour: req.body.pricePerHour ?? item.pricePerHour,
    availabilityStart: req.body.availabilityStart ?? item.availabilityStart,
    availabilityEnd: req.body.availabilityEnd ?? item.availabilityEnd
  });

  if (req.file || req.body.imageUrl) {
    item.imageUrl = withImageUrl(req);
  }

  item.status = "approved";

  await item.save();
  res.json(item);
};

export const getOwnerItems = async (req, res) => {
  const items = await Item.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
};

export const deleteItem = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  const isAdmin = req.user.role === "admin";
  const isOwner = String(item.owner) === String(req.user._id);

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await item.deleteOne();
  res.json({ message: "Item deleted successfully" });
};

export const browseItems = async (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;
  const filters = { status: "approved" };

  if (q) {
    filters.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } }
    ];
  }

  if (category) {
    filters.category = normalizeCategory(category);
  }

  if (minPrice || maxPrice) {
    filters.pricePerHour = {};
    if (minPrice) filters.pricePerHour.$gte = Number(minPrice);
    if (maxPrice) filters.pricePerHour.$lte = Number(maxPrice);
  }

  const items = await Item.find(filters)
    .populate("owner", "name location")
    .sort({ createdAt: -1 });

  const reviews = await Review.aggregate([
    { $group: { _id: "$item", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);

  const reviewMap = new Map(reviews.map((review) => [String(review._id), review]));
  const enrichedItems = items.map((item) => {
    const reviewData = reviewMap.get(String(item._id));
    return {
      ...item.toObject(),
      avgRating: reviewData ? Number(reviewData.avgRating.toFixed(1)) : 0,
      reviewCount: reviewData?.count || 0
    };
  });

  res.json(enrichedItems);
};

export const getItemById = async (req, res) => {
  const item = await Item.findById(req.params.id).populate("owner", "name email location phone");
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  const reviews = await Review.find({ item: item._id })
    .populate("renter", "name")
    .sort({ createdAt: -1 });

  res.json({ item, reviews });
};

export const getOwnerInsights = async (req, res) => {
  const items = await Item.find({ owner: req.user._id });
  const itemIds = items.map((item) => item._id);
  const bookings = await Booking.find({
    owner: req.user._id
  }).populate("item renter", "title name email");
  const reviews = await Review.find({ owner: req.user._id }).populate("item renter", "title name");

  const revenue = bookings
    .filter((booking) => ["approved", "completed"].includes(booking.status))
    .reduce((sum, booking) => sum + booking.totalPrice, 0);

  res.json({
    items,
    bookings,
    reviews,
    metrics: {
      totalItems: itemIds.length,
      pendingBookings: bookings.filter((booking) => booking.status === "pending").length,
      totalRevenue: revenue
    }
  });
};
