import React, { useState } from 'react';
import { Link } from 'react-router-dom';
export default function NavBar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

return (
    <>
  <nav className="navbar">
    <div className="navbar-brand">
      <Link to="/">AI-Catch</Link>
    </div>
    <ul className="navbar-menu">
      <li
        className="navbar-item dropdown"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <span className="dropdown-toggle">Product</span>
        {isDropdownOpen && (
          <ul className="dropdown-menu">
            <li><Link to="/text">Text Detect</Link></li>
            <li><Link to="/file">File Detect</Link></li>
          </ul>
        )}
      </li>
      <li className="navbar-item">
        <Link to="/setting">Setting</Link>
      </li>
    </ul>
  </nav>
  </>
);
};