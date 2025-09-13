import { useZxing } from "react-zxing";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function QRScanner() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [result, setResult] = useState("");

  const { ref } = useZxing({
    onDecodeResult: async (decodedResult) => {
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
        alert("Attendance marked for " + scannedUserId);
      } catch (error) {
        console.error("Error marking attendance:", error);
        alert(
          "❌ " + error.response?.data?.message || "Failed to mark attendance"
        );
      }
    },
  });

  return (
    <div>
      <h2>QR Code Scanner</h2>
      <video ref={ref} style={{ width: "300px", border: "2px solid black" }} />
      {result && <p>Last scanned: {result}</p>}
    </div>
  );
}
