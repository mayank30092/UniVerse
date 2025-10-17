import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisteredEvents() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const token = user?.token || localStorage.getItem("token");
    if (!token) return;

    const fetchRegisteredEvents = async () => {
      try {
        const res = await axios.get("/api/events/registered", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data.data || []);
      } catch (err) {
        console.error("Error fetching registered events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading user...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 text-center md:text-left">
          Your Registered Events
        </h1>

        <div className="flex justify-center md:justify-start mb-8">
          <button
            onClick={() => navigate("/student")}
            className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition font-medium"
          >
            Back to All Events
          </button>
        </div>

        {events.length === 0 ? (
          <p className="text-gray-600 text-center md:text-left text-lg">
            You haven’t registered for any events yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((ev) => (
              <div
                key={ev._id}
                className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col"
                onClick={() => navigate(`/student/events/${ev._id}`)}
              >
                {ev.image && (
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-52 object-cover"
                  />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-blue-600 mb-2">
                    {ev.title}
                  </h3>
                  <p className="text-gray-700 mb-3 line-clamp-3">
                    {ev.description}
                  </p>
                  <div className="mt-auto">
                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Date:</strong>{" "}
                      {new Date(ev.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Time:</strong> {ev.time || "Not specified"} |{" "}
                      <strong>Venue:</strong> {ev.venue}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
