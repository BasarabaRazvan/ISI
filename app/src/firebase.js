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
  query,
  where,
  getDocs,
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

  const addCasino = async (name, rate) => {
    try {
      await addDoc(collection(db, "win-lose-rate"), {
        name,
        rate,
      });
    } catch (err) {
      alert(formatError(err.message))
    }
  };

  const searchCasino = async (name) => {
    try {
      const Ref = collection(db, "win-lose-rate");
      // Create a query against the collection.
      const q = query(Ref, where("name", "==", name));
      const querySnapshot = await getDocs(q);
      //console.log(querySnapshot.docs[0].data().rate);
      return await querySnapshot.docs[0].data().rate;
    } catch (err) {
      alert(formatError(err.message))
    }
  };

  const addToDBFavourites = async (uid, title) => {
    try {
      await addDoc(collection(db, "favourites"), {
        uid,
        title,
      });
    } catch (err) {
      alert(formatError(err.message))
    }
  };

  const searchFavourites = async (uid) => {
    try {
      const Ref = collection(db, "favourites");
      // Create a query against the collection.
      const q = query(Ref, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      let result = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        result.push(doc.data())
      })
     // console.log(result);
      return result;
      //return await querySnapshot.docs[0].data();
    } catch (err) {
      alert(formatError(err.message))
    }
  };

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
  addCasino,
  searchCasino,
  addToDBFavourites,
  searchFavourites,
};