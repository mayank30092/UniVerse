import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("latest"); // default filter
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token) return;

    const fetchEvents = async () => {
      try {
        const res = await axios.get("/api/events", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        const allEvents = res.data.data || [];

        // Add isRegistered flag based on backend
        const eventsWithFlag = allEvents.map((ev) => ({
          ...ev,
          isRegistered: ev.participants?.some(
            (p) =>
              p.user?._id?.toString() === user._id?.toString() ||
              p.user?.toString() === user._id?.toString()
          ),
        }));

        // Sort and set state
        const sortedEvents = eventsWithFlag.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setEvents(sortedEvents);
        setFilteredEvents(sortedEvents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const handleFilterChange = (type) => {
    setFilter(type);

    if (type === "latest") {
      setFilteredEvents(
        [...events].sort((a, b) => new Date(b.date) - new Date(a.date))
      );
    } else if (type === "oldest") {
      setFilteredEvents(
        [...events].sort((a, b) => new Date(a.date) - new Date(b.date))
      );
    } else {
      setFilteredEvents(events);
    }
  };

  const handleRegister = async (id) => {
    try {
      const res = await axios.post(
        `/api/events/${id}/register`,
        {},
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      alert(res.data.message);

      const newParticipant = res.data.data;

      // Update frontend state so the button disables immediately
      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === id
            ? {
                ...ev,
                participants: [...(ev.participants || []), newParticipant],
                isRegistered: true,
              }
            : ev
        )
      );

      // Update filteredEvents as well for consistency
      setFilteredEvents((prev) =>
        prev.map((ev) =>
          ev._id === id
            ? {
                ...ev,
                participants: [...(ev.participants || []), newParticipant],
                isRegistered: true,
              }
            : ev
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading events...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
          Welcome, {user?.name}!
        </h1>

        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <button
            onClick={() => navigate("/student/registered")}
            className="w-full md:w-64 mx-auto md:mx-0 p-4 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition"
          >
            Show Registered Events
          </button>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700">Sort by:</label>
            <select
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="none">Default</option>
            </select>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Available Events
        </h2>

        {filteredEvents.length === 0 ? (
          <p className="text-gray-600">No events available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => (
              <div
                key={ev._id}
                className="bg-white shadow-lg rounded-2xl p-6 md:p-8 hover:shadow-2xl transition flex flex-col"
              >
                {ev.image && (
                  <img
                    src={ev.image}
                    alt="Event Poster"
                    className="w-full h-48 md:h-56 object-cover rounded-xl mb-4"
                  />
                )}
                <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-2">
                  {ev.title}
                </h3>
                <p className="text-gray-700 mb-3 line-clamp-3">
                  {ev.description}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Date:</strong>{" "}
                  {new Date(ev.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Time:</strong> {ev.time || "Not specified"}{" "}
                  <strong>Venue:</strong> {ev.venue}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Created by: {ev.createdBy?.name || "Admin"}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Participants: {ev.participants?.length || 0}
                </p>
                <button
                  onClick={() => handleRegister(ev._id)}
                  disabled={ev.isRegistered}
                  className={`mt-auto w-full py-3 rounded-xl text-lg font-semibold transition ${
                    ev.isRegistered
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {ev.isRegistered ? "Registered" : "Register"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
