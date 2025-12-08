export const handleError = (error) => {
  console.error("Error:", error)

  // Validation errors
  if (error.name === "ValidationError") {
    return {
      status: 400,
      message: "Invalid data provided",
      details: Object.values(error.errors).map((e) => e.message),
    }
  }

  // Cast errors (invalid MongoDB ID)
  if (error.name === "CastError") {
    return {
      status: 400,
      message: "Invalid ID format",
    }
  }

  // Duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    return {
      status: 409,
      message: `${field} already exists`,
    }
  }

  // Default error
  return {
    status: 500,
    message: "Internal server error",
  }
}
