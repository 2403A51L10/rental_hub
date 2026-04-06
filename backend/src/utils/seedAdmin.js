import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { connectDb } from "../config/db.js";
import { User } from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  await connectDb();
  const email = process.env.ADMIN_EMAIL || "admin@rentease.com";
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const hashedPassword = await bcrypt.hash(password, 10);

  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({
      name: "RentEase Admin",
      email,
      password: hashedPassword,
      role: "admin"
    });
    console.log(`Admin user created: ${email}`);
  } else {
    console.log(`Admin user already exists: ${email}`);
  }

  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
