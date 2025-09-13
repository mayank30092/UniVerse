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
    <div>
      <h2>Admin Dashboard</h2>

      {/* Create Event Form */}
      <form onSubmit={handleCreateOrUpdate}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          type="time"
          value={form.time || ""}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Venue"
          value={form.venue}
          onChange={(e) => setForm({ ...form, venue: e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={requiresAttendance}
            onChange={(e) => setRequiresAttendance(e.target.checked)}
          />
          Requires Attendance
        </label>
        <button type="submit">
          {editingEvent ? "Update Event" : "Create Event"}
        </button>
      </form>

      {/* Event List */}
      <h3>All Events</h3>
      <ul>
        {events && events.length > 0 ? (
          events.map((event) => (
            <li key={event._id}>
              <strong>{event.title}</strong> - {event.venue} (
              {new Date(event.date).toDateString()})
              {event.requiresAttendance && <span>(Attendance Required)</span>}
              <button onClick={() => handleEdit(event)}>Edit</button>
              <button onClick={() => handleDelete(event._id)}>Delete</button>
              <button onClick={() => handleViewEvent(event._id)}>
                View List
              </button>
              {event.requiresAttendance && (
                <button onClick={() => handleGenerateQRCode(event._id)}>
                  Generate QR Code
                </button>
              )}
              {event.requiresAttendance && (
                <button
                  onClick={() => navigate(`/admin/events/${event._id}/scan`)}
                >
                  Scan Attendance
                </button>
              )}
            </li>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </ul>
      {/* QR Code Display */}
      {qrCode && (
        <div>
          <h4>Attendance QR Code</h4>
          <img src={qrCode} alt="QR Code" />
        </div>
      )}
    </div>
  );
}
