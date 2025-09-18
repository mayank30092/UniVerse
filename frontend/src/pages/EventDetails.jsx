import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
  });
  const [requiresAttendance, setRequiresAttendance] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [qrCode, setQrCode] = useState(null);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      if (!user?.token) return; // ❌ exit early if user is not ready

      try {
        const res = await axios.get(`/api/events/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const evt = res.data.data || res.data;
        setEvent(evt);
        setForm({
          title: evt.title,
          description: evt.description,
          date: evt.date.slice(0, 10),
          time: evt.time,
          venue: evt.venue,
        });
        setRequiresAttendance(evt.requiresAttendance || false);
        setPreview(evt.image);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, user]);

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Update event
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("date", form.date);
    formData.append("time", form.time);
    formData.append("venue", form.venue);
    formData.append("requiresAttendance", requiresAttendance);
    if (image) formData.append("image", image);

    try {
      await axios.put(`/api/events/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Event updated!");
      setEditing(false);
      // Refresh event data
      const res = await axios.get(`/api/events/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEvent(res.data.data || res.data);
      setPreview(res.data.data?.image || res.data.image);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete event
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await axios.delete(`/api/events/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Event deleted!");
      navigate("/admin"); // go back to dashboard
    } catch (error) {
      console.error(error);
    }
  };

  // Generate QR code
  const handleGenerateQRCode = async () => {
    try {
      const res = await axios.get(`/api/events/${id}/attendance-qrcode`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("QR Code generated!");
      setQrCode(res.data.qrCode);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!event) return <p className="text-center mt-10">Event not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-24 mb-24">
      {editing ? (
        <form
          onSubmit={handleUpdate}
          className="bg-white shadow-md rounded-lg p-6 grid gap-4"
        >
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border rounded px-4 py-2"
            required
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border rounded px-4 py-2"
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border rounded px-4 py-2"
            required
          />
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="border rounded px-4 py-2"
            required
          />
          <input
            type="text"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            className="border rounded px-4 py-2"
            required
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={requiresAttendance}
              onChange={(e) => setRequiresAttendance(e.target.checked)}
            />
            Requires Attendance
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-64 h-40 object-cover mt-2"
            />
          )}
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {event.image && (
            <img
              src={event.image}
              alt="Event Poster"
              className="w-full h-80 object-contain rounded-lg mb-4"
            />
          )}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <p>
                <strong>Date:</strong> {new Date(event.date).toDateString()}
              </p>
              <p>
                <strong>Time:</strong> {event.time || "10:00 AM"}
              </p>
              <p>
                <strong>Venue:</strong> {event.venue}
              </p>
            </div>
          </div>

          {/* Event Actions */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Delete
            </button>
            {event.requiresAttendance && (
              <button
                onClick={handleGenerateQRCode}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Generate QR Code
              </button>
            )}
          </div>

          {/* QR Code Display */}
          {qrCode && (
            <img src={qrCode} alt="QR Code" className="w-64 h-64 mt-8 mb-8" />
          )}

          {/* Participants */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Participants</h3>
            {event.participants?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Email</th>
                      <th className="p-2 border">Registered At</th>
                      <th className="p-2 border">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.participants.map((p) => (
                      <tr key={p.user?._id || p.user}>
                        <td className="p-2 border">{p.name || p.user?.name}</td>
                        <td className="p-2 border">
                          {p.email || p.user?.email}
                        </td>
                        <td className="p-2 border">
                          {p.registeredAt
                            ? new Date(p.registeredAt).toLocaleString()
                            : "—"}
                        </td>
                        <td className="p-2 border text-center">
                          {p.attended ? "✅ Present" : "❌ Absent"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No participants registered yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
