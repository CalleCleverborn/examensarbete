import React from "react";
import { Link } from "react-router-dom";
import "./_Header.scss";

const Header: React.FC = () => {
  return (
    <header>
      <h1>VocalFlow</h1>
      <nav>
        <ul>
          <li>
            <Link to="/app/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/app/my-plan">Plan</Link>
          </li>
          <li>
            <Link to="/app/about">About</Link>
          </li>
          <li>
            <Link to="/app/logout">Logout</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
