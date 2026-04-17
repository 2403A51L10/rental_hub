import express from "express";
import { body } from "express-validator";
import { getMe, login, resetPassword, signup } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { handleValidation } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/signup",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["owner", "renter"])
  ],
  handleValidation,
  asyncHandler(signup)
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  handleValidation,
  asyncHandler(login)
);

router.post(
  "/forgot-password",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  handleValidation,
  asyncHandler(resetPassword)
);

router.get("/me", protect, asyncHandler(getMe));

export default router;
