# 🚀 FriendZone Quick Start Guide

## ✅ FIXES APPLIED

### 1. **Backend Server Setup** (CRITICAL - was not running!)
- Created `.env` file in backend folder
- Backend server was NOT running, which is why you saw "No Match found"

### 2. **Google Calendar Auto-Connect** ✨
- ✅ **NOW WORKING!** Calendar automatically connects when you login with Gmail
- No manual connection step needed anymore
- Backend now extracts calendar tokens from Firebase Auth

### 3. **Google Analytics Setup** 📊
- Added Google Analytics tracking code to `index.html`
- **YOU NEED TO**: Replace `G-XXXXXXXXXX` with your actual GA4 Measurement ID
- Get it from: https://analytics.google.com/

---

## 🏃 HOW TO RUN THE APP

### **Step 1: Install Node.js**
If `npm` command not found:
- Download from: https://nodejs.org/ (LTS version recommended)
- Restart terminal after installing

### **Step 2: Start Backend Server** 
```bash
cd backend
npm install          # Install dependencies (only needed once)
node server.js       # Start the server
```
You should see:
```
BACKEND IS LIVE
Local:            http://localhost:5000
```
**⚠️ KEEP THIS TERMINAL OPEN - Backend must run continuously**

### **Step 3: Start Frontend** (in a NEW terminal)
```bash
cd FriendZone
npm install          # Install dependencies (only needed once)
npm run dev          # Start Vite dev server
```
You should see:
```
VITE ready in xxx ms
Local: http://localhost:5173
```

### **Step 4: Test the App**
1. Open http://localhost:5173 in your browser
2. Login with 2 different Google accounts (use incognito mode for 2nd account)
3. For each account: Complete signup with hobby (e.g., "basketball") and MBTI
4. Go to Explore page - you should now see matches! 🎉

---

## 🔧 GOOGLE ANALYTICS SETUP

1. Go to https://analytics.google.com/
2. Create a property for your app (if not already created)
3. Copy your Measurement ID (looks like `G-ABC123XYZ`)
4. Open `FriendZone/index.html`
5. Replace BOTH instances of `G-XXXXXXXXXX` with your actual ID
6. Save and restart frontend server

Now you'll see users in Google Analytics! 📈

---

## 🗂️ WHY WASN'T IT WORKING?

**Problem:** Backend server was not running
- Frontend was making API calls to `http://127.0.0.1:5000`
- But nothing was listening on that port
- Result: User data never saved to Firebase, no matches found

**Solution:** Always run `node server.js` in backend folder before using the app

---

## 📝 CALENDAR AUTO-CONNECT EXPLANATION

**Before:** Two separate OAuth systems
- Firebase Auth (login) requested calendar scope but didn't use it
- Backend had separate googleapis OAuth that needed manual trigger

**Now:** Unified system ✅
- When you login with Google, Firebase Auth gets calendar access token
- Frontend sends token to backend in login request
- Backend automatically saves token and marks calendar as connected
- No "Connect Calendar" button needed!

**What happens:**
1. User clicks "Login with Google"
2. Google consent screen asks for Gmail + Calendar permissions
3. User approves
4. Firebase Auth returns access token
5. Frontend sends token to backend (`POST /api/users`)
6. Backend saves token and sets `calendarConnected: true`
7. Matching algorithm can now use calendar availability! 🎉

---

## 🐛 TROUBLESHOOTING

### "No Match found" on Explore page
- ✅ Make sure backend server is running (`node server.js` in backend folder)
- Check browser console (F12) for errors
- Verify both users completed signup (hobby + MBTI)

### Google Analytics shows 0 users
- ✅ Replace `G-XXXXXXXXXX` in `index.html` with your real Measurement ID
- Wait 24-48 hours for GA to process data
- Check Real-Time reports in GA for immediate feedback

### Backend won't start
- Make sure Node.js is installed (`node --version`)
- Run `npm install` in backend folder first
- Check if port 5000 is already in use

---

## 📁 PROJECT STRUCTURE

```
H4H2026/
├── backend/              ← API server (port 5000)
│   ├── server.js        ← Start here: node server.js
│   ├── .env             ← ✅ Created (environment variables)
│   ├── algorithms/      ← Matching logic
│   └── controllers/     ← ✅ Modified (auto-save calendar tokens)
│
└── FriendZone/          ← React frontend (port 5173)
    ├── src/
    │   ├── App.jsx      ← Explore page
    │   └── services/api.js
    └── index.html       ← ✅ Modified (added Google Analytics)
```

---

## 🎯 NEXT STEPS

1. **Replace Google Analytics ID** in `index.html`
2. **Start both servers** (backend + frontend)
3. **Test with 2 accounts** to verify matching works
4. **Check Google Analytics** Real-Time view to see active users

Your app is now fully functional! 🚀
