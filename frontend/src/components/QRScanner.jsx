import { BrowserMultiFormatReader } from "@zxing/browser"; //decode qr from video
import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios"; // for API requests
import { useParams, useNavigate } from "react-router-dom"; // useParams: decode from url and useNavigate: routing
import { AuthContext } from "../context/AuthContext";

export default function QRScanner() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [result, setResult] = useState("");
  const videoRef = useRef(null);
  const hasScannedRef = useRef(false); // ✅ prevent multiple scans
  const codeReaderRef = useRef(null); // store code reader instance for cleanup

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader; // store instance
    let isMounted = true;

    codeReader
      .decodeFromVideoDevice(
        null,
        videoRef.current,
        async (decodedResult, err) => {
          if (!isMounted || hasScannedRef.current) return;

          if (decodedResult) {
            hasScannedRef.current = true; // ✅ block further scans
            const scannedUserId = decodedResult.getText();
            setResult(scannedUserId);

            try {
              await axios.post(
                `/api/events/${id}/attendance`,
                { userId: scannedUserId },
                { headers: { Authorization: `Bearer ${user.token}` } }
              );

              alert("✅ Attendance marked for " + scannedUserId);

              stopCamera();
              navigate(`/student/events/${id}`);
            } catch (error) {
              console.error("Error marking attendance:", error);
              alert(
                "❌ " +
                  (error.response?.data?.message || "Failed to mark attendance")
              );
              hasScannedRef.current = false; // allow retry if error
            }
          }

          if (err && !(err instanceof NotFoundException)) {
            console.error("Scan error:", err);
          }
        }
      )
      .catch((err) => console.error("Camera init error:", err));

    // Cleanup on unmount
    return () => stopCamera((isMounted = false));
  }, [id, user.token, navigate]);

  // ✅ Stop camera helper function
  const stopCamera = (isMounted = true) => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    codeReaderRef.current?.stopContinuousDecode?.();
    if (isMounted) hasScannedRef.current = true; // prevent further scans
  };

  // ✅ Back button handler
  const handleBack = () => {
    stopCamera(false); // stop camera before navigating
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">QR Code Scanner</h2>

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
      >
        ← Back
      </button>

      <video
        ref={videoRef}
        style={{ width: "300px", border: "2px solid black" }}
        muted
        autoPlay
      />
      {result && <p className="mt-4">Last scanned: {result}</p>}
    </div>
  );
}
