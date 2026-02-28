// backend/userService.js
import { db } from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";


// Create or update profile
// This function saves the user's questionnaire/profile data in Firestore.
// If a document with the given userId already exists, it overwrites it.
// If it doesn't exist, it creates a new one.
export async function saveUserProfile(userId, profileData) {
  try {
    // doc(db, "users", userId) → gets a reference to the document in the "users" collection with ID userId
    // setDoc() → writes data to that document
    await setDoc(doc(db, "users", userId), {
      ...profileData,   // Spread operator: adds all fields from profileData
      updatedAt: new Date(),    // Adds a timestamp so you know when the profile was last updated
    });
  } catch (error) {
    // If something goes wrong (network issues, permissions), log the error and rethrow it
    console.error("Error saving profile:", error);
    throw error;
  }
}


// Get a single user profile
export async function getUserProfile(userId) {
  try {
    // Get a reference to the specific document in "users"
    const docRef = doc(db, "users", userId);

    // Fetch the document from Firestore
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      // If the document exists, return its data as a JS object
      return snapshot.data();
    } 
    else {
      // If it doesn't exist, return null
      return null;
    }
  } catch (error) {
    console.error("Error getting profile:", error);
    throw error;
  }
}


// Get all users (for matching)
export async function getAllUsers() {
  try {
    // Reference the "users" collection
    const querySnapshot = await getDocs(collection(db, "users"));

    // Array to store all user objects
    const users = [];
    // Iterate through each document in the collection
    querySnapshot.forEach((doc) => {
      // doc.id → the document ID (userId)
      // doc.data() → the fields in the document
      // Combine them into one object and push to users array
      users.push({ id: doc.id, ...doc.data() });
    });

    // Return the array of all users
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}