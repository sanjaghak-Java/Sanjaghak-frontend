
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFileInvoiceDollar,
  FaBoxOpen,
  FaUsers,
  FaWarehouse,
  FaUserShield,
  FaTags,
  FaListUl,
  FaSignOutAlt
} from "react-icons/fa";
import "/src/styles/adminNav.css";
import warehouseIcon from '../assets/icons8-warehouse-64.png';


function AdminNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    navigate('/signin');
  };

  const menuItems = [
    { label: "داشبورد", path: "/admin/داشبورد", icon: <FaTachometerAlt /> },
    { label: "گزارش مالی", path: "/admin/گزارش مالی", icon: <FaFileInvoiceDollar /> },
    { label: "افزودن محصول", path: "/admin/افزودن محصول", icon: <FaBoxOpen /> },
    { label: "لیست کاربران", path: "/admin/لیست کاربران", icon: <FaUsers /> },
    { label: "لیست محصولات", path: "/admin/لیست محصولات", icon: <FaWarehouse /> },
    { label: "لیست کارکنان", path: "/admin/لیست کارکنان", icon: <FaUserShield /> },
    { label: "لیست برند ها", path: "/admin/لیست برند ها", icon: <FaTags /> },
    { label: "لیست دسته ها", path: "/admin/لیست دسته ها", icon: <FaListUl /> },
    { label: "لیست انبار ها", path: "/admin/لیست انبار ها", icon: <img src={warehouseIcon} alt="Warehouse" className="nav-warehouse-icon" /> },
  ];

  return (
    <div className="adminNavigationContainer">
      <div className="adminNavContent">
        <div className="adminLogoContainer">
          <img
            className="adminLogo"
            src="/src/assets/sanjaghak-logo.png"
            alt="Logo"
          />
        </div>

        <div className="adminItemContainer">
          {menuItems.map(({ label, path, icon }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `adminItem ${isActive ? "adminActive" : ""}`
              }
              style={{ textDecoration: "none" }}
            >
              <span className="adminIcon">{icon}</span>
              <h3 className="adminItemText">{label}</h3>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="adminLogOut" style={{ cursor: "pointer" }} onClick={handleLogout}>
        <FaSignOutAlt className="adminLogOutIcon" />
        <h3 className="adminLogOutText">خروج از حساب</h3>
      </div>
    </div>
  );
}

export default AdminNav;