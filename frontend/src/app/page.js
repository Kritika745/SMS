"use client"

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import SearchBar from "@/components/SearchBar"
import FilterDropdown from "@/components/FilterDropdown"
import StatCard from "@/components/StatCard"
import SalesTable from "@/components/SalesTable"
import Pagination from "@/components/Pagination"
import { useSalesData, useFilterOptions } from "@/hooks/useSalesData"

export default function Dashboard() {
  const [search, setSearch] = useState("")
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

  const { options, loading: optionsLoading } = useFilterOptions()

  // Build query parameters
  const queryParams = {
    search,
    customerRegion: selectedFilters.customerRegion.length > 0 ? selectedFilters.customerRegion : undefined,
    gender: selectedFilters.gender.length > 0 ? selectedFilters.gender : undefined,
    productCategory: selectedFilters.productCategory.length > 0 ? selectedFilters.productCategory : undefined,
    tags: selectedFilters.tags.length > 0 ? selectedFilters.tags : undefined,
    paymentMethod: selectedFilters.paymentMethod.length > 0 ? selectedFilters.paymentMethod : undefined,
    minAge: selectedFilters.minAge,
    maxAge: selectedFilters.maxAge,
    startDate: selectedFilters.startDate,
    endDate: selectedFilters.endDate,
    sortBy,
    sortOrder,
    page: currentPage,
    limit: 10,
  }

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
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: value,
    }))
    setCurrentPage(1)
  }

  const handleSortChange = (value) => {
    if (value === "date-asc") {
      setSortBy("date")
      setSortOrder("asc")
    } else if (value === "date" || value === "date-desc") {
      setSortBy("date")
      setSortOrder("desc")
    } else if (value === "quantity") {
      setSortBy("quantity")
      setSortOrder("desc")
    } else if (value === "customerName") {
      setSortBy("customerName")
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearch("")
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

  return (
    <div className="flex">
      <Sidebar />

      <main className="ml-64 flex-1 min-h-screen bg-gray-50 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sales Management System</h1>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <SearchBar search={search} onSearchChange={setSearch} />

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-3">
            <FilterDropdown
              label="Customer Region"
              options={options?.regions || []}
              selected={selectedFilters.customerRegion}
              onSelect={(value) => handleFilterChange("customerRegion", value)}
              multi={true}
            />

            <FilterDropdown
              label="Gender"
              options={options?.genders || []}
              selected={selectedFilters.gender}
              onSelect={(value) => handleFilterChange("gender", value)}
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
              onSelect={(value) => handleFilterChange("productCategory", value)}
              multi={true}
            />

            <FilterDropdown
              label="Tags"
              options={options?.tags || []}
              selected={selectedFilters.tags}
              onSelect={(value) => handleFilterChange("tags", value)}
              multi={true}
            />

            <FilterDropdown
              label="Payment Method"
              options={options?.paymentMethods || []}
              selected={selectedFilters.paymentMethod}
              onSelect={(value) => handleFilterChange("paymentMethod", value)}
              multi={true}
            />

            {/* Date Range Filters */}
            <div className="flex gap-2">
              <input
                type="date"
                value={selectedFilters.startDate}
                onChange={(e) => handleDateRangeChange("startDate", e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={selectedFilters.endDate}
                onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortOrder === "asc" && sortBy === "date" ? "date-asc" : sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Sort by: Date (Newest First)</option>
              <option value="date-asc">Sort by: Date (Oldest First)</option>
              <option value="quantity">Sort by: Quantity</option>
              <option value="customerName">Sort by: Customer Name (A–Z)</option>
            </select>

            {/* Clear Filters Button */}
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

        {/* Stats Cards */}
        <div className="flex gap-4 mb-6">
          <StatCard label="Total units sold" value={stats.totalUnitsSold} icon="📦" />
          <StatCard
            label="Total Amount"
            value={`₹${(stats.totalAmount / 1000).toFixed(0)} (${(stats.totalAmount / 1000).toFixed(0)} SRs)`}
            icon="💰"
          />
          <StatCard
            label="Total Discount"
            value={`₹${(stats.totalDiscount / 1000).toFixed(0)} (${(stats.totalDiscount / 1000).toFixed(0)} SRs)`}
            icon="🏷️"
          />
        </div>

        {/* Sales Table */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <SalesTable data={data} loading={loading} />
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <Pagination current={pagination.current} pages={pagination.pages} onPageChange={setCurrentPage} />
        )}
      </main>
    </div>
  )
}
