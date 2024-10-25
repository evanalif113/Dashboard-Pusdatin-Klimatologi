// auth.js
import app from './fireconfig.js';  // Impor app dari fireconfig.js
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Inisialisasi Auth
const auth = getAuth(app);

// Fungsi untuk login menggunakan email dan password
export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
