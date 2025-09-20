import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedStudentRoute from "./components/ProtectedStudentRoute";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import EventDetails from "./pages/EventDetails";
import ScanAttendance from "./pages/ScanAttendance";
import Contact from "./pages/Contact";
import CreateEvent from "./pages/CreateEvent";
import RegisteredEvents from "./pages/registeredEvents";

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
      <Route
        path="/about"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout>
            <Register />
          </Layout>
        }
      />
      <Route
        path="/student"
        element={
          <Layout>
            <ProtectedStudentRoute>
              <StudentDashboard />
            </ProtectedStudentRoute>
          </Layout>
        }
      />
      <Route
        path="/student/registered"
        element={
          <Layout>
            <RegisteredEvents />
          </Layout>
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
        path="/admin/create"
        element={
          <ProtectedAdminRoute>
            <Layout>
              <CreateEvent />
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
      <Route path="/admin/events/:id/scan" element={<ScanAttendance />} />
    </Routes>
  );
}

export default App;
