import mongoose from "mongoose"

 const connectDb=async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongo db is connected");
        
    } catch (error) {
        console.log("monogo db error",error);
        
    }
}
export default connectDb