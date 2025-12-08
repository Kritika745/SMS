import Sale from "../models/Sale.js"
import { buildQuery, buildSort } from "../utils/queryBuilder.js"
import { validateAgeRange, validateDateRange, sanitizeSearch, validatePagination } from "../utils/validators.js"
import { handleError } from "../utils/errorHandler.js"

export const getSales = async (req, res) => {
  try {
    let {
      search,
      customerRegion,
      gender,
      minAge,
      maxAge,
      productCategory,
      tags,
      paymentMethod,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = req.query

    // Validate and handle edge cases
    const ageValidation = validateAgeRange(
      minAge ? Number.parseInt(minAge) : null,
      maxAge ? Number.parseInt(maxAge) : null,
    )
    if (!ageValidation.valid) {
      return res.status(400).json({ success: false, error: ageValidation.error })
    }

    const dateValidation = validateDateRange(startDate, endDate)
    if (!dateValidation.valid) {
      return res.status(400).json({ success: false, error: dateValidation.error })
    }

    const { page: validPage, limit: validLimit } = validatePagination(page, limit)
    page = validPage
    limit = validLimit

    // Sanitize search
    search = sanitizeSearch(search)

    // Build query based on filters and search
    const query = buildQuery({
      search,
      customerRegion,
      gender,
      minAge: minAge ? Number.parseInt(minAge) : null,
      maxAge: maxAge ? Number.parseInt(maxAge) : null,
      productCategory,
      tags,
      paymentMethod,
      startDate,
      endDate,
    })

    // Build sort object
    const sort = buildSort(sortBy, sortOrder)

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get total count for pagination
    const total = await Sale.countDocuments(query)

    // Get paginated results
    const sales = await Sale.find(query).sort(sort).skip(skip).limit(limit).lean()

    // Calculate aggregates
    const aggregates = await Sale.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          totalAmount: { $sum: "$finalAmount" },
          totalDiscount: { $sum: { $multiply: ["$totalAmount", { $divide: ["$discountPercentage", 100] }] } },
        },
      },
    ])

    const stats = aggregates[0] || { totalQuantity: 0, totalAmount: 0, totalDiscount: 0 }

    res.json({
      success: true,
      data: sales,
      stats: {
        totalUnitsSold: stats.totalQuantity || 0,
        totalAmount: Math.round(stats.totalAmount || 0),
        totalDiscount: Math.round(stats.totalDiscount || 0),
      },
      pagination: {
        current: page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    const errorInfo = handleError(error)
    console.error("Error fetching sales:", error)
    res.status(errorInfo.status || 500).json({ success: false, error: errorInfo.message })
  }
}

export const getFilterOptions = async (req, res) => {
  try {
    const [regions, genders, categories, paymentMethods, tags] = await Promise.all([
      Sale.distinct("customerRegion"),
      Sale.distinct("gender"),
      Sale.distinct("productCategory"),
      Sale.distinct("paymentMethod"),
      Sale.distinct("tags"),
    ])

    const ages = await Sale.find({}, "age").sort({ age: 1 }).lean()
    const uniqueAges = [...new Set(ages.map((a) => a.age))].sort((a, b) => a - b)

    res.json({
      success: true,
      filters: {
        regions: regions.filter(Boolean).sort(),
        genders: genders.filter(Boolean).sort(),
        productCategories: categories.filter(Boolean).sort(),
        paymentMethods: paymentMethods.filter(Boolean).sort(),
        tags: tags.filter(Boolean).sort(),
        ageRange: {
          min: uniqueAges.length > 0 ? Math.min(...uniqueAges) : 0,
          max: uniqueAges.length > 0 ? Math.max(...uniqueAges) : 100,
        },
      },
    })
  } catch (error) {
    const errorInfo = handleError(error)
    console.error("Error fetching filter options:", error)
    res.status(errorInfo.status || 500).json({ success: false, error: errorInfo.message })
  }
}
