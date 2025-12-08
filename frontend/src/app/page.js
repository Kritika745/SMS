"use client"

import { useState, useMemo, useEffect } from "react"
// import Sidebar from "@/components/Sidebar" // Uncomment if you have this
import SearchBar from "@/components/SearchBar"
import FilterDropdown from "@/components/FilterDropdown"
import StatCard from "@/components/StatCard"
import SalesTable from "@/components/SalesTable"
import Pagination from "@/components/Pagination"
import { useSalesData, useFilterOptions } from "@/hooks/useSalesData"

export default function Dashboard() {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  
  const [selectedFilters, setSelectedFilters] = useState({
    customerRegion: [],
    gender: [],
    productCategory: [],
    tags: [],
    paymentMethod: [],
    minAge: null,
    maxAge: null,
    startDate: "",
    endDate: "",
  })
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)

  const { options } = useFilterOptions()

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: 10,
      sortBy,
      sortOrder,
    }

    if (debouncedSearch) params.search = debouncedSearch

    // Add arrays only if populated
    if (selectedFilters.customerRegion.length) params.customerRegion = selectedFilters.customerRegion
    if (selectedFilters.gender.length) params.gender = selectedFilters.gender
    if (selectedFilters.productCategory.length) params.productCategory = selectedFilters.productCategory
    if (selectedFilters.tags.length) params.tags = selectedFilters.tags
    if (selectedFilters.paymentMethod.length) params.paymentMethod = selectedFilters.paymentMethod

    // Add ranges/dates
    if (selectedFilters.minAge) params.minAge = selectedFilters.minAge
    if (selectedFilters.maxAge) params.maxAge = selectedFilters.maxAge
    if (selectedFilters.startDate) params.startDate = selectedFilters.startDate
    if (selectedFilters.endDate) params.endDate = selectedFilters.endDate

    return params
  }, [debouncedSearch, selectedFilters, sortBy, sortOrder, currentPage])

  const { data, stats, pagination, loading, error } = useSalesData(queryParams)

  const handleFilterChange = (filterName, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterName]: Array.isArray(prev[filterName])
        ? prev[filterName].includes(value)
          ? prev[filterName].filter((v) => v !== value)
          : [...prev[filterName], value]
        : value,
    }))
    setCurrentPage(1)
  }

  const handleRangeChange = ({ min, max }) => {
    setSelectedFilters((prev) => ({
      ...prev,
      minAge: min ? Number.parseInt(min) : null,
      maxAge: max ? Number.parseInt(max) : null,
    }))
    setCurrentPage(1)
  }

  const handleDateRangeChange = (type, value) => {
    setSelectedFilters((prev) => ({ ...prev, [type]: value }))
    setCurrentPage(1)
  }

  // Sort Logic
  const handleSortChange = (value) => {
    if (value === "quantity") {
        setSortBy("quantity")
        setSortOrder("desc")
    } else if (value === "amount") {
        setSortBy("amount")
        setSortOrder("desc")
    } else if (value === "customerName") {
        setSortBy("customerName")
        setSortOrder("asc")
    } else {
        const [field, order] = value.split("-")
        setSortBy(field)
        setSortOrder(order)
    }
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearch("")
    setDebouncedSearch("")
    setSelectedFilters({
      customerRegion: [],
      gender: [],
      productCategory: [],
      tags: [],
      paymentMethod: [],
      minAge: null,
      maxAge: null,
      startDate: "",
      endDate: "",
    })
    setSortBy("date")
    setSortOrder("desc")
    setCurrentPage(1)
  }

  // Helper for select value
  const getCurrentSortValue = () => {
      if (sortBy === "quantity") return "quantity"
      if (sortBy === "amount") return "amount"
      if (sortBy === "customerName") return "customerName"
      return `${sortBy}-${sortOrder}`
  }

  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <main className="flex-1 min-h-screen bg-gray-50 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage and analyze your sales data</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
            <div className="flex flex-wrap gap-4 items-center">
                <div className="w-full md:w-64">
                    <SearchBar search={search} onSearchChange={setSearch} />
                </div>
                
                <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                <div className="flex flex-wrap gap-2 flex-1">
                    <FilterDropdown
                        label="Region"
                        options={options?.regions || []}
                        selected={selectedFilters.customerRegion}
                        onSelect={(v) => handleFilterChange("customerRegion", v)}
                        multi={true}
                    />
                    <FilterDropdown
                        label="Category"
                        options={options?.productCategories || []}
                        selected={selectedFilters.productCategory}
                        onSelect={(v) => handleFilterChange("productCategory", v)}
                        multi={true}
                    />
                    <FilterDropdown
                        label="Payment"
                        options={options?.paymentMethods || []}
                        selected={selectedFilters.paymentMethod}
                        onSelect={(v) => handleFilterChange("paymentMethod", v)}
                        multi={true}
                    />
                     <FilterDropdown
                        label="Gender"
                        options={options?.genders || []}
                        selected={selectedFilters.gender}
                        onSelect={(v) => handleFilterChange("gender", v)}
                        multi={true}
                    />
                </div>

                 <select
                    value={getCurrentSortValue()}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="quantity">Highest Quantity</option>
                    <option value="amount">Highest Amount</option>
                    <option value="customerName">Customer (A-Z)</option>
                </select>

                <button
                    onClick={handleClearFilters}
                    className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-2"
                >
                    Reset
                </button>
            </div>
            
            {/* Secondary Row for Dates/Age */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 items-center text-sm">
                 <div className="flex items-center gap-2">
                    <span className="text-gray-500">Date Range:</span>
                    <input
                        type="date"
                        value={selectedFilters.startDate}
                        onChange={(e) => handleDateRangeChange("startDate", e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded-md"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                        type="date"
                        value={selectedFilters.endDate}
                        onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
                        className="px-3 py-1.5 border border-gray-300 rounded-md"
                    />
                 </div>
                 
                 {/* Re-add Age Range if needed via FilterDropdown logic */}
            </div>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Units Sold" value={stats.totalUnitsSold} icon="📦" />
          <StatCard
            label="Total Revenue"
            value={`₹${(stats.totalAmount || 0).toLocaleString()}`}
            icon="💰"
          />
          <StatCard
            label="Total Discounts"
            value={`₹${(stats.totalDiscount || 0).toLocaleString()}`}
            icon="🏷️"
          />
        </div>

        <SalesTable data={data} loading={loading} />

        <div className="mt-6">
            {pagination.pages > 1 && (
            <Pagination current={pagination.current} pages={pagination.pages} onPageChange={setCurrentPage} />
            )}
        </div>
      </main>
    </div>
  )
}