import { ref, onValue } from "firebase/database";
import { db } from "./firebase";

export const listenToAlerts = (callback) => {
  const alertsRef = ref(db, "alerts");

  onValue(alertsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const alertsArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      }));
      callback(alertsArray.reverse());
    }
  });
};