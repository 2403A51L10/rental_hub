import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: "General"
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0
    },
    availabilityStart: {
      type: Date,
      required: true
    },
    availabilityEnd: {
      type: Date,
      required: true
    },
    imageUrl: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved"
    }
  },
  { timestamps: true }
);

export const Item = mongoose.model("Item", itemSchema);
