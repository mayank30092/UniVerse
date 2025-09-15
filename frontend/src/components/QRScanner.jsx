import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function QRScanner() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [result, setResult] = useState("");
  const videoRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let isMounted = true;

    codeReader
      .decodeFromVideoDevice(null, videoRef.current, async (decodedResult) => {
        if (decodedResult && isMounted) {
          const scannedUserId = decodedResult.getText();
          setResult(scannedUserId);

          try {
            await axios.post(
              `/api/events/${id}/attendance`,
              { userId: scannedUserId },
              {
                headers: { Authorization: `Bearer ${user.token}` },
              }
            );
            alert("✅ Attendance marked for " + scannedUserId);
          } catch (error) {
            console.error("Error marking attendance:", error);
            alert(
              "❌ " +
                (error.response?.data?.message || "Failed to mark attendance")
            );
          }
        }
      })
      .catch((err) => console.error(err));

    return () => {
      isMounted = false;
      codeReader.reset();
    };
  }, [id, user.token]);

  return (
    <div>
      <h2>QR Code Scanner</h2>
      <video
        ref={videoRef}
        style={{ width: "300px", border: "2px solid black" }}
      />
      {result && <p>Last scanned: {result}</p>}
    </div>
  );
}
