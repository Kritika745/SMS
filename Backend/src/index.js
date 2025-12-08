import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import salesRoutes from "./routes/sales.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sales_management"

// Middleware
app.use(cors())
app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// MongoDB Connection
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✓ MongoDB connected successfully")
    console.log(`  Database: ${MONGODB_URI}`)
  })
  .catch((err) => {
    console.error("✗ MongoDB connection error:", err.message)
    process.exit(1)
  })

// Routes
app.use("/api/sales", salesRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[ERROR]", err)
  res.status(500).json({ error: "Internal server error", message: err.message })
})

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`)
  console.log(`📡 API: http://localhost:${PORT}/api`)
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health\n`)
})
