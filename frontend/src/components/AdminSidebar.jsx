export default function AdminSidebar({ activeTab, setActiveTab }) {
  const items = [
    { id: "inventory", label: "Inventory Management" },
    { id: "orders", label: "Order Management" },
    { id: "users", label: "User Management" },
    { id: "reports", label: "Reports & Analytics" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md p-5">
      <h2 className="text-xl font-bold mb-6 text-indigo-600">Admin Panel</h2>
      <nav>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`block w-full text-left px-4 py-2 rounded-md mb-2 ${
              activeTab === item.id
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
