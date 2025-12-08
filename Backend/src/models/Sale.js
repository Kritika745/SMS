import mongoose from "mongoose"

const saleSchema = new mongoose.Schema(
  {
    // We use quote marks because the keys have spaces
    "Transaction ID": { type: String, index: true },
    "Date": { type: String, index: true }, // Stored as String YYYY-MM-DD
    "Customer ID": String,
    "Customer Name": { type: String, index: true },
    "Phone Number": String,
    "Gender": String,
    "Age": String, // Stored as String
    "Customer Region": String,
    "Customer Type": String,
    "Product ID": String,
    "Product Name": String,
    "Brand": String,
    "Product Category": String,
    "Tags": String, // The screenshot shows this might be a single string "organic,skincare"
    "Quantity": String,
    "Price per Unit": String,
    "Discount Percentage": String,
    "Total Amount": String,
    "Final Amount": String,
    "Payment Method": String,
    "Order Status": String,
    "Delivery Type": String,
    "Store ID": String,
    "Store Location": String,
    "Salesperson ID": String,
    "Employee Name": String,
  },
  { 
    timestamps: true, // This adds createdAt/updatedAt, which you might not have in the raw data
    strict: false // IMPORTANT: This allows fields not in schema to still return
  }
)

export default mongoose.model("Sale", saleSchema)