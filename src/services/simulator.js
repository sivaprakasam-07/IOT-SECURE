import { ref, set } from "firebase/database";
import { db } from "./firebase";

let simulationIntervalId = null;

const generateRandomData = () => {
    return {
        temperature: Math.floor(Math.random() * 50),
        gas: Math.floor(Math.random() * 500),
        motion: Math.random() > 0.5,
        timestamp: Date.now()
    };
};

export const startSimulation = () => {
    if (simulationIntervalId) {
        clearInterval(simulationIntervalId);
    }

    simulationIntervalId = setInterval(() => {
        const data = generateRandomData();
        set(ref(db, "sensorData/device1"), data);
    }, 3000);

    return simulationIntervalId;
};

export const stopSimulation = () => {
    if (simulationIntervalId) {
        clearInterval(simulationIntervalId);
        simulationIntervalId = null;
    }
};