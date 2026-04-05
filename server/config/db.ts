import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error("MONGO_URI is missing in .env");
        }

        console.log("🔗 [DB] Connecting to MongoDB...");
        console.log("📍 [DB] URI:", mongoUri);

        await mongoose.connect(mongoUri);

        const dbName = mongoose.connection.name;
        console.log("✅ [DB] MongoDB connected!");
        console.log("📊 [DB] Database name:", dbName);
        console.log("🔌 [DB] Host:", mongoose.connection.host);
        console.log("📍 [DB] Port:", mongoose.connection.port);
        console.log("🔖 [DB] Connection state:", mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED");

    } catch (error: any) {
        console.error("❌ [DB] MongoDB connection failed!");
        console.error("❌ [DB] Error:", error.message);
        process.exit(1);
    }
};