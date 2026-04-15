import { off, onValue, ref } from "firebase/database";
import { db } from "./firebase";

export const listenToSensorData = (callback) => {
  const sensorRef = ref(db, "sensorData/device1");
  const handleValue = (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  };

  onValue(sensorRef, handleValue);

  return () => off(sensorRef, "value", handleValue);
};