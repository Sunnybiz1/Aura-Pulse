import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Sparkles, Video, User } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/programs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Compass size={22} />
        <span>Workouts</span>
      </NavLink>

      <NavLink to="/ai-coach" className={({ isActive }) => `nav-item nav-item-center ${isActive ? 'active' : ''}`}>
        <Sparkles size={24} />
      </NavLink>

      <NavLink to="/exercises" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Video size={22} />
        <span>Videos</span>
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <User size={22} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
}
