import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./login.jsx";
import LoginPage from "./components/loginpage.jsx";

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #eeddc2ff; font-family: sans-serif; width: 100%; }

  .top-nav {
    width: 100vw;          /* stretch across the screen */
    display: flex;
    align-items: center;   /* vertical centering of items inside */
    justify-content: center; /* horizontal centering */
    padding: 20px 0;       /* top/bottom padding only */
    background: #ff002bff;
  }

  .home-screen {
    background: #452d08ff;
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
    grid-gap: 20px; /* space between boxes */
    width: 80%; /* optional: grid width inside home-screen */
    max-width: 600px; /* optional max width */
  }

  .grid-box {
    background: #1e0b98ff; /* any color you like */
    border-radius: 20px; /* rounded corners */
    height: 150px; /* box height */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    color: #00aaffff;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
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
          <Route path="/" element={
            <>
              <div className="top-nav">
                <h1>FriendZone</h1>
              </div>
              <div className="home-screen">
                <h1>Explore</h1>
                <div className="home-grid">
                  <div className="grid-box">Box 1</div>
                  <div className="grid-box">Box 2</div>
                  <div className="grid-box">Box 3</div>
                  <div className="grid-box">Box 4</div>
                </div>

              </div>
            </>

          } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;