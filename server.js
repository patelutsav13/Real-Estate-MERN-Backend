import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from "./routes/authRoutes.js"
import propertyRoutes from "./routes/propertyRoutes.js"
import rentRoutes from "./routes/rentRoutes.js"
import buyRoutes from "./routes/buyRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

dotenv.config()

const app = express()

// ================= MIDDLEWARE =================
app.use(cors({
  origin: ["http://localhost:5173", "https://real-estate-mern-web.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}))
app.use(express.json())

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected (Main Server)"))
  .catch((err) => console.error("Mongo Error:", err))

// Serve static files from uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= ROUTES =================
app.use("/api/auth", authRoutes)
app.use("/api/properties", propertyRoutes)
app.use("/api/rent", rentRoutes)
app.use("/api/buy", buyRoutes)
app.use("/api/admin", adminRoutes)

app.get("/", (req, res) => {
  res.send("Main Backend API running 🚀")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Main Server running on http://localhost:${PORT}`)
})
