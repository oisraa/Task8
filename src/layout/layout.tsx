import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div>
      <nav>/* Navigation Menu */</nav>
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
};

export default Layout;
