import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

import "./_Layout.scss";

const Layout: React.FC = () => {
  return (
    <div className="layout-wrapper">
      <Header />
      <div className="content-wrapper">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
