import mongoose from "mongoose"

const saleSchema = new mongoose.Schema(
  {
    // Customer Fields
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      index: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
      index: true,
    },
    age: {
      type: Number,
      required: true,
      index: true,
    },
    customerRegion: {
      type: String,
      required: true,
      index: true,
    },
    customerType: String,

    // Product Fields
    productId: String,
    productName: String,
    brand: String,
    productCategory: {
      type: String,
      required: true,
      index: true,
    },
    tags: [String],

    // Sales Fields
    quantity: {
      type: Number,
      required: true,
    },
    pricePerUnit: Number,
    discountPercentage: Number,
    totalAmount: Number,
    finalAmount: Number,

    // Operational Fields
    date: {
      type: Date,
      required: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      index: true,
    },
    orderStatus: String,
    deliveryType: String,
    storeId: String,
    storeLocation: String,
    salespersonId: String,
    employeeName: String,

    // Transaction ID for reference
    transactionId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model("Sale", saleSchema)
