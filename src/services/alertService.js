import { ref, push } from "firebase/database";
import { db } from "./firebase";

export const createAlert = (alertData) => {
  const alertsRef = ref(db, "alerts");
  push(alertsRef, alertData);
};