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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading events...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8 mt-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Welcome, {user?.name}{" "}
        </h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Available Events
        </h2>

        {events.length === 0 ? (
          <p className="text-gray-600">No events available</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <div
                key={ev._id}
                className="bg-white shadow-md rounded-xl p-7 hover:sahdow-lg transition"
              >
                <h3 className="text-xl font-bold text-blue-600 mb-2">
                  {ev.title}
                </h3>
                <p className="text-gray-700 mb-3">{ev.description}</p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Date:</strong>{" "}
                  {new Date(ev.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Time:</strong> {ev.time || "Not specified"}{" "}
                  <strong>Venue:</strong> {ev.venue}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Created by:{ev.createdBy?.name}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Participants:{ev.participants?.length || 0}
                </p>
                <button
                  onClick={() => handleRegister(ev._id)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
