import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("latest");
  const navigate = useNavigate();

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    if (!user?.token) return;
    try {
      setLoading(true);
      const res = await axios.get("/api/events", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEvents(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Sorting logic
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">
          Welcome, {user?.name || "Admin"} 👋
        </h1>
        <button
          onClick={() => navigate("/admin/create")}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition duration-200"
        >
          + Register New Event
        </button>
      </div>

      {/* Filter / Sort */}
      <div className="max-w-6xl mx-auto flex justify-end mb-6">
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="latest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Event List */}
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          All Events
        </h3>

        {loading ? (
          <p className="text-gray-600 text-center py-12 animate-pulse">
            Loading events...
          </p>
        ) : sortedEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white shadow-md rounded-2xl p-5 transform hover:scale-[1.02] hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100"
                onClick={() => navigate(`/admin/events/${event._id}`)}
              >
                {/* Event Image */}
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-4 text-gray-500 text-sm">
                    No Image Available
                  </div>
                )}

                {/* Event Info */}
                <h4 className="text-xl font-bold text-blue-600 mb-2">
                  {event.title || "Untitled Event"}
                </h4>
                <p className="text-gray-600 mb-3 line-clamp-3">
                  {event.description
                    ? event.description.split("\n")[0]
                    : "No description available."}
                </p>
                <p className="text-sm text-gray-500">
                  📅 {new Date(event.date).toDateString()} <br />
                  🕒 {event.time || "N/A"} | 📍 {event.venue || "TBA"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center mt-16">No events found.</p>
        )}
      </div>
    </div>
  );
}
