const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export const fetchSales = async (params) => {
  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => queryParams.append(key, v))
      } else {
        queryParams.append(key, value)
      }
    }
  })

  const response = await fetch(`${API_BASE_URL}/sales?${queryParams}`)
  if (!response.ok) throw new Error("Failed to fetch sales")
  return response.json()
}

export const fetchFilterOptions = async () => {
  const response = await fetch(`${API_BASE_URL}/sales/filters/options`)
  if (!response.ok) throw new Error("Failed to fetch filter options")
  return response.json()
}
