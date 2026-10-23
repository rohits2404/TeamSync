import mongoose from "mongoose";

export const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected To MongoDB");
    } catch (error) {
        console.log("Error Connecting To MongoDB");
        process.exit(1);
    }
};
