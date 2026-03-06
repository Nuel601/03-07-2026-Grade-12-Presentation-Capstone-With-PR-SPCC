// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAEbKLcaRnMeujiQ2XWx8f5TqTlTC71c0w",
  authDomain: "barangay118-website.firebaseapp.com",
  databaseURL: "https://barangay118-website-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "barangay118-website",
  storageBucket: "barangay118-website.firebasestorage.app",
  messagingSenderId: "255746664706",
  appId: "1:255746664706:web:61d9cd618960147ef6ba1b",
  measurementId: "G-CQFZYJED7Z"
};

export const app = initializeApp(firebaseConfig);
