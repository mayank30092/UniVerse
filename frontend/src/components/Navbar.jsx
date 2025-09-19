import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full px-6">
      <nav className="bg-blue-600/95 text-white px-10 py-4 flex justify-between items-center rounded-3xl shadow-xl max-w-5xl mx-auto fixed top-4 left-1/2 transform -translate-x-1/2 z-50 gap-16 mt-4">
        <NavLink to="/" className="text-2xl font-bold mr-24">
          Uni<i>Verse</i>
        </NavLink>
        <div className="flex gap-6 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-medium transition hover:text-gray-200 ${
                isActive ? "underline underline-offset-5" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `inline-flex items-center font-medium transition hover:text-gray-200 ${
                isActive ? "underline underline-offset-4" : ""
              }`
            }
          >
            <span>About</span>&nbsp;
            <span>us</span>
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `font-medium transition hover:text-gray-200 ${
                isActive ? "underline underline-offset-4" : ""
              }`
            }
          >
            Contact
          </NavLink>
          {user?.role === "student" && (
            <NavLink
              to="/student"
              className={({ isActive }) =>
                `inline-flex items-center font-medium transition hover:text-gray-200 ${
                  isActive ? "underline underline-offset-4" : ""
                }`
              }
            >
              <span>Student </span>&nbsp;
              <span>Dashboard</span>
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `inline-flex items-center font-medium transition hover:text-gray-200 ${
                  isActive ? "underline underline-offset-4" : ""
                }`
              }
            >
              <span>Admin </span>&nbsp;
              <span>Dashboard</span>
            </NavLink>
          )}
          {!user && (
            <>
              <NavLink
                to="/login"
                className="hover:underline border border-white px-4 py-2 bg-gray-100 text-blue-600 font-bold rounded-2xl"
              >
                SignIn
              </NavLink>
            </>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 font-medium px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
