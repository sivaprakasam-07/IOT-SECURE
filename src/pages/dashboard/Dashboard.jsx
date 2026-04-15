import { useEffect, useState } from "react";
import { startSimulation } from "../../services/simulator";
import { listenToSensorData } from "../../services/sensorService";
import { signOut } from "firebase/auth";
import { checkForAlerts } from "../../services/checkAlerts";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";

const Dashboard = () => {
  const [sensorData, setSensorData] = useState({
    temperature: "--",
    gas: "--",
    motion: "--"
  });
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    showToast("success", "Logged out successfully 👋");
    navigate("/");
  };
  const { role } = useAuth();

  useEffect(() => {
    listenToSensorData((data) => {
      setSensorData(data);
      checkForAlerts(data);
    });
    startSimulation();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-lg mb-2">Temperature</h2>
          <p className="text-2xl font-bold">{sensorData.temperature} °C</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-lg mb-2">Gas Level</h2>
          <p className="text-2xl font-bold">{sensorData.gas}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-lg mb-2">Motion</h2>
          <p className="text-2xl font-bold">
            {sensorData.motion ? "Detected 🚨" : "No Motion"}
          </p>

        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
        <span className={`px-3 py-1 rounded text-sm ${role === "admin" ? "bg-green-600" : "bg-blue-600"
          }`}>
          {role}
        </span>

      </div>
    </div>
  );
};

export default Dashboard;