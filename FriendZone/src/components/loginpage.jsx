import React, { useState } from "react"
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

export default function login() {
    const [username, setUser] = useState("")
    const [password, setPassword] = useState("")

    const handle = (e) => {
        e.preventDefault()
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handle}>
                <input //The username inputs 
                    type="Username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUser(e.target.value)}
                    required
                />
                <input //Password input
                    type="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Link to="/"><button type="Submit"> Login</button></Link>
            </form>

        </div>
    )
}