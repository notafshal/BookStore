export default function FilterSidebar({
  category,
  setCategory,
  price,
  setPrice,
  sort,
  setSort,
}) {
  return (
    <aside className="bg-white rounded-xl shadow p-5 h-fit sticky top-24">
      <h2 className="font-bold text-lg mb-5">Filters</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Category</h3>
        <select
          className="w-full border rounded px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          <option value="fiction">Fiction</option>
          <option value="history">History</option>
          <option value="Programming">Programming</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Max Price: ${price}</h3>
        <input
          type="range"
          min="0"
          max="100"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <h3 className="font-semibold mb-2">Sort By</h3>
        <select
          className="w-full border rounded px-3 py-2"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">None</option>
          <option value="price">Price: Low → High</option>
          <option value="az">Title: A → Z</option>
        </select>
      </div>
    </aside>
  );
}
