import { off, onValue, ref } from "firebase/database";
import { db } from "./firebase";

const SENSOR_HISTORY_PATHS = ["sensorHistory", "sensorData/history", "sensorLogs"];
const MAX_LIVE_SENSOR_LOGS = 120;

const normalizeTimestamp = (value) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return Date.now();
    }

    return parsed < 1e12 ? parsed * 1000 : parsed;
};

const normalizeObjectEntries = (data) => {
    if (!data) {
        return [];
    }

    if (Array.isArray(data)) {
        return data
            .map((entry, index) => ({ key: String(index), value: entry }))
            .filter((entry) => entry.value && typeof entry.value === "object");
    }

    if (typeof data === "object") {
        return Object.entries(data)
            .map(([key, value]) => ({ key, value }))
            .filter((entry) => entry.value && typeof entry.value === "object");
    }

    return [];
};

const readingToLogs = (entry, idPrefix) => {
    const timestamp = normalizeTimestamp(entry.timestamp);
    const logs = [];

    if (Number.isFinite(Number(entry.temperature))) {
        logs.push({
            id: `${idPrefix}-temperature-${timestamp}`,
            type: "temperature",
            value: Number(entry.temperature),
            message: "Temperature reading",
            timestamp
        });
    }

    if (Number.isFinite(Number(entry.gas))) {
        logs.push({
            id: `${idPrefix}-gas-${timestamp}`,
            type: "gas",
            value: Number(entry.gas),
            message: "Gas level reading",
            timestamp
        });
    }

    if (typeof entry.motion === "boolean" || Number.isFinite(Number(entry.motion))) {
        const motionDetected = typeof entry.motion === "boolean" ? entry.motion : Number(entry.motion) > 0;
        logs.push({
            id: `${idPrefix}-motion-${timestamp}`,
            type: "motion",
            value: motionDetected ? 1 : 0,
            message: motionDetected ? "Motion detected" : "No motion",
            timestamp
        });
    }

    return logs;
};

const normalizeAlertLogs = (rawAlerts) =>
    normalizeObjectEntries(rawAlerts).map(({ key, value }) => ({
        id: `alert-${key}`,
        type: "alert",
        value: Number.isFinite(Number(value.value)) ? Number(value.value) : "-",
        message: value.message || "Alert triggered",
        timestamp: normalizeTimestamp(value.timestamp)
    }));

const normalizeSensorHistoryLogs = (rawHistory, sourceKey) =>
    normalizeObjectEntries(rawHistory).flatMap(({ key, value }) => {
        if (typeof value.type === "string") {
            const normalizedType = ["temperature", "gas", "motion"].includes(value.type)
                ? value.type
                : "temperature";

            return [
                {
                    id: `${sourceKey}-${key}`,
                    type: normalizedType,
                    value: Number.isFinite(Number(value.value)) ? Number(value.value) : "-",
                    message: value.message || `${normalizedType} reading`,
                    timestamp: normalizeTimestamp(value.timestamp)
                }
            ];
        }

        return readingToLogs(value, `${sourceKey}-${key}`);
    });

const mergeLogs = (logGroups) => {
    const map = new Map();

    logGroups
        .flat()
        .sort((a, b) => b.timestamp - a.timestamp)
        .forEach((log) => {
            if (!map.has(log.id)) {
                map.set(log.id, log);
            }
        });

    return Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
};

export const listenToSystemLogs = (callback) => {
    let alertsLogs = [];
    const historyByPath = {};
    let liveSensorLogs = [];
    let lastLiveSignature = "";
    const alertsRef = ref(db, "alerts");
    const historyRefs = SENSOR_HISTORY_PATHS.map((path) => ({ path, ref: ref(db, path) }));
    const liveSensorRef = ref(db, "sensorData/device1");

    const emit = () => {
        callback(mergeLogs([alertsLogs, Object.values(historyByPath).flat(), liveSensorLogs]));
    };

    const handleAlertsValue = (snapshot) => {
        alertsLogs = normalizeAlertLogs(snapshot.val());
        emit();
    };

    const handleHistoryValues = historyRefs.map(({ path, ref: historyRef }) => {
        const handleHistoryValue = (snapshot) => {
            historyByPath[path] = normalizeSensorHistoryLogs(snapshot.val(), path);
            emit();
        };

        onValue(historyRef, handleHistoryValue);
        return { historyRef, handleHistoryValue };
    });

    const handleLiveSensorValue = (snapshot) => {
        const value = snapshot.val();
        if (!value) {
            return;
        }

        const liveLogs = readingToLogs(
            {
                ...value,
                timestamp: value.timestamp || Date.now()
            },
            "live-sensor"
        );

        const signature = JSON.stringify(liveLogs.map((log) => [log.type, log.value, log.timestamp]));
        if (signature === lastLiveSignature) {
            return;
        }

        lastLiveSignature = signature;
        liveSensorLogs = [...liveLogs, ...liveSensorLogs].slice(0, MAX_LIVE_SENSOR_LOGS);
        emit();
    };

    onValue(alertsRef, handleAlertsValue);
    handleHistoryValues.forEach(({ historyRef, handleHistoryValue }) => {
        onValue(historyRef, handleHistoryValue);
    });
    onValue(liveSensorRef, handleLiveSensorValue);

    return () => {
        off(alertsRef, "value", handleAlertsValue);
        off(liveSensorRef, "value", handleLiveSensorValue);
        handleHistoryValues.forEach(({ historyRef, handleHistoryValue }) => {
            off(historyRef, "value", handleHistoryValue);
        });
    };
};
