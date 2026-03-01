import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"
import Login from "./login.jsx"
import LoginPage from "./components/loginpage.jsx"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --cream: #F5F0E8;
    --brown-dark: #5C1E0A;
    --brown-mid: #8B3A10;
    --brown-light: #C26020;
    --brown-accent: #D4722A;
    --card-bg: #FDFAF4;
    --border: rgba(92, 30, 10, 0.1);
  }
  
  .home-screen {
    background: var(--cream);
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  
  .top-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 24px 16 px;
    gap: 10px;
    border-bottom: 1px solid rgba(200, 160, 80, 0.25);
  }

  .nav-icon {
    width: 36px;
    height: 36px;
    background: var(--brown-dark);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-title {
    font-family: 'Playfair Display', serif;
    font=size: 22px;
    font-weight: 600;
    color: var(--brown-dark);
    letter-spacing: 0.3px;
  }
`

const CalendarIcon = ({ color = "#fff", size = 20 }) => {
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="17" rx="3" stroke={color} strokeWidth="2" />
    <path d="M8 2v4M16 2v4M3 9h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="8" cy="14" r="1.5" fill={color} />
    <circle cx="12" cy="14" r="1.5" fill={color} />
    <circle cx="16" cy="14" r="1.5" fill={color} />
  </svg>
}


//Home page 
function App() {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Home", Icon: HomeIcon },
    { id: "calendar", label: "Calendar", Icon: CalIcon },
    { id: "matches", label: "Matches", Icon: MatchIcon },
    { id: "profile", label: "Profile", Icon: ProfileIcon },
  ];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login/page" element={<LoginPage />} />
        <Route path="/" element={<h1>yay</h1>} />
      </Routes>
    </BrowserRouter>


  )
}

export default App 