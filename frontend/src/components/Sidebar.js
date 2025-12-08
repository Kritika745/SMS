"use client"

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">V</span>
          </div>
          <div>
            <p className="font-semibold text-sm">Vault</p>
            <p className="text-xs text-gray-500">Anurag Yadav</p>
          </div>
          <button className="ml-auto text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <nav className="space-y-2">
        <NavItem icon="📊" label="Dashboard" active={true} />
        <NavItem icon="🔗" label="Nexus" />
        <NavItem icon="📥" label="Intake" />
        <NavItem icon="⚙️" label="Services" />

        <div className="pt-4 mt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-semibold px-3 py-2">INVOICES</p>
          <NavItem icon="📄" label="Proforma Invoices" indent={true} />
          <NavItem icon="✅" label="Final Invoices" indent={true} />
        </div>
      </nav>
    </aside>
  )
}

function NavItem({ icon, label, active = false, indent = false }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        active ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"
      } ${indent ? "ml-4" : ""}`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  )
}
