export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-indigo-600 to-blue-500 text-white py-32 text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Discover Your Next Favorite Book
      </h1>
      <p className="text-lg md:text-xl mb-8 text-white/90">
        Browse thousands of books, from timeless classics to modern hits.
      </p>
      <button className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-indigo-100 transition">
        Start Exploring
      </button>
    </section>
  );
}
