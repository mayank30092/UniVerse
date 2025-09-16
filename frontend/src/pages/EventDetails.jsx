import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data.data || res.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!event) return <p className="text-center mt-10">Event not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Event Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
        <p className="text-gray-600 mb-4">{event.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Date:</strong> {new Date(event.date).toDateString()}
          </p>
          <p>
            <strong>Time:</strong> {event.time}
          </p>
          <p>
            <strong>Venue:</strong> {event.venue}
          </p>
        </div>
      </div>

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
                    <td className="p-2 border">{p.email || p.user?.email}</td>
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

      {/* Attendance Button */}
      {event.requiresAttendance && (
        <div className="mt-6 flex justify-center">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => navigate(`/admin/events/${event._id}/scan`)}
          >
            📷 Scan Attendance
          </button>
        </div>
      )}
    </div>
  );
}
