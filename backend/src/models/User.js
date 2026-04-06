import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["owner", "renter", "admin"],
      required: true
    },
    phone: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    avatar: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
