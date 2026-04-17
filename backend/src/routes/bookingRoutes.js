import express from "express";
import { body } from "express-validator";
import {
  cancelBooking,
  createBooking,
  getRenterBookings,
  markBookingComplete,
  updateBookingStatus
} from "../controllers/bookingController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { handleValidation } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("renter"),
  [
    body("itemId").notEmpty(),
    body("startDate").isISO8601(),
    body("endDate").isISO8601()
  ],
  handleValidation,
  asyncHandler(createBooking)
);

router.get("/renter/history", protect, authorize("renter"), asyncHandler(getRenterBookings));
router.patch(
  "/:id/status",
  protect,
  authorize("owner"),
  [body("status").isIn(["approved", "rejected"])],
  handleValidation,
  asyncHandler(updateBookingStatus)
);
router.patch("/:id/complete", protect, authorize("renter"), asyncHandler(markBookingComplete));
router.patch("/:id/cancel", protect, authorize("renter"), asyncHandler(cancelBooking));

export default router;
