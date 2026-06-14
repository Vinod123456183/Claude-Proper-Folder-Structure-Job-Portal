import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectDataBase = await mongoose.connect(
      process.env.MONGO_DB_URI as string,
    );
    if (connectDataBase) console.log("✅ Database Connected Successfully");
    else console.log("❌ Database Connected Failed");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // stop server if DB fails
  }
};
