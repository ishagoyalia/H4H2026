import React from 'react';

function ProfileCard({ profile }) {
  return (
    <div className="profile-card">
      <img src={profile?.avatar || '/default-avatar.png'} alt={profile?.name} />
      <h2>{profile?.name}</h2>
      <p>{profile?.email}</p>
      <p>{profile?.bio}</p>
      <button>Edit Profile</button>
    </div>
  );
}

export default ProfileCard;
