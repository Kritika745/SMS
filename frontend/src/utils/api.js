const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const fetchSales = async (params) => {
  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        // Handle arrays: &customerRegion=East&customerRegion=West
        value.forEach((v) => queryParams.append(key, v))
      } else {
        queryParams.append(key, value)
      }
    }
  })

  try {
    const response = await fetch(`${API_BASE_URL}/sales?${queryParams}`)
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Error ${response.status}`);
    }
    return await response.json()
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}

export const fetchFilterOptions = async () => {
  const response = await fetch(`${API_BASE_URL}/sales/filters/options`)
  if (!response.ok) throw new Error("Failed to fetch filter options")
  return response.json()
}