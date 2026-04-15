const toneStyles = {
    red: {
        badge: "bg-red-500/20 text-red-300 border-red-500/40",
        value: "text-red-400"
    },
    yellow: {
        badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
        value: "text-yellow-300"
    },
    green: {
        badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        value: "text-emerald-300"
    }
};

const SensorCard = ({ title, icon, value, unit, statusLabel, tone = "green" }) => {
    const styles = toneStyles[tone] ?? toneStyles.green;

    return (
        <article className="group rounded-2xl border border-gray-700/60 bg-gray-800/90 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium uppercase tracking-wider text-gray-400">{title}</p>
                    <p className={`mt-2 text-3xl font-bold ${styles.value}`}>
                        {value}
                        {unit ? <span className="ml-1 text-lg text-gray-300">{unit}</span> : null}
                    </p>
                </div>
                <span className="rounded-xl bg-gray-700/70 px-3 py-2 text-2xl" aria-hidden="true">
                    {icon}
                </span>
            </div>

            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${styles.badge}`}>
                {statusLabel}
            </span>
        </article>
    );
};

export default SensorCard;
