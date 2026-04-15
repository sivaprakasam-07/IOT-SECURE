import { useEffect, useState } from "react";
import { listenToAlerts } from "../../services/alertFetchService";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    listenToAlerts((data) => {
      setAlerts(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Alerts</h1>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <p>No alerts yet</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-gray-800 p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{alert.message}</h2>
                <p className="text-sm text-gray-400">
                  Type: {alert.type} | Value: {alert.value}
                </p>
              </div>

              <div className="text-sm text-gray-400">
                {new Date(alert.timestamp).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;