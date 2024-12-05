// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyARa723OLeKaGyIgYL07VVybAGqptR5ViU",
  authDomain: "codeplease-3c8d9.firebaseapp.com",
  projectId: "codeplease-3c8d9",
  storageBucket: "codeplease-3c8d9.firebasestorage.app",
  messagingSenderId: "598228116861",
  appId: "1:598228116861:web:238f2d0638682061395814"
};
  
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const githubProvider = new GithubAuthProvider();
