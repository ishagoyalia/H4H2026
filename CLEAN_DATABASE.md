# 🗑️ How to Remove Anonymous/Hardcoded Users from Firebase

## Problem
You're seeing "Anonymous" users and "Isha" with 17% compatibility. These are old/corrupted data in your Firebase database.

---

## ✅ Solution: Clean Your Firebase Database

### **Step 1: Open Firebase Console**

1. Go to: https://console.firebase.google.com/project/friendzone-417c2/firestore
2. Click on **Firestore Database** (left sidebar)
3. Make sure you're in the **Data** tab

### **Step 2: View All Users**

1. Click on the **"users"** collection
2. You'll see a list of all user documents
3. Each document ID is the userId

### **Step 3: Identify Bad Data**

Look for documents with these characteristics:
- **Empty/missing name** → Anonymous users
- **name: "Isha"** → Hardcoded test user
- **name: "test-user"** or **id: "test-user"** → OAuth fallback user
- **No email field** → Corrupted signup data
- **Old/invalid data** → From testing

### **Step 4: Delete Bad Documents**

For each bad document:
1. Click on the document
2. Click the **three dots (⋮)** in the top right
3. Select **"Delete document"**
4. Confirm deletion

**OR**

Delete the entire collection and start fresh:
1. Click on the "users" collection
2. Click **three dots (⋮)**
3. Select **"Delete collection"**
4. Type "users" to confirm
5. Refresh the page

---

## ⚠️ Which Users Should You Keep?

**Keep users with:**
- ✅ Valid email addresses
- ✅ Real names (not "Anonymous" or test names)
- ✅ Recent `updatedAt` timestamps
- ✅ Both `interests` and `mbti` fields

**Delete users with:**
- ❌ No name or "Anonymous"
- ❌ No email
- ❌ Test/dummy names like "Isha", "test-user", "User One", etc.
- ❌ Missing required fields (interests, mbti)

---

## 🔄 After Cleaning

1. **Restart your backend server** (if running):
   ```bash
   cd backend
   # Press Ctrl+C to stop
   node server.js
   ```

2. **Clear browser cache** (optional):
   - Press `Ctrl+Shift+Delete`
   - Clear cache and cookies for localhost
   - Refresh the page

3. **Re-login with your accounts**:
   - Login with Google
   - Complete signup questionnaire
   - Check Explore page

4. **Verify matches**:
   - You should only see real users now
   - No more "Anonymous" or "Isha"
   - Compatibility scores should be accurate

---

## 🎯 What Changed in the Code

### **Fixed Issues:**

1. **Removed hardcoded 'test-user' fallback** ([calendarController.js](backend/controllers/calendarController.js#L26))
   ```javascript
   // Before: const userId = req.query.state || 'test-user';
   // After:  const userId = req.query.state; // No fallback
   ```

2. **Fixed data merging** ([userService.js](backend/userService.js#L21))
   ```javascript
   // Now uses { merge: true } so name/email aren't deleted on signup
   await setDoc(doc(db, "users", userId), profileData, { merge: true });
   ```

3. **Added calendar availability display** ([App.jsx](FriendZone/src/App.jsx#L490-L510))
   - Shows "Monday, Mar 5: 14:00 - 17:00"
   - Formatted dates instead of ISO strings
   - Message when no overlap found

---

## 📊 Expected Database Structure

After cleaning, each user document should look like:

```json
{
  "userId": "abc123xyz...",
  "name": "John Doe",
  "email": "john@example.com",
  "interests": ["basketball", "coding"],
  "mbti": "ENFP",
  "onboardingComplete": true,
  "calendarConnected": false,
  "updatedAt": "2026-03-01T15:30:00Z"
}
```

**Optional fields** (only if calendar connected):
```json
{
  "availability": [
    { "day": "2026-03-05", "startTime": "14:00", "endTime": "17:00" }
  ],
  "googleCalendarTokens": { "access_token": "..." }
}
```

---

## 🚀 Next Steps

After cleaning your database:

1. **Delete all existing users** from Firebase Console
2. **Restart backend server**
3. **Login with 2 different Google accounts**
4. **Complete signup for both** (hobby + MBTI)
5. **Connect calendars** (Profile → Connect Google Calendar)
6. **Check Explore page** → Should see accurate matches!

---

## 💡 Prevention Tips

To avoid this in the future:

- ✅ Always check Firebase Console before debugging
- ✅ Delete test data after testing
- ✅ Use separate Firebase projects for dev/production
- ✅ Add validation to prevent incomplete user creation

---

## ❓ Still Having Issues?

If you still see weird data:

1. Check **Firebase Console** → Make 100% sure data is clean
2. **Clear localStorage** → Browser DevTools → Application → Local Storage → Clear All
3. **Hard refresh** → `Ctrl+Shift+R` on the frontend
4. **Check backend logs** → Look for any error messages when fetching matches
5. **Verify CORS** → Make sure backend allows your frontend origin

Your database is the source of truth - if it's clean, your app will be clean! 🧹✨
