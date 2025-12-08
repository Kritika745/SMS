"use client"

export default function Pagination({ current, pages, onPageChange }) {
  const getPageNumbers = () => {
    const pages_array = []
    const maxVisible = 6

    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) {
        pages_array.push(i)
      }
    } else {
      pages_array.push(1)
      if (current > 3) pages_array.push("...")

      const start = Math.max(2, current - 1)
      const end = Math.min(pages - 1, current + 1)

      for (let i = start; i <= end; i++) {
        pages_array.push(i)
      }

      if (current < pages - 2) pages_array.push("...")
      pages_array.push(pages)
    }

    return pages_array
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      {pageNumbers.map((num, idx) => (
        <button
          key={idx}
          onClick={() => typeof num === "number" && onPageChange(num)}
          disabled={typeof num !== "number"}
          className={`px-3 py-1 text-sm rounded border transition-colors ${
            num === current
              ? "bg-gray-900 text-white border-gray-900"
              : typeof num === "number"
                ? "border-gray-300 hover:bg-gray-50"
                : "border-gray-300 cursor-default"
          }`}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(pages, current + 1))}
        disabled={current === pages}
        className="px-3 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  )
}
