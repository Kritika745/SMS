"use client"

export default function SalesTable({ data, loading }) {
  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">No sales data found</div>
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Transaction ID</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer ID</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer name</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone Number</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Gender</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Age</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Product Category</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-900">{row.transactionId}</td>
              <td className="px-4 py-3 text-gray-900">{new Date(row.date).toISOString().split("T")[0]}</td>
              <td className="px-4 py-3 text-gray-900">{row.customerId}</td>
              <td className="px-4 py-3 text-gray-900">{row.customerName}</td>
              <td className="px-4 py-3 text-gray-900">
                <div className="flex items-center gap-1">
                  {row.phoneNumber}
                  <svg
                    className="w-4 h-4 text-gray-400 cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-900">{row.gender}</td>
              <td className="px-4 py-3 text-gray-900">{row.age}</td>
              <td className="px-4 py-3 text-gray-900 font-medium">{row.productCategory}</td>
              <td className="px-4 py-3 text-gray-900 font-medium">{String(row.quantity).padStart(2, "0")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
