import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Login from "./components/loginpage.jsx"
import Signup from "./components/signup.jsx"
//@5:53, edited login.jsx to handle pop up google login EDITED
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../services/api"  // Import the api service

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    // Handle Google Sign-In - triggered immediately on button click
    const handleGoogleLogin = async () => {
        setLoading(true)
        setError("")

        try {
            const result = await api.loginWithGoogle()

            if (result.success) {
                // Login successful - store user info and redirect
                localStorage.setItem('userId', result.userId)
                localStorage.setItem('userEmail', result.email)
                localStorage.setItem('userName', result.name)

                console.log('Logged in as:', result.email)
                navigate("/dashboard")  // Redirect to dashboard
            } else {
                setError(result.error || "Login failed")
            }
        } catch (err) {
            setError("Login failed: " + err.message)
        } finally {
            setLoading(false)
        }
    }

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