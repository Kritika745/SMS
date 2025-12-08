"use client"

export default function SalesTable({ data, loading }) {
  if (loading) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="text-gray-500 text-sm">Loading sales data...</div>
            </div>
        </div>
    )
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500 bg-white border border-gray-200 rounded-lg">No sales data found</div>
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Trans. ID</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Gender</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Age</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Region</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Qty</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-3 text-gray-600 font-mono text-xs">{row.transactionId}</td>
              <td className="px-4 py-3 text-gray-900 whitespace-nowrap">
                {row.date ? new Date(row.date).toLocaleDateString() : "—"}
              </td>
              <td className="px-4 py-3 text-gray-900 font-medium">
                  {row.customerName}
                  <div className="text-xs text-gray-400 font-normal">{row.customerId}</div>
              </td>
              <td className="px-4 py-3 text-gray-600">{row.phoneNumber}</td>
              <td className="px-4 py-3 text-gray-600">{row.gender}</td>
              <td className="px-4 py-3 text-gray-600">{row.age}</td>
              <td className="px-4 py-3 text-gray-600">{row.customerRegion}</td>
              <td className="px-4 py-3 text-gray-900">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {row.productCategory}
                  </span>
              </td>
              <td className="px-4 py-3 text-gray-900 text-right font-medium">{row.quantity}</td>
              <td className="px-4 py-3 text-green-600 text-right font-medium">₹{row.finalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}