import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { api } from "../services/api.js"  // Import the api service
import { generateAuthUrl } from "../services/googleCalendar.js";

export default function signup() {
    const [role, setRole] = useState(''); // default value
    const [hobbies, setHobbies] = useState('');
    const handleRoleChange = e => setRole(e.target.value)
    const handleHobbiesChange = e => setHobbies(e.target.value)
    const [MBTI, setMBTI] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log('Selected hobby:', hobbies, 'MBTI:', MBTI);

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

        if (!userId) {
            alert("User ID not found. Please log in again.");
            return;
        }

        // If you save ["sports", "basketball"], you WILL match with them on "sports".
        const profileData = {
            interests: [role, hobbies].filter(Boolean),
            mbti: MBTI.toUpperCase().trim(),
            calendarConnected: false
        };

        try {
            // Save the profile to your database
            await api.updateProfile(userId, profileData);

            // 3. REAL FIX FOR CALENDAR: Redirect to Google for Permissions
            // This pulls the URL from your googleCalendar.js generateAuthUrl()
            const authUrl = generateAuthUrl();

            // Redirect the user to the Google Consent Screen
            window.location.href = authUrl;

        } catch (err) {
            console.error('Signup update failed:', err);
            alert("There was an error saving your profile.");
        }

        /*
        // Save interest and MBTI for matching algorithm
        await api.updateProfile(userId, {
            interests: [hobbies],
            mbti: MBTI.toUpperCase()  // Ensure uppercase (ENFP not enfp)
        });*/
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

            <input //The MBTI inputs 
                type="MBTI"
                placeholder="Enter your MBTI type"
                value={MBTI}
                onChange={(e) => setMBTI(e.target.value)}
                required
            />

            <Link to="/"><button type="Submit" onClick={handleSubmit}> Submit </button></Link>
            <p> </p>
            <Link to="https://www.16personalities.com/free-personality-test" target="_blank">If you don't know your MBTI type, click here to find out!</Link>
        </div>
    )
}