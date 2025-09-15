import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedStudentRoute from "./components/ProtectedStudentRoute";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import EventDetails from "./pages/EventDetails";
import ScanAttendance from "./pages/ScanAttendance";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/student"
        element={
          <ProtectedStudentRoute>
            <Layout>
              <StudentDashboard />
            </Layout>
          </ProtectedStudentRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="/admin/events/:id"
        element={
          <Layout>
            <EventDetails />
          </Layout>
        }
      />
      <Route
        path="/scan-attendance/:eventId"
        element={
          <Layout>
            <ScanAttendance />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
