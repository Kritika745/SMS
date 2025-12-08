"use client"

import { useState, useRef, useEffect } from "react"

export default function FilterDropdown({
  label,
  options,
  selected,
  onSelect,
  multi = true,
  isRange = false,
  minValue,
  maxValue,
  onRangeChange,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (isRange) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          {label}
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-20 p-4">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600">Min Age</label>
                <input
                  type="number"
                  value={minValue || ""}
                  onChange={(e) => onRangeChange({ min: e.target.value, max: maxValue })}
                  className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Max Age</label>
                <input
                  type="number"
                  value={maxValue || ""}
                  onChange={(e) => onRangeChange({ min: minValue, max: e.target.value })}
                  className="w-full mt-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
      >
        {label}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto min-w-max">
          {options && options.length > 0 ? (
            options.map((option) => (
              <label key={option} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">
                <input
                  type={multi ? "checkbox" : "radio"}
                  checked={Array.isArray(selected) ? selected.includes(option) : selected === option}
                  onChange={() => onSelect(option)}
                  className="w-4 h-4"
                />
                {option}
              </label>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">No options</div>
          )}
        </div>
      )}
    </div>
  )
}
