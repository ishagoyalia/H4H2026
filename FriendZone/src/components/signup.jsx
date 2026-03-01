import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { api } from "../services/api.js"  // Import the api service

// Weight mappings for combinedScore calculation

const hobbyWeights = {
    // Sports hobbies
    'basketball': 1,
    'football': 1,
    'baseball': 1,
    'tennis': 1,
    'swimming': 1,
    // Social life hobbies
    'music': 1,
    'dancing': 1,
    'cooking': 1,
    'traveling': 1,
    'gaming': 1,
    // Academics hobbies
    'math': 1,
    'science': 1,
    'literature': 1,
    'history': 1,
    'art': 1,
};

export default function signup() {
    const [role, setRole] = useState(''); // default value
    const [hobbies, setHobbies] = useState('');
    const handleRoleChange = e => setRole(e.target.value)
    const handleHobbiesChange = e => setHobbies(e.target.value)

    const handleSubmit = async () => {
        // Get weights for selected options
        const hobbyWeight = hobbyWeights[hobbies] || 0;

        // Combine weights for combinedScore
        const weights = {
            hobbies,
            hobbyWeight,
        };

        console.log('Weights for combinedScore:', weights);
        // Resolve userId: prefer locally stored id (set at login), then prefer Google provider ID, fallback to Firebase user UID
        let userId = localStorage.getItem('userId');
        if (!userId) {
            try {
                const current = await api.getCurrentUser();
                if (current) {
                    // If user signed in with Google, the Google account id is usually in providerData
                    if (Array.isArray(current.providerData)) {
                        const googleProvider = current.providerData.find(p => p.providerId === 'google.com');
                        if (googleProvider && googleProvider.uid) {
                            userId = googleProvider.uid; // Google user ID (preferred)
                        }
                    }
                    // Fallback to Firebase uid when Google provider id isn't available
                    if (!userId && current.uid) userId = current.uid;
                }
            } catch (err) {
                console.error('Error fetching current user:', err);
            }
        }

        // Send weights to backend for the authenticated user
        await api.updateProfile(userId, { weights });
    }
    return (
        <div>
            <h2>Signup Questionaire</h2>
            <label htmlFor="role">What do you value most:</label>
            <select id="role" value={role} onChange={handleRoleChange}>
                <option value="">-- Select a role --</option>
                <option value="sports">Sports</option>
                <option value="social life">Social life</option>
                <option value="academics">Academics</option>
            </select>

            <select id="hobbies" value={hobbies} onChange={handleHobbiesChange}>
                <option value="">-- Select a hobby --</option>
                {role === "sports" && (
                    <>
                        <option value="basketball">Basketball</option>
                        <option value="football">Football</option>
                        <option value="baseball">Baseball</option>
                        <option value="tennis">Tennis</option>
                        <option value="swimming">Swimming</option>

                    </>
                )}
                {role === "social life" && (
                    <>
                        <option value="music">Music</option>
                        <option value="dancing">Dancing</option>
                        <option value="cooking">Cooking</option>
                        <option value="traveling">Traveling</option>
                        <option value="gaming">Gaming</option>
                    </>
                )}
                {role === "academics" && (
                    <>
                        <option value="math">Math</option>
                        <option value="science">Science</option>
                        <option value="literature">Literature</option>
                        <option value="history">History</option>
                        <option value="art">Art</option>
                    </>
                )}
            </select>
            <Link to="/"><button type="Submit" onClick={handleSubmit}> Sign up </button></Link>
        </div>
    )
}