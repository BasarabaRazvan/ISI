import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
} from "firebase/firestore";

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAG2tbOM5gjRo5QgRMqIHnEtZ6rOV6lHxA",
    authDomain: "las-vegas-casino.firebaseapp.com",
    projectId: "las-vegas-casino",
    storageBucket: "las-vegas-casino.appspot.com",
    messagingSenderId: "401121956410",
    appId: "1:401121956410:web:58c69b6f51fccabf60db03",
    measurementId: "G-4KPW6QXZP5"
  };

  // Initialize Firebase and Firestore
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app);
  const db = getFirestore(app);

  const formatError = (message) => {
    const newMessage = message.substr(22)
    return "Error: " +  newMessage.substr(0 , newMessage.length - 2);
  } 

  const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(formatError(err.message))
    }
  };

  const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
      });
    } catch (err) {
      alert(formatError(err.message))
    }
  };

  const logout = () => {
    signOut(auth);
  };

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
};