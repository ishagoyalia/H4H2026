import React from 'react';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>FriendZone</h1>
      </div>
      <ul className="navbar-menu">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/matches">Matches</a></li>
        <li><a href="/clubs">Clubs</a></li>
        <li><a href="/profile">Profile</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
