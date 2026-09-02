import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json())


const PORT = process.env.PORT || 5000;

app.get("/health", (req, res) => {
    res.json({status:"ok",service:"persona-api"})
})

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
    console.log(`Persona API running on port ${PORT}`);
})
}

startServer()