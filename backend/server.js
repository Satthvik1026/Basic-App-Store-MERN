// const express = require('express'); old style 
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './confi/db.js';
import productRoutes from "./routes/product.route.js";
import cors from "cors";
import path from "path";




dotenv.config();

const app = express();

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests 

const PORT = process.env.PORT || 5000;

const _dirname = path.resolve();

app.use(express.json()); //allows us to accept JSON data data in the req.body -- middleware

app.use("/api/products", productRoutes);

// console.log(process.env.MONGO_URI);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(_dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
    })
}

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
})

