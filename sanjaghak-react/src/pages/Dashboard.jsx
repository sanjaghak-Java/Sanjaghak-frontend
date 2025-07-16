import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFileInvoiceDollar,
  FaBoxOpen,
  FaTags,
  FaListUl,
  FaUsers,
  FaUserShield,
  FaWarehouse,
  FaUserPlus,
} from "react-icons/fa";
import "/src/styles/adminDashboard.css";

const menuItems = [
  { label: "گزارش مالی", icon: <FaFileInvoiceDollar />, path: "/admin/گزارش مالی" },
  { label: "افزودن محصول", icon: <FaBoxOpen />, path: "/admin/افزودن محصول" },
  { label: "افزودن برند", icon: <FaTags />, path: "/admin/افزودن برند" },
  { label: "افزودن دسته", icon: <FaListUl />, path: "/admin/افزودن دسته" },
  { label: "لیست کاربران", icon: <FaUsers />, path: "/admin/لیست کاربران" },
  { label: "لیست محصولات", icon: <FaWarehouse />, path: "/admin/لیست محصولات" }
];

function AdminDashboard() {
  const navigate = useNavigate();

  const latestUser = {
    profilePic: "/src/assets/testimage.jpg",
    name: "علی",
    surname: "علیپور",
    phone: "09148325892",
    dateJoined: "1403/1/1",
    isActive: true,
  };

  const totalRevenue = "123,456,789 تومان";
  const totalItemsSold = "8,765";

  return (
    <div className="adminDashboardRoot">
      <h1 className="adminDashboardWelcome">خوش آمدید</h1>

      <div className="adminDashboardMenuGrid">
        {menuItems.map(({ label, icon, path }) => (
          <div
            key={label}
            tabIndex={0}
            className="adminDashboardMenuCard"
            onClick={() => navigate(path)}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate(path);
            }}
            role="button"
            aria-label={label}
          >
            <div className="adminDashboardMenuIcon">{icon}</div>
            <div className="adminDashboardMenuLabel">{label}</div>
          </div>
        ))}
      </div>

      <div className="adminDashboardStatsRow">
        <div className="adminDashboardCard halfWidth">
          <h3>درآمد کل</h3>
          <p>{totalRevenue}</p>
        </div>

        <div className="adminDashboardCard halfWidth">
          <h3>تعدادکل محصولات فروخته شده</h3>
          <p>{totalItemsSold}</p>
        </div>
      </div>
        <h3 className="newusertitleadmin">جدیدترین کاربر</h3>
      <div className="adminDashboardCard fullWidth">

        <div className="adminDashboardRecentUserInfo">
          <img
            src={latestUser.profilePic}
            alt={`${latestUser.name} ${latestUser.surname}`}
            className="adminDashboardRecentUserPic"
          />
          <div>
            <p>
              {latestUser.name} {latestUser.surname} - {latestUser.phone}
            </p>
            <p>تاریخ عضویت: {latestUser.dateJoined}</p>
            <p>وضعیت: {latestUser.isActive ? "فعال" : "غیرفعال"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;