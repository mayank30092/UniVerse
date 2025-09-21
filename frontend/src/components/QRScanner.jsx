import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function QRScanner() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [result, setResult] = useState("");
  const videoRef = useRef(null);
  const hasScannedRef = useRef(false); // ✅ prevent multiple scans

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
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

              // stop camera before navigating
              if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject
                  .getTracks()
                  .forEach((track) => track.stop());
              }

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

    return () => {
      isMounted = false;
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      codeReader.stopContinuousDecode?.(); // ✅ safe cleanup if available
    };
  }, [id, user.token, navigate]);

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">QR Code Scanner</h2>
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
