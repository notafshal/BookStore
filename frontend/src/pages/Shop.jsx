import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";
import BookCard from "../components/BookCard";
import FilterSidebar from "../components/FilterSidebar";
import SkeletonCard from "../components/SkeletonCard";

export default function Shop() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("all");
  const [price, setPrice] = useState(100);
  const [sort, setSort] = useState("");

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const search = query.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await api.get("/books");
        setBooks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    let result = [...books];

    if (search) {
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(search) ||
          b.author?.toLowerCase().includes(search)
      );
    }

    if (category !== "all") {
      result = result.filter((b) => b.category === category);
    }

    result = result.filter((b) => b.price <= price);

    if (sort === "price") result.sort((a, b) => a.price - b.price);
    if (sort === "az") result.sort((a, b) => a.title.localeCompare(b.title));

    setFilteredBooks(result);
  }, [books, search, category, price, sort]);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-5 py-16">
        <h1 className="text-4xl font-bold text-indigo-700 text-center mb-14">
          🛍️ Explore Books
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FilterSidebar
            category={category}
            setCategory={setCategory}
            price={price}
            setPrice={setPrice}
            sort={sort}
            setSort={setSort}
          />

          <section className="md:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredBooks.length === 0 ? (
              <p className="text-center text-gray-500">
                No books found{search && ` for "${search}"`}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}
