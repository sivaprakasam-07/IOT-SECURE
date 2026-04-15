import { off, onValue, ref } from "firebase/database";
import { db } from "./firebase";

export const listenToAlerts = (callback) => {
  const alertsRef = ref(db, "alerts");
  const handleValue = (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const alertsArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      }));
      callback(alertsArray.reverse());
    }
  };

  onValue(alertsRef, handleValue);

  return () => off(alertsRef, "value", handleValue);
};