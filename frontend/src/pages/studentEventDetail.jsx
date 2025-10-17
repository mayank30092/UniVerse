import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function StudentEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvent = async () => {
    if (!user?.token) return;
    setRefreshing(true);
    try {
      const res = await axios.get(`/api/events/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEvent(res.data.data || res.data);
    } catch (err) {
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id, user]);

  useEffect(() => {
    if (!event) return;

    const participant = event.participants?.find(
      (p) => (p.user?._id || p.user) === user._id
    );

    if (participant?.certificateUrl) return;

    const interval = setInterval(fetchEvent, 5000);
    return () => clearInterval(interval);
  }, [event, user]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    );

  if (!event)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Event not found.</p>
      </div>
    );

  const participant = event.participants?.find((p) => {
    if (p.user && typeof p.user === "object" && p.user._id) {
      return p.user._id === user._id;
    }
    return p.user === user._id;
  });

  const certificateUrl = participant?.certificateUrl;
  const certificateIssued = participant?.certificateIssued;
  const attended = participant?.attended;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 mt-24 mb-24">
      {/* Event Poster */}
      {event.image && (
        <img
          src={event.image}
          alt="Event Poster"
          className="w-full h-64 md:h-80 object-cover rounded-xl shadow-md mb-6"
        />
      )}

      {/* Event Details */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
          {event.title}
        </h2>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Date:</strong> {new Date(event.date).toDateString()}
          </p>
          <p>
            <strong>Time:</strong> {event.time || "10:00 AM"}
          </p>
          <p>
            <strong>Venue:</strong> {event.venue}
          </p>
          {event.createdBy?.name && (
            <p>
              <strong>Organizer:</strong> {event.createdBy.name}
            </p>
          )}
        </div>
      </div>

      {/* Attendance Section */}
      {event.requiresAttendance && (
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          {attended ? (
            <p className="px-4 py-2 bg-green-500 text-white rounded-lg text-center w-full md:w-auto">
              Attendance marked ✅
            </p>
          ) : (
            <button
              onClick={() => navigate(`/student/events/${event._id}/scan`)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg w-full md:w-auto hover:bg-green-700 transition"
            >
              Scan QR Code
            </button>
          )}
        </div>
      )}

      {/* Certificate Section */}
      {attended && certificateIssued && certificateUrl ? (
        <a
          href={certificateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900 w-full md:w-auto inline-block transition"
        >
          Download Certificate
        </a>
      ) : attended ? (
        <p className="text-gray-500 mt-2">Certificate is being generated...</p>
      ) : null}

      {/* Refreshing notice */}
      {refreshing && (
        <p className="text-gray-400 mt-2 text-sm">
          Checking for certificate...
        </p>
      )}
    </div>
  );
}
