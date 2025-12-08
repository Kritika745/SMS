"use client"

import { useState, useMemo, useEffect } from "react"
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

    if (selectedFilters.customerRegion.length) params.customerRegion = selectedFilters.customerRegion
    if (selectedFilters.gender.length) params.gender = selectedFilters.gender
    if (selectedFilters.productCategory.length) params.productCategory = selectedFilters.productCategory
    if (selectedFilters.tags.length) params.tags = selectedFilters.tags
    if (selectedFilters.paymentMethod.length) params.paymentMethod = selectedFilters.paymentMethod

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

  const getCurrentSortValue = () => {
    if (sortBy === "quantity") return "quantity"
    if (sortBy === "amount") return "amount"
    if (sortBy === "customerName") return "customerName"
    return `${sortBy}-${sortOrder}`
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Sales Management System</h1>
          <div className="w-80">
            <SearchBar search={search} onSearchChange={setSearch} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="bg-gray-50 min-h-screen">
        {/* Filter Section */}
        <div className="px-8 py-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-wrap gap-3 items-center">
              {/* Reset Button with Icon */}
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>

              {/* Filter Dropdowns */}
              <FilterDropdown
                label="Customer Region"
                options={options?.regions || []}
                selected={selectedFilters.customerRegion}
                onSelect={(v) => handleFilterChange("customerRegion", v)}
                multi={true}
              />
              <FilterDropdown
                label="Gender"
                options={options?.genders || []}
                selected={selectedFilters.gender}
                onSelect={(v) => handleFilterChange("gender", v)}
                multi={true}
              />
              <FilterDropdown
                label="Age Range"
                isRange={true}
                minValue={selectedFilters.minAge}
                maxValue={selectedFilters.maxAge}
                onRangeChange={handleRangeChange}
              />
              <FilterDropdown
                label="Product Category"
                options={options?.productCategories || []}
                selected={selectedFilters.productCategory}
                onSelect={(v) => handleFilterChange("productCategory", v)}
                multi={true}
              />
              <FilterDropdown
                label="Tags"
                options={options?.tags || []}
                selected={selectedFilters.tags}
                onSelect={(v) => handleFilterChange("tags", v)}
                multi={true}
              />
              <FilterDropdown
                label="Payment Method"
                options={options?.paymentMethods || []}
                selected={selectedFilters.paymentMethod}
                onSelect={(v) => handleFilterChange("paymentMethod", v)}
                multi={true}
              />
              <FilterDropdown
                label="Date"
                options={["All", "Today", "This Week", "This Month"]}
                selected={selectedFilters.startDate}
                onSelect={(v) => handleDateRangeChange("startDate", v)}
                multi={false}
              />

              <div className="flex-1"></div>

              {/* Sort Dropdown */}
              <select
                value={getCurrentSortValue()}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
              >
                <option value="date-desc">Sort by: Customer Name (A-Z)</option>
                <option value="date-asc">Oldest First</option>
                <option value="quantity">Highest Quantity</option>
                <option value="amount">Highest Amount</option>
                <option value="customerName">Customer (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="px-8">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Total units sold" value={stats.totalUnitsSold} />
            <StatCard label="Total Amount" value={`₹${(stats.totalAmount || 0).toLocaleString()} (19 SRs)`} />
            <StatCard label="Total Discount" value={`₹${(stats.totalDiscount || 0).toLocaleString()} (45 SRs)`} />
          </div>
        </div>

        {error && <div className="mx-8 mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

        {/* Sales Table Section */}
        <div className="px-8 pb-8">
          <SalesTable data={data} loading={loading} />
        </div>

        {/* Pagination Section */}
        {pagination.pages > 1 && (
          <div className="px-8 pb-8">
            <Pagination current={pagination.current} pages={pagination.pages} onPageChange={setCurrentPage} />
          </div>
        )}
      </main>
    </div>
  )
}
