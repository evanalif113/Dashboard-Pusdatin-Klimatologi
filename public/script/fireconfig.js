// fireconfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDalcCwwOthPMjC3umkpQECqlQQj699FTY",
    authDomain: "staklimjerukagung.firebaseapp.com",
    databaseURL: "https://staklimjerukagung-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "staklimjerukagung",
    storageBucket: "staklimjerukagung.appspot.com",
    messagingSenderId: "763003005982",
    appId: "1:763003005982:web:8ce295eda92c6b9112d20f",
    measurementId: "G-DRL05TMRNT"
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {analytics};
export default app;  // Menggunakan default export untuk app