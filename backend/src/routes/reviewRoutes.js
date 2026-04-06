import express from "express";
import { body } from "express-validator";
import { createReview } from "../controllers/reviewController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { handleValidation } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("renter"),
  [
    body("bookingId").notEmpty(),
    body("rating").isInt({ min: 1, max: 5 }),
    body("comment").isLength({ min: 3, max: 500 })
  ],
  handleValidation,
  asyncHandler(createReview)
);

export default router;
