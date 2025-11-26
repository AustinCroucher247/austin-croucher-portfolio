import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="ac-navbar">
      <div className="ac-nav-inner">

        {/* ---------- LOGO ---------- */}
        <div className="ac-logo">
          <span className="ac-logo-icon">AC</span>
          <span className="ac-logo-text">Austin Croucher</span>
        </div>

        {/* ---------- HAMBURGER ---------- */}
        <button
          className={`ac-hamburger ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* ---------- NAV MENU ---------- */}
        <nav className={`ac-menu ${open ? "open" : ""}`}>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/portfolio" onClick={() => setOpen(false)}>Portfolio</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
