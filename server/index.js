import express from 'express'
import Dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import connectDb from './utils/db.js'
import userRoutes from './routes/user.routs.js'
import resumeRoutes from './routes/resume.routs.js'
import analysisRoutes from './routes/analysis.rout.js'
import interviewRoutes from './routes/interview.route.js'
import jobRoutes from './routes/jobMatch.rout.js'
Dotenv.config()

const PORT=process.env.PORT||5000
console.log(PORT)
console.log("ML_SERVICE_URL =", process.env.ML_SERVICE_URL);
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
const crosOption={
    origin:["http://localhost:5173",
    "https://mern-ai-career-assistant.onrender.com"],
    credentials:true
}
app.use(cors(crosOption))
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/resume", resumeRoutes)
app.use("/api/v1/analysis", analysisRoutes)
app.use("/api/v1/interview", interviewRoutes)
app.use("/api/v1/job", jobRoutes)

app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:");
    console.error(err);

    res.status(500).json({
        success: false,
        message: err.message
    });
});

app.get('/',(req,res)=>{
    res.send("server is running")
})


const serverStart=async()=>{
    try {
        await connectDb()
        app.listen(PORT,()=>{
            console.log(`listening to port ${PORT}`);
            
        })
    } catch (error) {
        console.error("server startup failed",error)
        process.exit(1)
    }
}
serverStart()