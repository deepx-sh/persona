import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';
import { toNodeHandler } from 'better-auth/node';
import { authRateLimiter } from './middlewares/rateLimit.middleware.js';
import { notFound } from './middlewares/notfound.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

dotenv.config();

const app = express();


app.use(cors({
    origin: process.env.CLIENT_URL|| "http://localhost:3000",
    credentials:true
}))



const PORT = process.env.PORT || 5000;



const startServer = async () => {
    await connectDB();
    app.use(express.json())
    const { auth } = await import("./config/auth.js")
    app.use("/api/auth",authRateLimiter)
    app.all("/api/auth/*path", toNodeHandler(auth));
    
    app.get("/health", (req, res) => {
    res.json({status:"ok",service:"persona-api"})
    })
    

    app.use(notFound);
    app.use(errorHandler);
    app.listen(PORT, () => {
    console.log(`Persona API running on port ${PORT}`);
})
}

startServer()