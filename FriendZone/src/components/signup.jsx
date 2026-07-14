import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { api } from "../services/api.js"  // Import the api service

export default function signup() {
    const [role, setRole] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [MBTI, setMBTI] = useState("")
    const navigate = useNavigate();

    const handleRoleChange = e => setRole(e.target.value)
    const handleHobbiesChange = e => setHobbies(e.target.value)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!role || !hobbies || !MBTI.trim()) {
            alert("Please complete your role, hobby, and MBTI.");
            return;
        }

        let userId = localStorage.getItem('userId');
        if (!userId) {
            try {
                const current = await api.getCurrentUser();
                if (current) {
                    if (Array.isArray(current.providerData)) {
                        const googleProvider = current.providerData.find(p => p.providerId === 'google.com');
                        if (googleProvider && googleProvider.uid) {
                            userId = googleProvider.uid;
                        }
                    }
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

        try {
            await api.updateProfile(userId, {
                interests: [role, hobbies].filter(Boolean),
                mbti: MBTI.toUpperCase().trim(),
                calendarConnected: false
            });

            // Google Calendar auth is optional for signup. Skip the redirect here so
            // users can finish creating their profile even if OAuth is unavailable.
            navigate('/profile');
        } catch (err) {
            console.error('Signup update failed:', err);
            alert("There was an error saving your profile.");
        }
    }

    return (
        <div>
            <h2>Signup Questionaire</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
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

                <input
                    type="text"
                    placeholder="Enter your MBTI type"
                    value={MBTI}
                    onChange={(e) => setMBTI(e.target.value)}
                    required
                />

                <button type="submit">Submit</button>
            </form>
        </div>
    )
}