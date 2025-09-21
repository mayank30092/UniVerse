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
    axios
      .get("/api/events/registered", {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      .then((res) => {
        console.log("Registered events:", res.data.data);
        setEvents(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8 mt-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Your Registered Events
        </h1>
        <button
          onClick={() => navigate("/student")}
          className="mb-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition cursor-pointer"
        >
          Back to All Events
        </button>

        {events.length === 0 ? (
          <p className="text-gray-600">
            You haven’t registered for any events yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 cursor-pointer">
            {events.map((ev) => (
              <div
                key={ev._id}
                className="bg-white shadow-md rounded-xl p-7 hover:shadow-lg transition"
                onClick={() => navigate(`/student/events/${ev._id}`)}
              >
                {ev.image && (
                  <img
                    src={ev.image}
                    alt="Event Poster"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
