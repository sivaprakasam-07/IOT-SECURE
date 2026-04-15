import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyArvVkpcwxvaUUn3Shj8MUYYQtuuPaLplo",
  authDomain: "iot-monitoring-system07.firebaseapp.com",
  databaseURL: "https://iot-monitoring-system07-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "iot-monitoring-system07",
  storageBucket: "iot-monitoring-system07.firebasestorage.app",
  messagingSenderId: "94472074744",
  appId: "1:94472074744:web:6c3710d1a87a5cca87920d"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };