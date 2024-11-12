import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../styles/Layout.css'; // Optional CSS for layout styling
import personImageUrl from '../assets/person.png';
import logoImgUrl from '../assets/sidebar.png'
import iconVectorUrl from '../assets/Vector.png'
import bookMarkUrl from '../assets/bookmark 1.png'
import logoutUrl from '../assets/sign-out-alt 1.png'
const Layout: React.FC = () => {
  

  return (
    <div className="layout">
      <Sidebar personimg={personImageUrl}
       logoimg={logoImgUrl}
        iconvector={iconVectorUrl}
         bookmark={bookMarkUrl}
         logouticon={logoutUrl}/> {/* Pass the required prop */}
      <div className="content">
        <Outlet /> {/* This renders the child route components */}
      </div>
    </div>
  );
};

export default Layout;
