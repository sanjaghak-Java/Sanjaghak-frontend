import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFileInvoiceDollar,
  FaBoxOpen,
  FaTags,
  FaListUl,
  FaUsers,
  FaWarehouse,
  FaStar,
  FaSortAmountDown,
  FaUserCheck,
  FaUserTimes,
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
  const [latestUser, setLatestUser] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);

  const totalRevenue = "123,456,789 تومان";
  const totalItemsSold = "8,765";
  const bestSeller = "محصول الف";
  const leastSeller = "محصول ب";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/api/Sanjaghak/UserAccount/getPaginationUser?page=0&size=1000&sort=createdAt,desc", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch user data");
          return;
        }

        const data = await response.json();
        const users = data.content || [];

        if (users.length > 0) setLatestUser(users[0]);

        setTotalUsers(users.length);
        const activeCount = users.filter(u => u.active === true).length;
        setActiveUsers(activeCount);
        setInactiveUsers(users.length - activeCount);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

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
            onKeyDown={(e) => e.key === "Enter" && navigate(path)}
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
          <h3>تعداد کل محصولات فروخته شده</h3>
          <p>{totalItemsSold}</p>
        </div>
      </div>

      <div className="adminDashboardStatsRow">
        <div className="adminDashboardCard halfWidth">
          <h3><FaStar style={{ marginLeft: "6px" }} /> پرفروش‌ترین محصول</h3>
          <img src="/src/assets/testimage.jpg" alt="پرفروش‌ترین محصول" className="productStatImage" />
          <p>{bestSeller}</p>
        </div>
        <div className="adminDashboardCard halfWidth">
          <h3><FaSortAmountDown style={{ marginLeft: "6px" }} /> کم‌فروش‌ترین محصول</h3>
          <img src="/src/assets/testimage.jpg" alt="کم‌فروش‌ترین محصول" className="productStatImage" />
          <p>{leastSeller}</p>
        </div>
      </div>

      <div className="adminDashboardStatsRow">
        <div className="adminDashboardCard thirdWidth">
          <h3><FaUsers style={{ marginLeft: "6px" }} /> تعداد کل کاربران</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="adminDashboardCard thirdWidth">
          <h3><FaUserCheck style={{ marginLeft: "6px" }} /> کاربران فعال</h3>
          <p>{activeUsers}</p>
        </div>
        <div className="adminDashboardCard thirdWidth">
          <h3><FaUserTimes style={{ marginLeft: "6px" }} /> کاربران غیرفعال</h3>
          <p>{inactiveUsers}</p>
        </div>
      </div>

      <h3 className="newusertitleadmin">جدیدترین کاربر</h3>
      <div className="adminDashboardCard fullWidth">
        {latestUser ? (
          <div className="adminDashboardRecentUserInfo">
            <img
              src={latestUser.profilePicture || "/src/assets/testimage.jpg"}
              alt={`${latestUser.firstName} ${latestUser.lastName}`}
              className="adminDashboardRecentUserPic"
            />
            <div>
              <p>{latestUser.firstName} {latestUser.lastName} - {latestUser.phoneNumber}</p>
              <p>ایمیل: {latestUser.email}</p>
              <p>وضعیت: {latestUser.active ? "فعال" : "غیرفعال"}</p>
            </div>
          </div>
        ) : (
          <p>در حال بارگذاری...</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;