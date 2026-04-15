import { createAlert } from "./alertService";
import { showToast } from "../utils/toast";

let lastAlertTime = {
  temperature: 0,
  gas: 0,
  motion: 0
};

const COOLDOWN = 10000;

export const checkForAlerts = (data) => {
  const { temperature, gas, motion } = data;
  const now = Date.now();

  if (temperature > 40 && now - lastAlertTime.temperature > COOLDOWN) {
    createAlert({
      type: "temperature",
      value: temperature,
      message: "High Temperature Detected",
      timestamp: now
    });
    showToast("warning", "High Temperature 🔥", { id: "alert-temperature" });
    lastAlertTime.temperature = now;
  }

  if (gas > 300 && now - lastAlertTime.gas > COOLDOWN) {
    createAlert({
      type: "gas",
      value: gas,
      message: "Gas Leak Detected",
      timestamp: now
    });
    showToast("error", "Gas Leak Detected 💨", { id: "alert-gas" });
    lastAlertTime.gas = now;
  }

  if (motion && now - lastAlertTime.motion > COOLDOWN) {
    createAlert({
      type: "motion",
      value: 1,
      message: "Motion Detected",
      timestamp: now
    });
    showToast("info", "Motion Detected 🚨", { id: "alert-motion" });
    lastAlertTime.motion = now;
  }
};