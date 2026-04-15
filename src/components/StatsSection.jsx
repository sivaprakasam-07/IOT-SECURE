import SensorCard from "./SensorCard";

const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const StatsSection = ({ sensorData }) => {
    const temperature = toNumber(sensorData.temperature);
    const gas = toNumber(sensorData.gas);
    const motionDetected = Boolean(sensorData.motion);

    const cards = [
        {
            title: "Temperature",
            icon: "🔥",
            value: temperature ?? "--",
            unit: temperature !== null ? "°C" : "",
            tone: temperature !== null && temperature > 40 ? "red" : "green",
            statusLabel: temperature !== null && temperature > 40 ? "Critical" : "Normal"
        },
        {
            title: "Gas",
            icon: "💨",
            value: gas ?? "--",
            unit: "ppm",
            tone: gas !== null && gas > 300 ? "red" : "green",
            statusLabel: gas !== null && gas > 300 ? "Leak Risk" : "Safe"
        },
        {
            title: "Motion",
            icon: "🚨",
            value: motionDetected ? "Detected" : "No Motion",
            unit: "",
            tone: motionDetected ? "yellow" : "green",
            statusLabel: motionDetected ? "Attention" : "Clear"
        }
    ];

    return (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {cards.map((card) => (
                <SensorCard key={card.title} {...card} />
            ))}
        </section>
    );
};

export default StatsSection;
