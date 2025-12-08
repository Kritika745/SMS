import Sale from "../models/Sale.js"
import { buildQuery, buildSort } from "../utils/queryBuilder.js"
import { validatePagination, sanitizeSearch } from "../utils/validators.js" // Removed age/date validators for simplicity
import { handleError } from "../utils/errorHandler.js"

export const getSales = async (req, res) => {
  try {
    let {
      search, customerRegion, gender, minAge, maxAge,
      productCategory, tags, paymentMethod, startDate, endDate,
      sortBy, sortOrder, page = 1, limit = 10,
    } = req.query

    // Sanitize
    search = sanitizeSearch(search)
    const { page: validPage, limit: validLimit } = validatePagination(page, limit)

    // Build Query
    const query = buildQuery({
      search, customerRegion, gender, minAge, maxAge,
      productCategory, tags, paymentMethod, startDate, endDate,
    })

    const sort = buildSort(sortBy, sortOrder)
    const skip = (validPage - 1) * validLimit

    // 1. Get Total Count
    const total = await Sale.countDocuments(query)

    // 2. Get Data (Collation allows natural sorting of number-strings if supported, else standard)
    // We try to use collation { numericOrdering: true } to fix the "100 vs 21" sort issue
    const sales = await Sale.find(query)
      .collation({ locale: "en_US", numericOrdering: true }) 
      .sort(sort)
      .skip(skip)
      .limit(validLimit)
      .lean()

    // 3. Get Stats (Must convert Strings to Numbers)
    const aggregates = await Sale.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          // Convert string to int/double before summing
          totalQuantity: { $sum: { $toInt: "$Quantity" } }, 
          totalAmount: { $sum: { $toDouble: "$Final Amount" } },
          // Recalculate discount based on converted values
          totalDiscount: { 
            $sum: { 
              $multiply: [
                { $toDouble: "$Total Amount" }, 
                { $divide: [{ $toDouble: "$Discount Percentage" }, 100] }
              ] 
            } 
          },
        },
      },
    ])

    const stats = aggregates[0] || { totalQuantity: 0, totalAmount: 0, totalDiscount: 0 }

    res.json({
      success: true,
      data: sales, // The raw data with spaces in keys
      stats: {
        totalUnitsSold: stats.totalQuantity || 0,
        totalAmount: Math.round(stats.totalAmount || 0),
        totalDiscount: Math.round(stats.totalDiscount || 0),
      },
      pagination: {
        current: validPage,
        limit: validLimit,
        total,
        pages: Math.ceil(total / validLimit),
      },
    })
  } catch (error) {
    const errorInfo = handleError(error)
    res.status(errorInfo.status || 500).json({ success: false, error: errorInfo.message })
  }
}

export const getFilterOptions = async (req, res) => {
  try {
    // Map to the keys with spaces
    const [regions, genders, categories, paymentMethods] = await Promise.all([
      Sale.distinct("Customer Region"),
      Sale.distinct("Gender"),
      Sale.distinct("Product Category"),
      Sale.distinct("Payment Method"),
    ])

    // For tags, we might need to fetch all and split them since they are strings
    // But for now, we'll try distinct
    const distinctTags = await Sale.distinct("Tags")

    res.json({
      success: true,
      filters: {
        regions: regions.filter(Boolean).sort(),
        genders: genders.filter(Boolean).sort(),
        productCategories: categories.filter(Boolean).sort(),
        paymentMethods: paymentMethods.filter(Boolean).sort(),
        tags: distinctTags.filter(Boolean),
        // Simplified age range for strings
        ageRange: { min: 18, max: 100 }, 
      },
    })
  } catch (error) {
    const errorInfo = handleError(error)
    res.status(errorInfo.status || 500).json({ success: false, error: errorInfo.message })
  }
}