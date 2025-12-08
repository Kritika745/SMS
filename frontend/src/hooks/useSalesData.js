"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchSales, fetchFilterOptions } from "@/utils/api"

export const useSalesData = (filters) => {
  const [data, setData] = useState([])
  const [stats, setStats] = useState({ totalUnitsSold: 0, totalAmount: 0, totalDiscount: 0 })
  const [pagination, setPagination] = useState({ current: 1, limit: 10, total: 0, pages: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadSales = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchSales(filters)
      
      // --- CRITICAL: THE ADAPTER PATTERN ---
      // We map the "Messy" DB keys (with spaces) to "Clean" Frontend keys (camelCase)
      const adaptedData = (result.data || []).map((item) => ({
        // Map Keys
        transactionId: item["Transaction ID"],
        date: item["Date"],
        customerId: item["Customer ID"],
        customerName: item["Customer Name"],
        phoneNumber: item["Phone Number"],
        gender: item["Gender"],
        age: item["Age"],
        customerRegion: item["Customer Region"],
        productCategory: item["Product Category"],
        productName: item["Product Name"],
        brand: item["Brand"],
        quantity: item["Quantity"],
        pricePerUnit: item["Price per Unit"],
        finalAmount: item["Final Amount"],
        paymentMethod: item["Payment Method"],
        
        // Keep the original item just in case you need a field we didn't map
        ...item, 
      }))

      setData(adaptedData)
      setStats(result.stats || { totalUnitsSold: 0, totalAmount: 0, totalDiscount: 0 })
      setPagination(result.pagination || { current: 1, limit: 10, total: 0, pages: 0 })
    } catch (err) {
      setError(err.message)
      console.error("Error fetching sales:", err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadSales()
  }, [loadSales])

  return { data, stats, pagination, loading, error }
}

export const useFilterOptions = () => {
  const [options, setOptions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchFilterOptions()
        setOptions(result.filters)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { options, loading, error }
}