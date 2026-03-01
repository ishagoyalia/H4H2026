import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./login.jsx";
import LoginPage from "./components/loginpage.jsx";
import Signup from "./components/signup.jsx";

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #eeddc2ff; font-family: sans-serif; width: 100%; }

  .top-nav {
    width: 100vw;          /* stretch across the screen */
    display: flex;
    flex-direction: horizontal;
    align-items: center;   /* vertical centering of items inside */
    justify-content: center; /* horizontal centering */
    padding: 20px 0;       /* top/bottom padding only */
    background: #eed4ffff;
  }

  .home-screen {
    background: #eed4ffff;
    font-family: 'DM Sans', sans-serif;
    min-height: calc(100vh - 80px);
    display: flex;
    flex-direction: column;
    justify-content: center;  /* vertical centering */
    align-items: center;      /* horizontal centering */
    min-height: calc(100vh - 80px); /* full viewport minus top nav height */
    width: 100vw;              /* full width */
  }

  .home-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 columns */
    grid-template-rows: repeat(2, 150px)
    gap: 20px; /* space between boxes */
    row-gap: 40px;
    width: 80%; /* optional: grid width inside home-screen */
    max-width: 600px; /* optional max width */
  }

  .exploreButton {
    background-image: linear-gradient(to bottom right, #e97439ff, #b74bd7ff);
    border-radius: 80px; /* rounded corners */
    height: 300px; /* box height */
    width: 250px;
    padding: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    color: #ffffffff;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);

    display: grid;
    grid-template-columns: 1fr; 
    grid-template-rows: 1fr 1fr; 
  }

  .exploreButton:hover {
    filter: brightness(0.7); /* Darkens the button and its contents by 30% */
  }

  .explorePopup {
    visibility: hidden;
    width: 500px;
    height: 500px;
    background-color: #eeddc2ff;
  }

  .popup .show {
    visibility: visible;
    -webkit-animation: fadeIn 1s;
    animation: fadeIn 1s;
  }

  .footer {
    height: 100px;
  }

  .profile_deets {
    color: black;
  }

  // .fa-solid fa-circle-user {
  //   font-size: 50px;
  // }
`;

const CalendarIcon = ({ color = "#000", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="17" rx="3" stroke={color} strokeWidth="2" />
    <path d="M8 2v4M16 2v4M3 9h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="8" cy="14" r="1.5" fill={color} />
    <circle cx="12" cy="14" r="1.5" fill={color} />
    <circle cx="16" cy="14" r="1.5" fill={color} />
  </svg>
);

// Dummy icons so app runs
const HomeIcon = () => <div>🏠</div>;
const MatchIcon = () => <div>💖</div>;
const ProfileIcon = () => <div>👤</div>;

// Home page
function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [showPopup, setShowPopup] = useState(false);

  const tabs = [
    { id: "home", label: "Home", Icon: HomeIcon },
    { id: "calendar", label: "Calendar", Icon: CalendarIcon },
    { id: "matches", label: "Matches", Icon: MatchIcon },
    { id: "profile", label: "Profile", Icon: ProfileIcon },
  ];

  return (
    <>
      <style>{styles}</style>

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login/page" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/user" element={<User />} /> */}
          <Route path="/" element={
            <>

              <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"></link>
              </head>

              <div className="top-nav">
                <h1>FriendZone</h1>
                {/* <h2>User</h2> */}
              </div>

              <div className="home-screen">
                <h1>Explore</h1>


                <div className="home-grid">
                  <button
                    type="button"
                    className="exploreButton"
                    onClick={() => setShowPopup(true)}
                  >
                    <i class="fa-solid fa-circle-user fa-5x"></i>
                    Profile 1
                  </button>
                  <button
                    type="button"
                    className="exploreButton"
                    onClick={() => setShowPopup(true)}
                  >
                    <i class="fa-solid fa-circle-user fa-5x"></i>
                    Profile 2
                  </button>
                  <button
                    type="button"
                    className="exploreButton"
                    onClick={() => setShowPopup(true)}
                  >
                    <i class="fa-solid fa-circle-user fa-5x"></i>
                    Profile 3
                  </button>
                  <button
                    type="button"
                    className="exploreButton"
                    onClick={() => setShowPopup(true)}
                  >
                    <i class="fa-solid fa-circle-user fa-5x"></i>
                    Profile 4
                  </button>
                </div>

                {showPopup && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(0,0,0,0.4)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1000,
                    }}
                    onClick={() => setShowPopup(false)} // click outside closes
                  >
                    <div
                      style={{
                        background: "#fff",
                        padding: "30px",
                        borderRadius: "12px",
                        width: "400px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                      }}
                      onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
                    >
                      <div class="profile_deets">
                        <h2>Name: ___________</h2>
                        <h3>Bio: _____________</h3>
                        <p>Times You're Both Available:</p>
                        <p>Mon: 3 - 5 pm</p>
                        <p>Wed: 6 - 7 pm</p>
                        <p>Sat: 8 - 12 am</p>
                      </div>

                      <button
                        onClick={() => setShowPopup(false)}
                        style={{
                          marginTop: "20px",
                          padding: "10px 20px",
                          borderRadius: "8px",
                          border: "none",
                          background: "#e97439",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </>

          } />
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;