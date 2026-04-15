import { memo } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const LineChartComponent = ({
    title,
    data,
    dataKey,
    stroke,
    yUnit = ""
}) => {
    return (
        <section className="rounded-2xl border border-gray-700/60 bg-gray-800/70 p-5 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">{title}</h3>
                <span className="text-xs text-gray-500">Last {data.length} readings</span>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke="#4b5563" strokeDasharray="3 3" strokeOpacity={0.35} />
                        <XAxis dataKey="time" stroke="#9ca3af" tick={{ fill: "#d1d5db", fontSize: 12 }} />
                        <YAxis
                            stroke="#9ca3af"
                            tick={{ fill: "#d1d5db", fontSize: 12 }}
                            tickFormatter={(value) => `${value}${yUnit}`}
                            width={50}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#111827",
                                border: "1px solid #374151",
                                borderRadius: "12px",
                                color: "#f9fafb"
                            }}
                            labelStyle={{ color: "#d1d5db" }}
                            formatter={(value) => [`${value}${yUnit}`, title]}
                        />
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={stroke}
                            strokeWidth={3}
                            dot={false}
                            isAnimationActive
                            animationDuration={450}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
};

export default memo(LineChartComponent);
