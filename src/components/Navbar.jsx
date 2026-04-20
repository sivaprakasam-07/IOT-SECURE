const Navbar = ({ role, deviceStatus, onMenuClick, onLogout }) => {
    const roleBadgeClass =
        role === "admin"
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
            : "bg-blue-500/20 text-blue-300 border-blue-500/40";

    const deviceBadgeClass =
        deviceStatus === "online"
            ? "bg-green-500/20 text-green-300 border-green-500/40"
            : "bg-red-500/20 text-red-300 border-red-500/40";

    const dotColorClass =
        deviceStatus === "online"
            ? "bg-green-500"
            : "bg-red-500";

    const deviceStatusLabel = deviceStatus === "online" ? "Online" : "Offline";

    return (
        <header className="sticky top-0 z-20 border-b border-gray-700/60 bg-gray-900/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-gray-200 transition-all duration-200 hover:bg-gray-700 md:hidden"
                        aria-label="Open sidebar"
                    >
                        ☰
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-white sm:text-xl">IoT Monitor</h1>
                        <p className="text-xs text-gray-400">Realtime security dashboard</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase ${deviceBadgeClass}`}>
                        <span className={`h-2 w-2 rounded-full ${dotColorClass} animate-pulse`}></span>
                        Device: {deviceStatusLabel}
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${roleBadgeClass}`}>
                        {role}
                    </span>
                    <button
                        type="button"
                        onClick={onLogout}
                        className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition-all duration-200 hover:bg-red-500/20"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
