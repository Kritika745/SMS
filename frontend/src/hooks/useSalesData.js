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
      setData(result.data || [])
      setStats(result.stats || {})
      setPagination(result.pagination || {})
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
