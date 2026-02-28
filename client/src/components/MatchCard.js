import React from 'react';

function MatchCard({ match }) {
  return (
    <div className="match-card">
      <img src={match?.avatar || '/default-avatar.png'} alt={match?.name} />
      <h3>{match?.name}</h3>
      <p>{match?.bio}</p>
      <button>Connect</button>
    </div>
  );
}

export default MatchCard;
