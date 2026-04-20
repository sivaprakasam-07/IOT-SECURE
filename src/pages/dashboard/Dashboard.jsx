import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import StatsSection from "../../components/StatsSection";
import LineChartComponent from "../../components/charts/LineChartComponent";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../services/firebase";
import { checkForAlerts } from "../../services/checkAlerts";
import { listenToSensorData } from "../../services/sensorService";
import { showToast } from "../../utils/toast";

const MAX_READINGS = 20;

const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const formatTime = () =>
    new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

const Dashboard = () => {
    const [sensorData, setSensorData] = useState({
        temperature: "--",
        gas: "--",
        motion: false
    });

    const [readings, setReadings] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [deviceStatus, setDeviceStatus] = useState("offline"); // "online" or "offline"
    const [lastTimestamp, setLastTimestamp] = useState(null);
    const [lastNotifiedStatus, setLastNotifiedStatus] = useState(null);

    const navigate = useNavigate();
    const { role } = useAuth();

    const TIMEOUT_THRESHOLD = 8000; // 8 seconds (5-10 second range)

    const handleLogout = async () => {
        await signOut(auth);
        showToast("success", "Logged out successfully 👋");
        navigate("/");
    };

    useEffect(() => {
        const unsubscribe = listenToSensorData((data) => {
            setSensorData(data);
            checkForAlerts(data);

            // Update last timestamp when data is received
            setLastTimestamp(Date.now());
            setDeviceStatus("online");

            const temperature = toNumber(data.temperature);
            const gas = toNumber(data.gas);

            if (temperature === null && gas === null) return;

            setReadings((prev) => {
                const next = [
                    ...prev,
                    {
                        time: formatTime(),
                        temperature,
                        gas
                    }
                ];

                return next.slice(-MAX_READINGS);
            });
        });

        return () => {
            unsubscribe(); // ✅ cleanup Firebase listener
        };
    }, []);

    // Monitor device online/offline status
    useEffect(() => {
        const checkDeviceStatus = () => {
            if (lastTimestamp === null) {
                setDeviceStatus("offline");
                return;
            }

            const timeSinceLastUpdate = Date.now() - lastTimestamp;
            const isOnline = timeSinceLastUpdate <= TIMEOUT_THRESHOLD;
            const newStatus = isOnline ? "online" : "offline";

            // Only show toast if status changed
            if (newStatus !== lastNotifiedStatus) {
                if (newStatus === "online") {
                    showToast("success", "Device Online ✅");
                } else {
                    showToast("error", "Device Offline ❌");
                }
                setLastNotifiedStatus(newStatus);
            }

            setDeviceStatus(newStatus);
        };

        // Check device status every 3 seconds
        const interval = setInterval(checkDeviceStatus, 3000);

        return () => clearInterval(interval); // ✅ cleanup interval
    }, [lastTimestamp, lastNotifiedStatus]);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
            />

            <div className="md:pl-64">
                <Navbar
                    role={role}
                    deviceStatus={deviceStatus}
                    onMenuClick={() => setIsSidebarOpen(true)}
                    onLogout={handleLogout}
                />

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    <section className="mb-6 rounded-2xl border border-gray-700/60 bg-gray-800/60 p-5 shadow-lg">
                        <h2 className="text-xl font-semibold text-white">
                            Dashboard Overview
                        </h2>
                        <p className="mt-2 text-sm text-gray-400">
                            Live telemetry from your IoT environment with instant anomaly detection.
                        </p>
                    </section>

                    <StatsSection sensorData={sensorData} />

                    <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
                        <LineChartComponent
                            title="Temperature Trend"
                            data={readings}
                            dataKey="temperature"
                            stroke="#ef4444"
                            yUnit="°C"
                        />
                        <LineChartComponent
                            title="Gas Level Trend"
                            data={readings}
                            dataKey="gas"
                            stroke="#38bdf8"
                            yUnit=" ppm"
                        />
                    </section>

                    <section className="mt-6 rounded-2xl border border-gray-700/60 bg-gray-800/60 p-5 shadow-lg">
                        <p className="text-sm text-gray-300">
                            Thresholds:
                            <span className="ml-2 text-red-300">Temperature &gt; 40</span>
                            <span className="mx-2 text-gray-500">|</span>
                            <span className="text-red-300">Gas &gt; 300</span>
                            <span className="mx-2 text-gray-500">|</span>
                            <span className="text-yellow-300">Motion Detected</span>
                        </p>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;