import React from "react";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <body>
      <nav>
        <span>Yago Pazos</span>
              <div>
                  <a href="/">Home</a>
          <a href="/about">About me</a>
          <a href="/prices">Prices</a>
          <a href="/booking">Booking</a>
        </div>
      </nav>
      <Outlet />
    </body>
  );
};

export default Layout;
