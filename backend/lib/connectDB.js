import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.info("DB Connected ✅");
  } catch (error) {
    console.error("Failed to connect DB", error.message);
    process.exit(1);
  }
};
