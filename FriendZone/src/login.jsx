import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Login from "./components/loginpage.jsx"
import Signup from "./components/signup.jsx"

    return (
        <div>
            <h1>Welcome to FriendZone</h1>

            {error && <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>}

            {/* Google Sign-In Button - Click opens Google popup immediately */}
            <button
                onClick={handleGoogleLogin}
                disabled={loading}
                style={{
                    padding: '12px 30px',
                    fontSize: '16px',
                    backgroundColor: '#4285F4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1
                }}
            >
                {loading ? 'Signing in...' : 'Login with Google'}
            </button>
        </div>
    )
}