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
  
    // 1. Search (Map to "Customer Name" or "Phone Number")
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" }
      query.$or = [
        { "Customer Name": searchRegex }, 
        { "Phone Number": searchRegex },
        { "Transaction ID": searchRegex }
      ]
    }
  
    // 2. Exact Match Filters
    if (customerRegion) {
      query["Customer Region"] = { $in: Array.isArray(customerRegion) ? customerRegion : [customerRegion] }
    }
  
    if (gender) {
      query["Gender"] = { $in: Array.isArray(gender) ? gender : [gender] }
    }
  
    if (productCategory) {
      query["Product Category"] = { $in: Array.isArray(productCategory) ? productCategory : [productCategory] }
    }
  
    if (paymentMethod) {
      query["Payment Method"] = { $in: Array.isArray(paymentMethod) ? paymentMethod : [paymentMethod] }
    }
  
    // 3. Tags (Handle string "organic,skincare")
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags]
      // Use regex to find the tag inside the comma-separated string
      query["Tags"] = { $regex: tagArray.join("|"), $options: "i" }
    }
  
    // 4. Age (Stored as String in DB)
    // Note: This does string comparison. "9" > "10" is False. "9" > "80" is True.
    if (minAge || maxAge) {
      query["Age"] = {}
      if (minAge) query["Age"].$gte = String(minAge)
      if (maxAge) query["Age"].$lte = String(maxAge)
    }
  
    // 5. Date (Stored as String YYYY-MM-DD)
    if (startDate || endDate) {
      query["Date"] = {}
      if (startDate) query["Date"].$gte = startDate // Assumes format matches YYYY-MM-DD
      if (endDate) query["Date"].$lte = endDate
    }
  
    return query
  }
  
  export const buildSort = (sortBy, sortOrder = "desc") => {
    const direction = sortOrder === "asc" ? 1 : -1
    const sortObj = {}
  
    // Map frontend camelCase to DB Title Case
    switch (sortBy) {
      case "date":
        sortObj["Date"] = direction
        break
      case "quantity":
        sortObj["Quantity"] = direction
        break
      case "amount":
        sortObj["Final Amount"] = direction
        break
      case "customerName":
        sortObj["Customer Name"] = direction
        break
      default:
        sortObj["Date"] = -1 
    }
  
    return sortObj
  }