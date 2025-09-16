import QRScanner from "../components/QRScanner";

export default function ScanAttendance() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl text-center">
        <h1 className="text-2xl font-bold mb-6">📷 Scan Attendance</h1>

        <p className="text-gray-600 mb-6">
          Align the QR code within the frame to mark participant attendance.
        </p>

        <div className="flex justify-center">
          <QRScanner />
        </div>

        <p className="text-sm text-gray-400 mt-6">
          Make sure the camera is enabled and has proper lighting.
        </p>
      </div>
    </div>
  );
}
