
import React, { useState } from "react";
import "/src/styles/adminNav.css";

function AdminNav({ activeItem, setActiveItem }) {
  const menuItems = [
    "داشبورد",
    "گزارش مالی",
    "افزودن محصول",
    "افزودن برند",
    "افزودن دسته",
    "لیست کاربران",
    "لیست محصولات",
    "افزودن مدیر",
    "افزودن انباردار",
  ];

  return (
    <div className="navigationContainer">
      <div className="navContent">
        <div className="logoContainer">
          <img className="logo" src="./src/assets/sanjaghak-logo.png" alt="Logo" />
        </div>

        <div className="itemContainer">
          {menuItems.map((item) => (
            <div
              key={item}
              className={`item ${activeItem === item ? "active" : ""}`}
              onClick={() => setActiveItem(item)}
              style={{ cursor: "pointer" }}
            >
              <img className="icon" alt={`${item} icon`} />
              <h3 className="itemText">{item}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="logOut">
        <img className="logOutIcon" alt="Logout icon" />
        <h3 className="logOutText">خروج از حساب</h3>
      </div>
    </div>
  );
}

export default AdminNav;