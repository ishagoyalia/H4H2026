import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";


function User() {
    return (
        <>
            <BrowserRouter>
                <nav>
                    <Link to="/">Home</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<App />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default User;