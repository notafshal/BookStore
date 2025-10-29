import { useEffect, useState } from "react";
import api from "../api/axios";
import BookCard from "./BookCard";

export default function FeaturedBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api
      .get("/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Featured Books</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
