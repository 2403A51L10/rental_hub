import { Booking } from "../models/Booking.js";
import { Review } from "../models/Review.js";

export const createReview = async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.body.bookingId,
    renter: req.user._id,
    status: "completed"
  }).populate("item");

  if (!booking) {
    return res.status(404).json({ message: "Completed booking not found" });
  }

  const existingReview = await Review.findOne({ booking: booking._id });
  if (existingReview) {
    return res.status(400).json({ message: "Review already submitted" });
  }

  const review = await Review.create({
    booking: booking._id,
    item: booking.item._id,
    owner: booking.owner,
    renter: req.user._id,
    rating: req.body.rating,
    comment: req.body.comment
  });

  const populated = await Review.findById(review._id).populate("item renter", "title name");
  res.status(201).json(populated);
};
