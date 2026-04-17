import express from "express";
import { body } from "express-validator";
import {
  browseItems,
  createItem,
  deleteItem,
  getItemById,
  getOwnerInsights,
  getOwnerItems,
  updateItem
} from "../controllers/itemController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { handleValidation } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.get("/", asyncHandler(browseItems));
router.get("/owner/dashboard", protect, authorize("owner"), asyncHandler(getOwnerInsights));
router.get("/owner/listings", protect, authorize("owner"), asyncHandler(getOwnerItems));
router.get("/:id", asyncHandler(getItemById));

router.post(
  "/",
  protect,
  authorize("owner"),
  upload.single("image"),
  [
    body("title").notEmpty(),
    body("description").notEmpty(),
    body("pricePerHour").isFloat({ min: 0 }),
    body("availabilityStart").isISO8601(),
    body("availabilityEnd").isISO8601()
  ],
  handleValidation,
  asyncHandler(createItem)
);

router.put(
  "/:id",
  protect,
  authorize("owner"),
  upload.single("image"),
  asyncHandler(updateItem)
);
router.delete("/:id", protect, authorize("owner", "admin"), asyncHandler(deleteItem));

export default router;
