import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Login from "./components/loginpage.jsx"
import Signup from "./components/signup.jsx"

export default function login() {
    return (
        <div>
            <h1>Welcome to FriendZone</h1>
            <Link to="/login/page">Login</Link>
        </div>
    )
}