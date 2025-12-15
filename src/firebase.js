// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importa o Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPTpuOWymGBVbFrjfWaBh5GA-g_RjzsGM",
  authDomain: "celtic-shape-454100-b1.firebaseapp.com",
  projectId: "celtic-shape-454100-b1",
  storageBucket: "celtic-shape-454100-b1.appspot.com",
  messagingSenderId: "670359528005",
  appId: "1:670359528005:web:d0d51f460ac51e4269792c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app); // Exporta a instância do banco de dados
