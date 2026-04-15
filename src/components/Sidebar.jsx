import { NavLink } from "react-router-dom";

const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: "🏠" },
    { label: "Alerts", to: "/alerts", icon: "⚠️" },
    { label: "Logs", to: "/logs", icon: "📜" }
];

const linkClass = ({ isActive }) =>
    [
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
        isActive
            ? "bg-blue-600/20 text-blue-300 border border-blue-500/40"
            : "text-gray-300 hover:bg-gray-800 hover:text-white border border-transparent"
    ].join(" ");

const Sidebar = ({ isOpen, onClose, onLogout }) => {
    return (
        <>
            {isOpen ? (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={onClose}
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                />
            ) : null}

            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-700/60 bg-gray-900/95 p-4 shadow-2xl transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="mb-8 px-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Platform</p>
                    <h2 className="mt-2 text-xl font-bold text-white">IoT Monitor</h2>
                </div>

                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
                            <span aria-hidden="true">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-8 border-t border-gray-700/60 pt-6">
                    <button
                        type="button"
                        onClick={onLogout}
                        className="flex w-full items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 transition-all duration-200 hover:bg-red-500/20"
                    >
                        <span aria-hidden="true">↩</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
