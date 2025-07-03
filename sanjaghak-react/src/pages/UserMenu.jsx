import React, { useState } from "react";
import { Link } from "react-router-dom";
import "/src/styles//UserMenu.css";
import profileIcon from "../assets/user.png";
import Shop from '../assets/shopping-bag.png';
import favorite from '../assets/favorite.png';
import exit from '../assets/exit2.png';
import LogoutModal from './LogoutModal';

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className="user-menu-container"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <img src={profileIcon} alt="پروفایل" className="profile-icon" />
      
      {open && (
        <div className="user-dropdown">
          <Link to="/profile-orders">
            <img src={Shop} alt="" className="proficon"/>
            سفارش‌ها
          </Link>
          <hr />
          <Link to="/profile-favorites">
            <img src={favorite} alt="" className="proficon"/>
            علاقه‌مندی‌ها
          </Link>
          <hr />
          <Link to="/profile-edit">
            <img src={profileIcon} alt="" className="proficon"/>
            اطلاعات کاربری
            </Link>
          <hr />
          <div onClick={handleLogoutClick} className="logout">
            <img src={exit} alt="" className="proficon"/>
            خروج از حساب کاربری
          </div>
        </div>
      )}

      {isModalOpen && <LogoutModal onClose={handleCloseModal} />}
    </div>
  );
};

export default UserMenu;