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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const hasScannedRef = useRef(false);
  const codeReaderRef = useRef(null);
  const scanTimeoutRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    if (!user || !user.token) {
      setError("Please log in first");
      navigate("/login");
      return;
    }

    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;
    let isMounted = true;

    console.log("📷 Starting QR scanner for event:", id);
    console.log("👤 Current user:", user._id);

    const startScanning = async () => {
      try {
        setScanning(true);
        setError("");

        // Check camera permissions
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError("Camera not available on this device");
          return;
        }

        console.log("🎥 Starting QR scanner...");

        // Start decoding from video device
        const controls = await codeReader.decodeFromVideoDevice(
          null,
          videoRef.current,
          (decodedResult, err) => {
            if (!isMounted || hasScannedRef.current) return;

            if (decodedResult) {
              hasScannedRef.current = true;
              const qrData = decodedResult.getText();
              setResult(qrData);

              console.log("✅ QR Code detected:", qrData);
              handleScanResult(qrData);
            }

            if (err) {
              // Don't log common "not found" errors during normal scanning
              if (!err.message?.includes("NotFound")) {
                // Silent logging for scanning process
              }
            }
          }
        );

        console.log("🎬 QR Scanner started successfully");
      } catch (err) {
        console.error("❌ QR Scanner setup error:", err);
        setError("Failed to setup QR scanner: " + err.message);
        setScanning(false);
      }
    };

    startScanning();

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up QR scanner...");
      isMounted = false;
      stopCamera();

      // Clear any pending timeouts
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, [id, user, navigate]);

  const handleScanResult = async (qrData) => {
    try {
      console.log("🔍 Processing QR data:", qrData);

      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in first");
        navigate("/login");
        return;
      }

      console.log("📤 Sending attendance request for event:", id);

      // Mark attendance
      const res = await axios.post(
        `/api/events/${id}/attendance`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setSuccess("✅ Attendance marked successfully!");
        console.log("✅ Attendance marked:", res.data);

        // Stop camera immediately
        stopCamera();

        // Redirect after success with delay
        scanTimeoutRef.current = setTimeout(() => {
          console.log("🔄 Redirecting to student dashboard...");
          navigate("/student");
        }, 2000);
      }
    } catch (err) {
      console.error("❌ Attendance error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to mark attendance";
      setError("❌ " + errorMessage);

      // Allow retry if error after 3 seconds
      scanTimeoutRef.current = setTimeout(() => {
        hasScannedRef.current = false;
        setError("");
      }, 3000);

      // Specific error handling
      if (err.response?.status === 403) {
        setError("❌ You are not registered for this event");
      } else if (err.response?.status === 400) {
        setError("❌ Attendance already marked");
      }
    }
  };

  // Stop camera helper function
  const stopCamera = () => {
    console.log("🛑 Stopping camera and scanner...");

    // Stop the QR code reader first
    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
        console.log("🔄 QR Reader reset");
      } catch (err) {
        console.log("QR Reader already stopped");
      }
    }

    // Stop camera tracks
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => {
        track.stop();
        console.log("📹 Camera track stopped:", track.kind);
      });
      videoRef.current.srcObject = null;
    }

    hasScannedRef.current = true;
    setScanning(false);
  };

  // Back button handler - FIXED
  const handleBack = () => {
    console.log("🔙 Back button clicked");

    // Stop camera and cleanup
    stopCamera();

    // Clear any pending timeouts
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    // Navigate immediately
    navigate("/student");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          Scan Attendance QR Code
        </h2>

        {/* Camera Preview */}
        <div className="relative bg-black rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            muted
            autoPlay
            playsInline
          />
          {scanning && !error && !success && (
            <div className="absolute inset-0 border-2 border-green-500 rounded-lg animate-pulse"></div>
          )}
        </div>

        {/* Status Messages */}
        {scanning && !error && !success && (
          <p className="text-blue-600 text-center mb-4">
            🔍 Scanning for QR code...
          </p>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
            <p className="text-sm mt-1">Redirecting in 2 seconds...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Debug Info */}
        <div className="text-xs text-gray-500 mb-4">
          <p>Event ID: {id}</p>
          <p>User: {user?.name}</p>
          <p>Status: {scanning ? "Scanning" : "Stopped"}</p>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 text-center mb-4">
          <p>Point your camera at the event's QR code to mark attendance</p>
        </div>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
