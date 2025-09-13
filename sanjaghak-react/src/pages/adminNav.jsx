import React, { useEffect, useState } from "react";
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
  FaSignOutAlt,
  FaHandshake,
  FaShieldAlt,
  FaShoppingCart,
  FaClipboardList 
} from "react-icons/fa";
import "/src/styles/adminNav.css";
import warehouseIcon from '../assets/icons8-warehouse-64.png';

function AdminNav() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    navigate('/signin');
  };

  // All possible menu items
  const allMenuItems = [
    { label: "داشبورد", path: "/admin/داشبورد", icon: <FaTachometerAlt /> },
    { label: "گزارش مالی", path: "/admin/گزارش مالی", icon: <FaFileInvoiceDollar /> },
    { label: "افزودن محصول", path: "/admin/افزودن محصول", icon: <FaBoxOpen /> },
    { label: "لیست کاربران", path: "/admin/لیست کاربران", icon: <FaUsers /> },
    { label: "لیست محصولات", path: "/admin/لیست محصولات", icon: <FaWarehouse /> },
    { label: "لیست کارکنان", path: "/admin/لیست کارکنان", icon: <FaUserShield /> },
    { label: "لیست برند ها", path: "/admin/لیست برند ها", icon: <FaShieldAlt /> },
    { label: "لیست دسته ها", path: "/admin/لیست دسته ها", icon: <FaListUl /> },
    { label: "لیست انبار ها", path: "/admin/لیست انبار ها", icon: <img src={warehouseIcon} alt="Warehouse" className="nav-warehouse-icon" /> },
    { label: "تأمین‌کنندگان", path: "/admin/تامین‌کنندگان", icon: <FaHandshake  /> },
    { label: "تخفیف ها", path: "/admin/تخفیف ها", icon: <FaTags /> },
    { label: "سفارش خرید", path: "/admin/سفارش خرید", icon: <FaShoppingCart /> },
    { label: "درخواست ها", path: "/admin/درخواست ها", icon: <FaClipboardList /> },
  ];

  // Filter menu items based on role
  let menuItems = [];
  if (role === "admin") {
    menuItems = allMenuItems;
  } else if (role === "manager") {
    // Manager sees everything except dashboard, user list, staff list, warehouse list
    menuItems = allMenuItems.filter(item =>
      !["داشبورد", "لیست کاربران", "لیست کارکنان", "لیست انبار ها"].includes(item.label)
    );
  } else if (role === "staff") {
    // Staff only sees warehouse list
    menuItems = allMenuItems.filter(item => item.label === "لیست انبار ها");
  }

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