/**
 * Helper script to convert Excel file to JSON
 * Usage: node convertExcel.js path/to/file.xlsx
 *
 * Install xlsx first: npm install xlsx
 */

import XLSX from "xlsx"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filePath = process.argv[2]

if (!filePath) {
  console.error("Usage: node convertExcel.js <path-to-excel-file>")
  process.exit(1)
}

try {
  console.log(`Reading Excel file: ${filePath}`)
  const workbook = XLSX.readFile(filePath)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const data = XLSX.utils.sheet_to_json(sheet)

  console.log(`Found ${data.length} rows`)

  // Map Excel columns to Sale schema
  const transformed = data.map((row, index) => ({
    transactionId: row.TransactionID || `TXN${String(index + 1).padStart(7, "0")}`,
    customerId: row.CustomerID || "",
    customerName: row.CustomerName || "",
    phoneNumber: row.PhoneNumber || "",
    gender: row.Gender || "Other",
    age: row.Age ? Number.parseInt(row.Age) : 25,
    customerRegion: row.CustomerRegion || "",
    customerType: row.CustomerType || "Regular",
    productId: row.ProductID || "",
    productName: row.ProductName || "",
    brand: row.Brand || "",
    productCategory: row.ProductCategory || "",
    tags: row.Tags ? row.Tags.split(",").map((t) => t.trim()) : [],
    quantity: row.Quantity ? Number.parseInt(row.Quantity) : 1,
    pricePerUnit: row.PricePerUnit ? Number.parseFloat(row.PricePerUnit) : 0,
    discountPercentage: row.DiscountPercentage ? Number.parseFloat(row.DiscountPercentage) : 0,
    totalAmount: row.TotalAmount ? Number.parseFloat(row.TotalAmount) : 0,
    finalAmount: row.FinalAmount ? Number.parseFloat(row.FinalAmount) : 0,
    date: row.Date ? new Date(row.Date) : new Date(),
    paymentMethod: row.PaymentMethod || "Cash",
    orderStatus: row.OrderStatus || "Completed",
    deliveryType: row.DeliveryType || "Standard",
    storeId: row.StoreID || "",
    storeLocation: row.StoreLocation || "",
    salespersonId: row.SalespersonID || "",
    employeeName: row.EmployeeName || "",
  }))

  const outputPath = path.join(__dirname, "converted_data.json")
  fs.writeFileSync(outputPath, JSON.stringify(transformed, null, 2))

  console.log(`✓ Successfully converted! Output: ${outputPath}`)
  console.log(`\nNext steps:`)
  console.log(`1. Review the converted data in: ${outputPath}`)
  console.log(`2. Update backend/scripts/seed.js to use this data`)
  console.log(`3. Run: npm run seed`)
} catch (error) {
  console.error("Error converting Excel:", error.message)
  process.exit(1)
}
