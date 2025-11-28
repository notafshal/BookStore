import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Search, Trash2, UserCircle } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("⚠️ Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      setMessage("✅ User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("❌ Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-indigo-600 font-medium animate-pulse">
          Loading users...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10">
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center">
          👥 Admin — User Management
        </h2>

        {message && (
          <p className="text-center text-sm text-gray-700 mb-4">{message}</p>
        )}

        <div className="flex items-center mb-8 bg-gray-100 rounded-full px-4 py-2 shadow-inner w-full md:w-1/2 mx-auto">
          <Search className="text-gray-500 w-5 h-5 mr-3" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>

        <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg shadow">
          <table className="min-w-full border-collapse">
            <thead className="bg-indigo-600 text-white text-sm">
              <tr>
                <th className="p-3 text-left">👤 Name</th>
                <th className="p-3 text-left">📧 Email</th>
                <th className="p-3 text-left">📍 Location</th>
                <th className="p-3 text-left">📱 Phone</th>
                <th className="p-3 text-center">🗑️ Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t hover:bg-indigo-50 transition duration-200"
                  >
                    <td className="p-3 font-medium text-gray-800">{u.name}</td>
                    <td className="p-3 text-gray-700">{u.email}</td>
                    <td className="p-3 text-gray-700">{u.location || "—"}</td>
                    <td className="p-3 text-gray-700">{u.number || "—"}</td>
                    <td className="p-3 text-center space-x-3">
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete User"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500 italic"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="grid md:hidden gap-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <div
                key={u.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex justify-between items-start hover:shadow-lg transition"
              >
                <div>
                  <p className="font-semibold text-indigo-700 text-lg">
                    {u.name}
                  </p>
                  <p className="text-gray-600 text-sm">{u.email}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    📍 {u.location || "No location"}
                  </p>
                  <p className="text-gray-500 text-sm">📱 {u.number || "—"}</p>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete User"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 italic mt-4">
              No users found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
