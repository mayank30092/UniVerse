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

  if (loading) return <p>Loading...</p>;
  if (!event) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{event.title}</h2>
      <p>
        <strong>Description:</strong> {event.description}
      </p>
      <p>
        <strong>Date:</strong> {new Date(event.date).toDateString()}
      </p>
      <p>
        <strong>Time:</strong> {event.time}
      </p>
      <p>
        <strong>Venue:</strong> {event.venue}
      </p>

      <h3>Participants</h3>
      {event.participants?.length ? (
        <table border="1" cellPadding="10" style={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Registered At</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {event.participants.map((p) => (
              <tr key={p.user?._id || p.user}>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>
                  {p.registeredAt
                    ? new Date(p.registeredAt).toLocaleString()
                    : "—"}
                </td>
                <td>{p.attended ? "✅ Present" : "❌ Absent"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No participants registered yet.</p>
      )}

      {event.requiresAttendance && (
        <button
          style={{ marginTop: "20px" }}
          onClick={() => navigate(`/admin/events/${event._id}/scan`)}
        >
          Scan Attendance
        </button>
      )}
    </div>
  );
}
