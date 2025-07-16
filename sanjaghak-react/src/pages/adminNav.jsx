
import React from "react";
import { NavLink } from "react-router-dom";
import "/src/styles/adminNav.css";

function AdminNav() {
  const menuItems = [
    { label: "داشبورد", path: "/admin/داشبورد" },
    { label: "گزارش مالی", path: "/admin/گزارش مالی" },
    { label: "افزودن محصول", path: "/admin/افزودن محصول" },
    { label: "افزودن برند", path: "/admin/افزودن برند" },
    { label: "افزودن دسته", path: "/admin/افزودن دسته" },
    { label: "لیست کاربران", path: "/admin/لیست کاربران" },
    { label: "لیست محصولات", path: "/admin/لیست محصولات" },
    { label: "افزودن مدیر", path: "/admin/افزودن مدیر" },
    { label: "افزودن انباردار", path: "/admin/افزودن انباردار" },
  ];

  return (
    <div className="adminNavigationContainer">
      <div className="adminNavContent">
        <div className="adminLogoContainer">
          <img className="adminLogo" src="/src/assets/sanjaghak-logo.png" alt="Logo" />
        </div>

        <div className="adminItemContainer">
          {menuItems.map(({ label, path }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) => `adminItem ${isActive ? "adminActive" : ""}`}
              style={{ textDecoration: "none" }}
            >
              <img className="adminIcon" alt={`${label} icon`} />
              <h3 className="adminItemText">{label}</h3>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="adminLogOut" style={{ cursor: "pointer" }}>
        <img className="adminLogOutIcon" alt="Logout icon" />
        <h3 className="adminLogOutText">خروج از حساب</h3>
      </div>
    </div>
  );
}

export default AdminNav;