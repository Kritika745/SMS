"use client"

export default function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-600 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
