import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    if (!user?.token) return; // prevent calling without token
    try {
      const res = await axios.get("/api/events", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEvents(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 mt-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h2>
        <div className="mb-8 rounded-lg w-56 p-8 bg-blue-600 shadow-md hover:shadow-lg transition hover:bg-blue-500">
          <button
            onClick={() => navigate("/admin/create")}
            className="text-white font-bold text-xl cursor-pointer"
          >
            Register New Event
          </button>
        </div>
      </div>
      {/* Event List */}
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 mt-16">
          All Events
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {events && events.length > 0 ? (
            events.map((event) => (
              <div
                key={event._id}
                className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/admin/events/${event._id}`)}
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt="Event Poster"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h4 className="text-xl font-bold text-blue-600 mb-2">
                  {event.title}
                </h4>
                <p className="text-gray-700">{event.description}</p>
                <p className="text-sm text-gray-500 mt-2 mb-3">
                  {new Date(event.date).toDateString()} | {event.time} |{" "}
                  {event.venue}
                </p>
                {event.requiresAttendance && (
                  <p className="text-sm text-red-500 mt-1 mb-2">
                    (Attendance Required)
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No events found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
