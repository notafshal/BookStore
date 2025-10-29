const books = [
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    image:
      "https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    image:
      "https://m.media-amazon.com/images/I/81bGKUa1e0L._AC_UF1000,1000_QL80_.jpg",
  },
  {
    title: "1984",
    author: "George Orwell",
    image:
      "https://www.penguin.co.uk/_next/image?url=https%3A%2F%2Fcdn.penguin.co.uk%2Fdam-assets%2Fbooks%2F9780141036144%2F9780141036144-jacket-large.jpg&w=614&q=100",
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    image:
      "https://grey.com.np/cdn/shop/products/book-cover-To-Kill-a-Mockingbird-many-1961.webp?v=1669894816",
  },
];

export default function FeaturedBooks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Featured Books
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {books.map((book, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg text-gray-800">
                  {book.title}
                </h3>
                <p className="text-gray-500 text-sm">{book.author}</p>
                <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
