import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function CreateEvent() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    time: "10:00",
    venue: "",
  });
  const [requiresAttendance, setRequiresAttendance] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const isEditMode = !!id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("date", form.date);
      formData.append("time", form.time);
      formData.append("venue", form.venue);
      formData.append("requiresAttendance", requiresAttendance);
      if (image) formData.append("image", image);

      if (isEditMode) {
        // Update existing event
        await axios.put(`/api/events/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Event updated successfully!");
      } else {
        // Create new event
        await axios.post("/api/events", formData, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Event created successfully!");
      }

      navigate("/admin"); // redirect after save
    } catch (err) {
      console.error("Error saving event:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id || !user?.token) return;

    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const evt = res.data.data || res.data;
        setForm({
          title: evt.title,
          description: evt.description,
          date: evt.date.slice(0, 10),
          time: evt.time,
          venue: evt.venue,
        });
        setRequiresAttendance(evt.requiresAttendance || false);
        setPreview(evt.image || "");
      } catch (err) {
        console.error("Failed to fetch event:", err);
      }
    };

    fetchEvent();
  }, [id, user]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-16">
      <div className="max-w-2xl mx-auto bg-white p-12 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          {isEditMode ? "Edit Event" : "Create Event"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border rounded-lg px-4 py-4"
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border rounded-lg px-4 py-4"
            required
          />
          <input
            type="date"
            value={form.date || new Date().toISOString().slice(0, 10)}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border rounded-lg px-4 py-4"
            required
          />
          <input
            type="time"
            value={form.time || "10:00"}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="border rounded-lg px-4 py-4"
            required
          />
          <input
            type="text"
            placeholder="Venue"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            className="border rounded-lg px-4 py-4"
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
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border rounded-lg px-4 py-4"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-64 h-40 object-cover mt-2"
            />
          )}
          <h2 className="text-2xl font-bold mb-4">
            {isEditMode ? "Edit Event" : "Create Event"}
          </h2>

          <button
            type="submit"
            className="mt-4 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Event"
              : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
