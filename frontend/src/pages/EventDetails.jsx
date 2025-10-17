import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { downloadQRCodePDF } from "../utils/downloadQRCode";

export default function AdminEventDetails() {
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
  const [preview, setPreview] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [generatingCertificates, setGeneratingCertificates] = useState(false);
  const [generatingQRCode, setGeneratingQRCode] = useState(false);

  useEffect(() => {
    if (!user?.token) return;

    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const evt = res.data.data || res.data;
        evt.requiresAttendance =
          evt.requiresAttendance === true || evt.requiresAttendance === "true";
        setEvent(evt);
        setForm({
          title: evt.title,
          description: evt.description,
          date: evt.date.slice(0, 10),
          time: evt.time,
          venue: evt.venue,
        });
        setRequiresAttendance(evt.requiresAttendance);
        setPreview(evt.image);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user]);

  const handleGenerateCertificates = async () => {
    if (!user?.token) return alert("Not authorized");
    setGeneratingCertificates(true);
    try {
      const res = await fetch(
        `/api/events/${event._id}/certificates/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert("Failed to generate certificates: " + data.message);
        return;
      }

      const updatedEvent = await axios.get(`/api/events/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEvent(updatedEvent.data.data || updatedEvent.data);
      alert("Certificates generated successfully!");
    } catch (err) {
      console.error("Certificate generation error:", err);
      alert("Error generating certificates");
    } finally {
      setGeneratingCertificates(false);
    }
  };

  const handleGenerateQRCode = async () => {
    setGeneratingQRCode(true);
    try {
      const res = await axios.get(`/api/events/${id}/attendance-qrcode`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setQrCode(res.data.qrCode);
    } catch (err) {
      console.error("QR code generation error:", err);
      alert("Error generating QR code");
    } finally {
      setGeneratingQRCode(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!event) return <p className="text-center mt-10">Event not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 mb-24">
      {/* Edit Form */}
      {editing && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Edit Event</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const formData = new FormData();
                formData.append("title", form.title);
                formData.append("description", form.description);
                formData.append("date", form.date);
                formData.append("time", form.time);
                formData.append("venue", form.venue);
                formData.append("requiresAttendance", requiresAttendance);
                if (preview) formData.append("image", preview);

                await axios.put(`/api/events/${id}`, formData, {
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "multipart/form-data",
                  },
                });

                alert("Event updated successfully!");
                setEditing(false);

                const res = await axios.get(`/api/events/${id}`, {
                  headers: { Authorization: `Bearer ${user.token}` },
                });
                setEvent(res.data.data || res.data);
              } catch (err) {
                console.error("Update error:", err);
                alert("Failed to update event");
              }
            }}
            className="grid gap-4"
          >
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border rounded-lg px-4 py-2"
              required
            />
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border rounded-lg px-4 py-2"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="border rounded-lg px-4 py-2"
                required
              />
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="border rounded-lg px-4 py-2"
                required
              />
            </div>
            <input
              type="text"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="border rounded-lg px-4 py-2"
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
                onChange={(e) =>
                  setPreview(URL.createObjectURL(e.target.files[0]))
                }
                className="border rounded-lg px-4 py-2 w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex-1"
              >
                Update Event
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Event Image */}
      {event.image && (
        <img
          src={event.image}
          alt="Event Poster"
          className="w-full max-h-96 object-contain rounded-lg mb-4"
        />
      )}

      {/* Event Details */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
        <ul className="list-disc pl-5 text-gray-600 mb-4">
          {event.description.split("\n").map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Date:</strong> {new Date(event.date).toDateString()}
          </p>
          <p>
            <strong>Time:</strong> {event.time || "10:00 AM"}
          </p>
          <p>
            <strong>Venue:</strong> {event.venue}
          </p>
          <p>
            <strong>Attendance Required:</strong>{" "}
            {event.requiresAttendance ? "Yes" : "No"}
          </p>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setEditing(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex-1"
        >
          Edit
        </button>
        <button
          onClick={async () => {
            if (!window.confirm("Delete event?")) return;
            await axios.delete(`/api/events/${id}`, {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            navigate("/admin");
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex-1"
        >
          Delete
        </button>
        {event.requiresAttendance && (
          <>
            <button
              onClick={handleGenerateQRCode}
              disabled={generatingQRCode}
              className={`px-4 py-2 rounded-lg text-white flex-1 ${
                generatingQRCode
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {generatingQRCode ? "Generating QR..." : "Generate QR Code"}
            </button>
            <button
              onClick={handleGenerateCertificates}
              disabled={generatingCertificates}
              className={`px-4 py-2 rounded-lg text-white flex-1 ${
                generatingCertificates
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-600 hover:bg-gray-800"
              }`}
            >
              {generatingCertificates
                ? "Generating..."
                : "Generate Certificates"}
            </button>
          </>
        )}
      </div>

      {/* QR Code */}
      {qrCode && (
        <div className="mb-8 flex flex-col items-center gap-4">
          <img src={qrCode} alt="QR Code" className="w-64 h-64" />
          <button
            onClick={() => downloadQRCodePDF(qrCode, event.title)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Download QR Code PDF
          </button>
        </div>
      )}

      {/* Participants Table */}
      <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Participants</h3>
        {event.participants?.length ? (
          <table className="w-full min-w-max border border-gray-300 rounded-lg table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Attendance</th>
                <th className="p-2 border">Certificate</th>
              </tr>
            </thead>
            <tbody>
              {event.participants.map((p) => (
                <tr key={p.user?._id || p.user}>
                  <td className="p-2 border">{p.name || p.user?.name}</td>
                  <td className="p-2 border">{p.email || p.user?.email}</td>
                  <td className="p-2 border text-center">
                    {p.attended ? "✅ Present" : "❌ Absent"}
                  </td>
                  <td className="p-2 border text-center">
                    {p.attended && p.certificateIssued && p.certificateUrl ? (
                      <a
                        href={p.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Download
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No participants yet.</p>
        )}
      </div>
    </div>
  );
}
