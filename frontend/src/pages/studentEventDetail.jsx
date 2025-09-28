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

  // Fetch event details
  const fetchEvent = async () => {
    if (!user?.token) return;
    setRefreshing(true);
    try {
      const res = await axios.get(`/api/events/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const evt = res.data.data || res.data;
      setEvent(evt);
    } catch (err) {
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 1. Initial fetch
  useEffect(() => {
    fetchEvent();
  }, [id, user]);

  // 2. Poll until certificate is ready
  useEffect(() => {
    if (!event) return;

    const participant = event.participants?.find(
      (p) => (p.user?._id || p.user) === user._id
    );

    // Already has certificate → no need to poll
    if (participant?.certificateUrl) return;

    // Otherwise, poll every 5s
    const interval = setInterval(fetchEvent, 5000);

    return () => clearInterval(interval);
  }, [event, user]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!event) return <p className="text-center mt-10">Event not found.</p>;

  // Find logged-in student's participant entry
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
    <div className="max-w-4xl mx-auto p-6 mt-24 mb-24">
      {event.image && (
        <img
          src={event.image}
          alt="Event Poster"
          className="w-full h-80 object-contain rounded-lg mb-4"
        />
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
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
        </div>
      </div>

      {/* Attendance */}
      {event.requiresAttendance && (
        <div className="mb-6">
          {attended ? (
            <p className="px-4 py-2 bg-gray-400 text-white rounded-lg text-center">
              You have marked attendance ✅
            </p>
          ) : (
            <button
              onClick={() => navigate(`/student/events/${event._id}/scan`)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer mb"
            >
              Scan QR Code
            </button>
          )}
        </div>
      )}

      {/* Certificate Download */}
      {attended && certificateIssued && certificateUrl ? (
        <a
          href={certificateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-800 cursor-pointer"
        >
          Download Certificate
        </a>
      ) : attended ? (
        <p className="text-gray-500 mt-2">
          Certificate is being generated. Please wait...
        </p>
      ) : null}

      {/* Optional: show loading while refreshing */}
      {refreshing && (
        <p className="text-gray-400 mt-2 text-sm">
          Checking for certificate...
        </p>
      )}
    </div>
  );
}
