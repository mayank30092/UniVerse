import QRScanner from "../components/QRScanner";

export default function ScanAttendance() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <QRScanner />
    </div>
  );
}
