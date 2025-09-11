import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedStudentRoute from "./components/ProtectedStudentRoute";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Welcome to UniVerse!</h1>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/student"
        element={
          <ProtectedStudentRoute>
            <StudentDashboard />
          </ProtectedStudentRoute>
        }
      />
    </Routes>
  );
}

export default App;
