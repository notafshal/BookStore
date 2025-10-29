import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-lg">
      <img
        src={book.cover_image || "/placeholder.jpg"}
        alt={book.title}
        className="h-48 w-full object-cover mb-3"
      />
      <h3 className="font-semibold text-lg">{book.title}</h3>
      <p className="text-gray-600">${book.price}</p>
      <Link
        to={`/books/${book.id}`}
        className="inline-block mt-3 bg-blue-500 text-white px-4 py-2 rounded"
      >
        View Details
      </Link>
    </div>
  );
}
