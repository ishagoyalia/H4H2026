import React, { useState } from "react"

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
                    value={username}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </form>

        </div>
    )
}