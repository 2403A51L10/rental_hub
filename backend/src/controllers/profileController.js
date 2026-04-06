import { User } from "../models/User.js";

export const updateProfile = async (req, res) => {
  const updates = {
    name: req.body.name,
    phone: req.body.phone,
    bio: req.body.bio,
    location: req.body.location,
    avatar: req.body.avatar
  };

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true
  }).select("-password");

  res.json(user);
};
