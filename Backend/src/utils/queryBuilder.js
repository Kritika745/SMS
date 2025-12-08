export const buildQuery = ({
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
}) => {
  const query = {}

  // Search: Customer Name or Phone Number (case-insensitive)
  if (search && search.trim()) {
    const searchRegex = { $regex: search.trim(), $options: "i" }
    query.$or = [{ customerName: searchRegex }, { phoneNumber: searchRegex }]
  }

  // Filters
  if (customerRegion) {
    const regions = Array.isArray(customerRegion) ? customerRegion : [customerRegion]
    query.customerRegion = { $in: regions }
  }

  if (gender) {
    const genders = Array.isArray(gender) ? gender : [gender]
    query.gender = { $in: genders }
  }

  if (minAge !== null || maxAge !== null) {
    query.age = {}
    if (minAge !== null) query.age.$gte = minAge
    if (maxAge !== null) query.age.$lte = maxAge
  }

  if (productCategory) {
    const categories = Array.isArray(productCategory) ? productCategory : [productCategory]
    query.productCategory = { $in: categories }
  }

  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : [tags]
    query.tags = { $in: tagArray }
  }

  if (paymentMethod) {
    const methods = Array.isArray(paymentMethod) ? paymentMethod : [paymentMethod]
    query.paymentMethod = { $in: methods }
  }

  // Date Range Filter
  if (startDate || endDate) {
    query.date = {}
    if (startDate) {
      query.date.$gte = new Date(startDate)
    }
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      query.date.$lte = end
    }
  }

  return query
}

export const buildSort = (sortBy, sortOrder = "desc") => {
  const sortObj = {}

  switch (sortBy) {
    case "date":
      sortObj.date = sortOrder === "asc" ? 1 : -1
      break
    case "quantity":
      sortObj.quantity = sortOrder === "asc" ? 1 : -1
      break
    case "customerName":
      sortObj.customerName = sortOrder === "asc" ? 1 : -1
      break
    default:
      sortObj.date = -1 // Default: newest first
  }

  return sortObj
}
