import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  return (
    <div className="group bg-white rounded-2xl shadow hover:shadow-xl transition p-4 relative">
      <div className="absolute top-3 left-3 flex gap-2">
        {book.featured && (
          <span className="text-xs bg-yellow-400 px-2 py-1 rounded-full">
            Featured
          </span>
        )}
        {book.popular && (
          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
            Popular
          </span>
        )}
      </div>

      <img
        src={book.cover_image || "/placeholder-book.jpg"}
        alt={book.title}
        className="w-full h-60 object-cover rounded-xl mb-4"
      />

      <h2 className="font-bold text-lg group-hover:text-indigo-600 transition">
        {book.title}
      </h2>
      <p className="text-gray-500 text-sm">{book.author}</p>

      <div className="flex items-center justify-between mt-3">
        <span className="text-indigo-700 font-bold">${book.price}</span>
        <Link
          to={`/books/${book.id}`}
          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <button>View</button>
        </Link>
      </div>
    </div>
  );
}
