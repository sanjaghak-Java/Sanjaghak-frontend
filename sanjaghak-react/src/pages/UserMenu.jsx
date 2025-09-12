import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "/src/styles/UserMenu.css";
import profileIcon from "../assets/user.png";
import Shop from "../assets/shopping-bag.png";
import favorite from "../assets/favorite.png";
import exit from "../assets/exit2.png";
import LogoutModal from "./LogoutModal";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("id")
        localStorage.removeItem("customerId")
    setIsModalOpen(false);
    navigate("/signin");
    window.location.reload();
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    setIsModalOpen(false);
    navigate("/signin");
    window.location.reload();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="user-menu-container" ref={menuRef}>
      <img
        src={profileIcon}
        alt="پروفایل"
        className="profile-icon"
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div className="user-dropdown">
          <Link to="/profile-orders">
            <img src={Shop} alt="" className="proficon" />
            سفارش‌ها
          </Link>
          <hr />
          <Link to="/profile-favorites">
            <img src={favorite} alt="" className="proficon" />
            علاقه‌مندی‌ها
          </Link>
          <hr />
          <Link to="/profile-edit">
            <img src={profileIcon} alt="" className="proficon" />
            اطلاعات کاربری
          </Link>
          <hr />
          <div onClick={handleLogoutClick} className="logout">
            <img src={exit} alt="" className="proficon" />
            خروج از حساب کاربری
          </div>
        </div>
      )}

      {isModalOpen && (
        <LogoutModal
          onConfirm={handleConfirmLogout}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default UserMenu;