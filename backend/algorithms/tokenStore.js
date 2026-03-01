// tokenStore.js - Firebase-based token storage for Google Calendar OAuth
import { db } from '../firebase.js';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

/**
 * Save Google Calendar OAuth tokens to user's Firestore document
 * @param {string} userId - The user's ID
 * @param {Object} tokens - OAuth tokens from Google (access_token, refresh_token, expiry_date, etc.)
 */
async function saveTokens(userId, tokens) {
  try {
    const userRef = doc(db, 'users', userId);

    // Check if user document exists
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // Update existing document with calendar tokens
      await updateDoc(userRef, {
        googleCalendarTokens: tokens,
        calendarConnected: true,
        calendarLastUpdated: new Date().toISOString()
      });
    } else {
      // Create new document with tokens
      await setDoc(userRef, {
        googleCalendarTokens: tokens,
        calendarConnected: true,
        calendarLastUpdated: new Date().toISOString()
      });
    }

    console.log(`Saved Google Calendar tokens for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error saving tokens to Firebase:', error);
    throw error;
  }
}

/**
 * Retrieve Google Calendar OAuth tokens from user's Firestore document
 * @param {string} userId - The user's ID
 * @returns {Object|null} OAuth tokens or null if not found
 */
async function getTokens(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return userData.googleCalendarTokens || null;
    }

    return null;
  } catch (error) {
    console.error('Error retrieving tokens from Firebase:', error);
    return null;
  }
}

export { saveTokens, getTokens };
