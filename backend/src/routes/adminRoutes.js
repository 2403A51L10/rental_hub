import express from "express";
import { body } from "express-validator";
import { getAnalytics, moderateListing } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { handleValidation } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/analytics", protect, authorize("admin"), asyncHandler(getAnalytics));
router.patch(
  "/listings/:id/status",
  protect,
  authorize("admin"),
  [body("status").isIn(["approved", "rejected"])],
  handleValidation,
  asyncHandler(moderateListing)
);

export default router;
