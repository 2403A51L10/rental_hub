import express from "express";
import { body } from "express-validator";
import { updateProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { handleValidation } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.put(
  "/me",
  protect,
  [body("name").notEmpty().withMessage("Name is required")],
  handleValidation,
  asyncHandler(updateProfile)
);

export default router;
