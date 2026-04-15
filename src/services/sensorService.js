import { ref, onValue } from "firebase/database";
import { db } from "./firebase";

export const listenToSensorData = (callback) => {
  const sensorRef = ref(db, "sensorData/device1");

  return onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
};