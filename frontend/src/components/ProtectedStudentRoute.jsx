import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedStudentRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "student") {
    return <Navigate to="/" replace />;
  }
  return children;
}
