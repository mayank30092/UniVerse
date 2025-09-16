import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-5 flex justify-between items-center shadow">
      <Link to="/" className="text-2xl font-bold">
        Universe
      </Link>
      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:text-gray-200 transition font-medium">
          Home
        </Link>
        <Link
          to="/about"
          className="hover:text-gray-200 transition font-medium"
        >
          About Us
        </Link>
        <Link
          to="/contact"
          className="hover:text-gray-200 transition font-medium"
        >
          Contact
        </Link>
        {user?.role === "student" && (
          <Link to="/student" className="hover:underline">
            Student Dashboard
          </Link>
        )}
        {user?.role === "admin" && (
          <Link to="/admin" className="hover:underline">
            Admin Dashboard
          </Link>
        )}
        {!user && (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
        {user && (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 font-medium px-3 py-1 rounded-lg hover:bg-gray-100"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
