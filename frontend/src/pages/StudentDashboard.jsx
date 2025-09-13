import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/events", {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      .then((res) => {
        setEvents(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const handleRegister = async (id) => {
    try {
      const res = await axios.post(
        `/api/events/${id}/register`,
        {},
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      alert(res.data.message);

      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === id
            ? {
                ...ev,
                participants: [
                  ...ev.participants,
                  { _id: user.id, name: user.name },
                ],
              }
            : ev
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Error occured");
    }
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <div>
      <h1>Welcome, {user?.name} </h1>
      <h2>Available Events</h2>

      {events.length === 0 ? (
        <p>No events available</p>
      ) : (
        <ul>
          {events.map((ev) => (
            <li key={ev._id}>
              <h3>{ev.title}</h3>
              <p>{ev.description}</p>
              <p>
                <strong>Date:</strong> {new Date(ev.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {ev.time || "Not specified"}{" "}
                <strong>Venue:</strong> {ev.venue}
              </p>
              <p>Created by:{ev.createdBy?.name}</p>
              <p>Participants:{ev.participants?.length || 0}</p>
              <button onClick={() => handleRegister(ev._id)}>Register</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
