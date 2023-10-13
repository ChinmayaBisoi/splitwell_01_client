// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { v4 as uuidv4 } from "uuid";
// import { getAnalytics } from "firebase/analytics";
import {
  addDoc,
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  or,
  orderBy,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();

// COLLECTIONS
export const USER_COLLECTION = "user";
export const ALERT_COLLECTION = "alert";
export const FRIEND_REQUEST_COLLECTION = "friend_request";
export const GROUP_COLLECTION = "group";
export const TRANSACTION_COLLECTION = "transaction";
export const BALANCE_COLLECTION = "balance";

// COLLECTION_REFS
export const userCollectionRef = collection(db, USER_COLLECTION);
export const alertCollectionRef = collection(db, ALERT_COLLECTION);
export const friendRequestCollectionRef = collection(
  db,
  FRIEND_REQUEST_COLLECTION
);
export const groupCollectionRef = collection(db, GROUP_COLLECTION);
export const transactionCollectionRef = collection(db, TRANSACTION_COLLECTION);
export const balanceCollectionRef = collection(db, BALANCE_COLLECTION);

const ALERT_TYPES = {
  FRIEND_REQUEST: "friend_request",
};

export async function getOrCreateUser() {
  try {
    // Get the currently logged-in user
    const user = auth.currentUser;

    if (user) {
      // Define a reference to the user document in the "User" collection
      const userDocRef = doc(db, USER_COLLECTION, user.uid);

      // Check if the user document exists
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // If the user document exists, return its data
        return userDocSnapshot.data();
      } else {
        // If the user document doesn't exist, create it and then return its data
        const currentTime = Timestamp.now();
        const userData = {
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoUrl: user.photoURL,
          userId: user.uid,
          createdAt: currentTime,
          updatedAt: currentTime,
          // You can add more user-related data here
        };

        await setDoc(userDocRef, userData);

        return userData;
      }
    } else {
      console.log("No user is currently logged in.");
      return null; // Return null if no user is logged in
    }
  } catch (error) {
    console.error("Error getting/creating user:", error);
    return null; // Return null on error
  }
}
