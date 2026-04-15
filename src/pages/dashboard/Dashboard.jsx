import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import StatsSection from "../../components/StatsSection";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../services/firebase";
import { checkForAlerts } from "../../services/checkAlerts";
import { listenToSensorData } from "../../services/sensorService";
import { startSimulation } from "../../services/simulator";
import { showToast } from "../../utils/toast";

const Dashboard = () => {
    const [sensorData, setSensorData] = useState({
        temperature: "--",
        gas: "--",
        motion: false
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { role } = useAuth();

    const handleLogout = async () => {
        await signOut(auth);
        showToast("success", "Logged out successfully 👋");
        navigate("/");
    };

    useEffect(() => {
        listenToSensorData((data) => {
            setSensorData(data);
            checkForAlerts(data);
        });

        startSimulation();
    }, []);

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
                    onMenuClick={() => setIsSidebarOpen(true)}
                    onLogout={handleLogout}
                />

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    <section className="mb-6 rounded-2xl border border-gray-700/60 bg-gray-800/60 p-5 shadow-lg">
                        <h2 className="text-xl font-semibold text-white">Dashboard Overview</h2>
                        <p className="mt-2 text-sm text-gray-400">
                            Live telemetry from your IoT environment with instant anomaly detection.
                        </p>
                    </section>

                    <StatsSection sensorData={sensorData} />

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
