import { ref, set } from "firebase/database";
import { db } from "./firebase";

const generateRandomData = () => {
    return {
        temperature: Math.floor(Math.random() * 50),
        gas: Math.floor(Math.random() * 500),
        motion: Math.random() > 0.5,
        timestamp: Date.now()
    };
};

export const startSimulation = () => {
    setInterval(() => {
        const data = generateRandomData();
        set(ref(db, "sensorData/device1"), data);
    }, 3000);
};