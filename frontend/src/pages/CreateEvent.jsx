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

  const isEditMode = !!id;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) return alert("Not authorized");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("date", form.date);
      formData.append("time", form.time);
      formData.append("venue", form.venue);

      // FIX: Convert boolean to string for FormData
      formData.append("requiresAttendance", requiresAttendance.toString());

      if (image) formData.append("image", image);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEditMode) {
        await axios.put(`/api/events/${id}`, formData, config);
        alert("✅ Event updated successfully!");
      } else {
        await axios.post("/api/events", formData, config);
        alert("✅ Event created successfully!");
      }

      navigate("/admin");
    } catch (err) {
      console.error("Error saving event:", err);
      alert("❌ Failed to save event. Please try again.");
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isEditMode ? "Edit Event" : "Create Event"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <input
            type="text"
            placeholder="Event Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border rounded-lg px-4 py-3"
            required
          />

          <textarea
            placeholder="Event Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border rounded-lg px-4 py-3"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border rounded-lg px-4 py-3"
              required
            />
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="border rounded-lg px-4 py-3"
              required
            />
          </div>

          <input
            type="text"
            placeholder="Venue"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
            className="border rounded-lg px-4 py-3"
            required
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={requiresAttendance}
              onChange={(e) => setRequiresAttendance(e.target.checked)}
            />
            Requires Attendance
          </label>

          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded-lg px-4 py-3 w-full"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover mt-3 rounded-lg"
              />
            )}
          </div>

          <button
            type="submit"
            className={`mt-4 px-6 py-3 text-white rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
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
