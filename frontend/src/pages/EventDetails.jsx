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
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [qrCode, setQrCode] = useState(null);
  const [generatingCertificates, setGeneratingCertificates] = useState(false);
  const [generatingQRCode, setGeneratingQRCode] = useState(false);

  // Fetch event details
  useEffect(() => {
    if (!user?.token) return;

    const fetchEvent = async () => {
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user]);

  // Handle certificate generation
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

      // Fetch updated event with certificate URLs
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

  // Handle QR code generation
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
    <div className="max-w-4xl mx-auto p-6 mt-24 mb-24">
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

      {/* Admin Actions */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setEditing(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Delete
        </button>

        {event.requiresAttendance && (
          <button
            onClick={handleGenerateQRCode}
            disabled={generatingQRCode}
            className={`px-4 py-2 rounded-lg text-white ${
              generatingQRCode
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {generatingQRCode ? "Generating QR..." : "Generate QR Code"}
          </button>
        )}

        <button
          onClick={handleGenerateCertificates}
          disabled={generatingCertificates}
          className={`px-4 py-2 rounded-lg text-white ${
            generatingCertificates
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-800"
          }`}
        >
          {generatingCertificates ? "Generating..." : "Generate Certificates"}
        </button>
      </div>

      {qrCode && (
        <div className="mb-8">
          <img src={qrCode} alt="QR Code" className="w-64 h-64 mb-4" />
          <button
            onClick={() => downloadQRCodePDF(qrCode, event.title)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Download QR Code PDF
          </button>
        </div>
      )}

      {/* Participant Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Participants</h3>
        {event.participants?.length ? (
          <table className="w-full border border-gray-300 rounded-lg">
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
