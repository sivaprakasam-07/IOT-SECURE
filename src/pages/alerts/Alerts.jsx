import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listenToAlerts } from "../../services/alertFetchService";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToAlerts((data) => {
      setAlerts(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-sm font-medium text-gray-200 transition-all duration-200 hover:bg-gray-700"
            >
              <span aria-hidden="true">←</span>
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Alerts</h1>
              <p className="mt-1 text-sm text-gray-400">
                Monitoring triggered system events in realtime.
              </p>
            </div>
          </div>

          <div className="hidden rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300 sm:inline-flex">
            {alerts.length} records
          </div>
        </header>

        <section className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-lg">
          <div className="divide-y divide-gray-700">
            {alerts.length === 0 ? (
              <div className="p-6 text-sm text-gray-400">No alerts yet</div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex flex-col gap-4 p-4 transition-colors duration-200 hover:bg-gray-700/60 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 rounded-full bg-purple-500/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-purple-300">
                      {alert.type}
                    </span>
                    <div>
                      <h2 className="font-semibold text-white">{alert.message}</h2>
                      <p className="mt-1 text-sm text-gray-400">Value: {alert.value}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-400 sm:text-right">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Alerts;