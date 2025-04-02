import mongoose from "mongoose";

const connectMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {dbName: "Mini-proj",});
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    }
}

export default connectMongo;