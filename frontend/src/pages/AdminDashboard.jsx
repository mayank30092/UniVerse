import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const navigate = useNavigate();
  const [requiresAttendance, setRequiresAttendance] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    if (!user?.token) return; // prevent calling without token
    try {
      const res = await axios.get("/api/events", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEvents(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        // Update existing event
        await axios.put(
          `/api/events/${editingEvent._id}`,
          { ...form, requiresAttendance },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setEditingEvent(null);
      } else {
        // Create new event
        await axios.post(
          "/api/events",
          { ...form, requiresAttendance },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
      }

      setForm({ title: "", description: "", date: "", venue: "" });
      setRequiresAttendance(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Error creating/updating event:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!user?.token) return; // prevent calling without token
    try {
      await axios.delete(`/api/events/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchEvents();
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleViewEvent = (eventId) => {
    navigate(`/admin/events/${eventId}`);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 10),
      time: event.time || "",
      venue: event.venue,
    });
    setRequiresAttendance(event.requiresAttendance || false);
  };

  const handleGenerateQRCode = async (eventId) => {
    try {
      const res = await axios.get(`/api/events/${eventId}/attendance-qrcode`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const qrCode = res.data.qrCode;
      alert("QR Code generated!");
      setQrCode(qrCode);
    } catch (error) {
      console.error("Error generating QR Code:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h2>

        {/* Create Event Form */}
        <form
          onSubmit={handleCreateOrUpdate}
          className="bg-white shadow-md rounded-xl p-6 mb-8"
        >
          <h3 className="text-xl font-semibold mb-4">
            {editingEvent ? "Edit Event" : "Create Event"}
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border rounded-lg px-4 py-2 w-full"
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border rounded-lg px-4 py-2 w-full"
              required
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border rounded-lg px-4 py-2 w-full"
              required
            />
            <input
              type="time"
              value={form.time || ""}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="border rounded-lg px-4 py-2 w-full"
              required
            />
            <input
              type="text"
              placeholder="Venue"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="border rounded-lg px-4 py-2 w-full"
              required
            />
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={requiresAttendance}
                onChange={(e) => setRequiresAttendance(e.target.checked)}
              />
              Requires Attendance
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {editingEvent ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>

        {/* Event List */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          All Events
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {events && events.length > 0 ? (
            events.map((event) => (
              <div
                key={event._id}
                className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition"
              >
                <h4 className="text-xl font-bold text-blue-600 mb-2">
                  {event.title}
                </h4>
                <p className="text-gray-700">{event.description}</p>
                <p className="text-sm text-gray-500 mt-2 mb-3">
                  {new Date(event.date).toDateString()} | {event.time} |{" "}
                  {event.venue}
                </p>
                {event.requiresAttendance && (
                  <p className="text-sm text-red-500 mt-1 mb-2">
                    (Attendance Required)
                  </p>
                )}
                <button
                  onClick={() => handleEdit(event)}
                  className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleViewEvent(event._id)}
                  className="px-4 py-2 mx-2 bg-blue-700 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  View List
                </button>
                {event.requiresAttendance && (
                  <button
                    onClick={() => handleGenerateQRCode(event._id)}
                    className="px-4 py-2 my-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Generate QR Code
                  </button>
                )}
                {event.requiresAttendance && (
                  <button
                    onClick={() => navigate(`/admin/events/${event._id}/scan`)}
                    className="px-4 py-2 my-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Scan Attendance
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No events found.</p>
          )}
        </div>
        {/* QR Code Display */}
        {qrCode && (
          <div>
            <h4>Attendance QR Code</h4>
            <img src={qrCode} alt="QR Code" />
          </div>
        )}
      </div>
    </div>
  );
}
