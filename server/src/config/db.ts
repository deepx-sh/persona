import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGODB_URI

        if (!uri) {
            throw new Error("MONGODB_URI not defined in .env")
        }

        await mongoose.connect(uri)
        console.log("MongoDB connected successfully!")

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:",err)
        })

        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected");
        })
    } catch (error) {
        console.error("Failed to connect MongoDB", error);
        process.exit(1);
        
    }
}