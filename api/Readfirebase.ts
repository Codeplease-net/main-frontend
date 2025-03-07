// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyDnhWA19wj9OZV6ZoVm3Yz27LcroG-Vkzg",
    authDomain: "leaco-dev.firebaseapp.com",
    projectId: "leaco-dev",
    storageBucket: "leaco-dev.appspot.com",
    messagingSenderId: "715237754824",
    appId: "1:715237754824:web:4b510ac27509746ee1a2fd",
    measurementId: "G-4R017X4QMV",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const githubProvider = new GithubAuthProvider();
