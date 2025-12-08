// Validate age range to prevent invalid queries
export const validateAgeRange = (minAge, maxAge) => {
  if (minAge && maxAge && minAge > maxAge) {
    return { valid: false, error: "Min age cannot be greater than max age" }
  }

  if (minAge && minAge < 0) {
    return { valid: false, error: "Age cannot be negative" }
  }

  if (maxAge && maxAge > 150) {
    return { valid: false, error: "Age seems invalid" }
  }

  return { valid: true }
}

// Validate date range
export const validateDateRange = (startDate, endDate) => {
  if (startDate && endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return { valid: false, error: "Invalid date format" }
    }

    if (start > end) {
      return { valid: false, error: "Start date cannot be after end date" }
    }
  }

  return { valid: true }
}

// Sanitize search input
export const sanitizeSearch = (search) => {
  if (!search) return ""
  return search.trim().substring(0, 100) // Limit search to 100 chars
}

// Validate pagination
export const validatePagination = (page, limit) => {
  const pageNum = Number.parseInt(page) || 1
  const limitNum = Number.parseInt(limit) || 10

  return {
    page: Math.max(1, pageNum),
    limit: Math.max(1, Math.min(limitNum, 100)), // Max 100 items per page
  }
}
