import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import Sale from "../src/models/Sale.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Sample data - in production, you would load from CSV/Excel
const generateSampleData = () => {
  const regions = ["North", "South", "East", "West", "Central", "Northeast"]
  const genders = ["Male", "Female", "Other"]
  const categories = ["Clothing", "Electronics", "Home & Garden", "Sports", "Beauty"]
  const paymentMethods = ["Credit Card", "Debit Card", "Cash", "UPI", "Wallet"]
  const tags = ["Premium", "Discount", "New", "Sale", "Limited Edition"]
  const statuses = ["Completed", "Pending", "Cancelled"]
  const deliveryTypes = ["Standard", "Express", "Same Day"]

  const data = []
  const startDate = new Date("2023-09-01")
  const endDate = new Date("2023-12-31")

  for (let i = 0; i < 500; i++) {
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
    const quantity = Math.floor(Math.random() * 50) + 1
    const pricePerUnit = Math.floor(Math.random() * 5000) + 100
    const discountPercentage = Math.floor(Math.random() * 50)
    const totalAmount = quantity * pricePerUnit
    const discountAmount = (totalAmount * discountPercentage) / 100
    const finalAmount = totalAmount - discountAmount

    data.push({
      transactionId: `TXN${String(i + 1).padStart(7, "0")}`,
      customerId: `CUST${String(Math.floor(Math.random() * 1000) + 10000).padStart(5, "0")}`,
      customerName: generateName(),
      phoneNumber: generatePhone(),
      gender: genders[Math.floor(Math.random() * genders.length)],
      age: Math.floor(Math.random() * 50) + 18,
      customerRegion: regions[Math.floor(Math.random() * regions.length)],
      customerType: Math.random() > 0.5 ? "Regular" : "Premium",
      productId: `PROD${String(Math.floor(Math.random() * 500) + 1).padStart(5, "0")}`,
      productName: generateProductName(),
      brand: generateBrand(),
      productCategory: categories[Math.floor(Math.random() * categories.length)],
      tags: [tags[Math.floor(Math.random() * tags.length)]],
      quantity,
      pricePerUnit,
      discountPercentage,
      totalAmount,
      finalAmount: Math.round(finalAmount),
      date: randomDate,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      orderStatus: statuses[Math.floor(Math.random() * statuses.length)],
      deliveryType: deliveryTypes[Math.floor(Math.random() * deliveryTypes.length)],
      storeId: `STORE${Math.floor(Math.random() * 20) + 1}`,
      storeLocation: regions[Math.floor(Math.random() * regions.length)],
      salespersonId: `SP${String(Math.floor(Math.random() * 100) + 1).padStart(3, "0")}`,
      employeeName: generateName(),
    })
  }

  return data
}

function generateName() {
  const firstNames = ["Neha", "Rajesh", "Priya", "Amit", "Isha", "Vikram", "Anjali", "Rohan", "Deepika", "Arjun"]
  const lastNames = ["Yadav", "Sharma", "Patel", "Kumar", "Singh", "Gupta", "Reddy", "Chopra", "Verma", "Nair"]
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
}

function generatePhone() {
  return `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`
}

function generateProductName() {
  const products = ["T-Shirt", "Jeans", "Shoes", "Laptop", "Phone", "Tablet", "Headphones", "Dress", "Jacket", "Shorts"]
  return products[Math.floor(Math.random() * products.length)]
}

function generateBrand() {
  const brands = ["Brand A", "Brand B", "Brand C", "Brand D", "Brand E", "Generic", "Premium"]
  return brands[Math.floor(Math.random() * brands.length)]
}

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/sales_management"

    console.log("Connecting to MongoDB...")
    await mongoose.connect(mongoUri)
    console.log("Connected to MongoDB")

    console.log("Clearing existing sales data...")
    await Sale.deleteMany({})

    console.log("Generating sample data...")
    const sampleData = generateSampleData()

    console.log("Inserting data into database...")
    const result = await Sale.insertMany(sampleData)
    console.log(`Successfully inserted ${result.length} sales records`)

    console.log("Creating indexes...")
    await Sale.collection.createIndex({ customerName: "text", phoneNumber: "text" })
    console.log("Indexes created successfully")

    console.log("Seeding completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
