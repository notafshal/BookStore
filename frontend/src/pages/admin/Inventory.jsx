import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Pencil, Trash2, PlusCircle, X } from "lucide-react";

export default function Inventory() {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    cover_image: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const { data } = await api.get("/books");
    setBooks(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingBook) {
      await api.put(`/books/${editingBook.id}`, bookData);
    } else {
      await api.post("/books", bookData);
    }

    fetchBooks();
    setShowForm(false);
    setEditingBook(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      await api.delete(`/books/${id}`);
      fetchBooks();
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setBookData(book);
    setShowForm(true);
  };

  const resetForm = () => {
    setBookData({
      title: "",
      author: "",
      category: "",
      description: "",
      price: "",
      stock: "",
      cover_image: "",
    });
  };

  return (
    <div className="p-6 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Inventory Management
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingBook(null);
            resetForm();
          }}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <PlusCircle className="mr-2 w-5 h-5" />
          {showForm ? "Close Form" : "Add Book"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">
            {editingBook ? "Edit Book" : "Add New Book"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-2 gap-4 text-gray-800"
          >
            <input
              type="text"
              placeholder="Title *"
              value={bookData.title}
              onChange={(e) =>
                setBookData({ ...bookData, title: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Author *"
              value={bookData.author}
              onChange={(e) =>
                setBookData({ ...bookData, author: e.target.value })
              }
              className="border p-2 rounded"
              required
            />
            <select
              value={bookData.category}
              onChange={(e) =>
                setBookData({ ...bookData, category: e.target.value })
              }
              className="border p-2 rounded capitalize bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="">Select Category</option>
              <option value="Programming">Programming</option>
              <option value="Fiction">Fiction</option>
              <option value="Finance">Finance</option>
              <option value="Science">Science</option>
              <option value="Technology">Technology</option>
              <option value="History">History</option>
              <option value="Biography">Biography</option>
              <option value="Self Help">Self Help</option>
              <option value="Philosophy">Philosophy</option>
              <option value="Art">Art</option>
              <option value="Comics">Comics</option>
              <option value="Health">Health</option>
              <option value="Travel">Travel</option>
              <option value="Education">Education</option>
              <option value="Poetry">Poetry</option>
            </select>

            <input
              type="number"
              placeholder="Price"
              value={bookData.price}
              onChange={(e) =>
                setBookData({ ...bookData, price: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Stock"
              value={bookData.stock}
              onChange={(e) =>
                setBookData({ ...bookData, stock: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Cover Image URL"
              value={bookData.cover_image}
              onChange={(e) =>
                setBookData({ ...bookData, cover_image: e.target.value })
              }
              className="border p-2 rounded"
            />
            <textarea
              placeholder="Description"
              value={bookData.description}
              onChange={(e) =>
                setBookData({ ...bookData, description: e.target.value })
              }
              className="border p-2 rounded col-span-full"
              rows="3"
            />
            <button
              type="submit"
              className="col-span-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {editingBook ? "Update Book" : "Add Book"}
            </button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg border">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Cover</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Author</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                key={book.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                      No Image
                    </div>
                  )}
                </td>
                <td className="p-3">{book.title}</td>
                <td className="p-3">{book.author}</td>
                <td className="p-3">{book.category || "-"}</td>
                <td className="p-3 text-center">${book.price || "—"}</td>
                <td className="p-3 text-center">{book.stock || 0}</td>
                <td className="p-3 text-center flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No books available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
