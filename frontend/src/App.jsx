import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BookDetail from "./pages/BookDetail";
import Cart from "./pages/Cart";

import Orders from "./pages/Orders";
import TrackOrder from "./pages/TrackOrder";

import AdminDashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import Favourites from "./pages/Favourites";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/admin" element={<AdminDashboard />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <ProtectedRoute>
                <TrackOrder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favourites"
            element={
              <ProtectedRoute>
                <Favourites />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <h2 className="text-center mt-20 text-2xl">Page Not Found</h2>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
