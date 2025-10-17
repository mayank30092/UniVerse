import QRScanner from "../components/QRScanner";

export default function ScanAttendance() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 md:p-12 w-full max-w-3xl text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-blue-600">
          📷 Scan Attendance
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Align the QR code within the frame to mark participant attendance.
        </p>

        <div className="flex justify-center mb-6">
          <QRScanner className="w-full h-96 md:h-[500px] rounded-xl shadow-md" />
        </div>

        <p className="text-sm md:text-base text-gray-400">
          Make sure the camera is enabled and has proper lighting for accurate
          scanning.
        </p>
      </div>
    </div>
  );
}
