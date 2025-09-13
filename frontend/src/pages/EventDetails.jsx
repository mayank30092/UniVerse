import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvents();
  }, [id]);

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h2>{event.title}</h2>
      <p>
        <strong>Description:</strong>
        {event.description}
      </p>
      <p>
        <strong>Date:</strong>
        {new Date(event.date).toDateString()}
      </p>
      <p>
        <strong>Time:</strong> {event.time}
      </p>
      <p>
        <strong>Venue:</strong>
        {event.venue}
      </p>

      <h3>Participants</h3>
      {event.participants.length ? (
        <ul>
          {event.participants.map((p) => (
            <li key={p.user?._id || p.user}>
              {p.name} ({p.email}) - {p.attended ? "✅ Present" : "❌ Absent"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No participants registered yet.</p>
      )}
      {event.requiresAttendance && (
        <button onClick={() => navigate(`/admin/events/${event._id}/scan`)}>
          Scan Attendance
        </button>
      )}
    </div>
  );
}
