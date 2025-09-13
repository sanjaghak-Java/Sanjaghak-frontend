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
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
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

  const bestSeller = "محصول الف";
  const leastSeller = "محصول ب";
const [totalRevenue, setTotalRevenue] = useState(null);
const [totalItemsSold, setTotalItemsSold] = useState(null);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  const buildDateRange = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate(), 0, 0, 0);
    const endDate = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate(), 23, 59, 59);

    const startDateStr = startDate.toISOString().split(".")[0];
    const endDateStr = endDate.toISOString().split(".")[0];
    return { startDateStr, endDateStr };
  };

  const fetchRevenue = async () => {
    try {
      const { startDateStr, endDateStr } = buildDateRange();

      const response = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/report/calculate?startDate=${encodeURIComponent(
          startDateStr
        )}&endDate=${encodeURIComponent(endDateStr)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch revenue");
      const revenue = await response.json();
      setTotalRevenue(revenue);
    } catch (error) {
      console.error("Error fetching total revenue:", error);
    }
  };

  const fetchItemsSold = async () => {
    try {
      const { startDateStr, endDateStr } = buildDateRange();

      const response = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/report/received-purchase-quantity?startDate=${encodeURIComponent(
          startDateStr
        )}&endDate=${encodeURIComponent(endDateStr)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch items sold");
      const itemsSold = await response.json();
      setTotalItemsSold(itemsSold);
    } catch (error) {
      console.error("Error fetching total items sold:", error);
    }
  };

  fetchRevenue();
  fetchItemsSold();
}, []);
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
    <div className="supplier-container" style={{paddingTop: "0", marginTop:  "0"}}>
      <div className="adminDashboardRoot">
        <h1 className="adminDashboardWelcome">خوش آمدید!</h1>
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
        <div class="shiny-line"></div>
        <Swiper
          spaceBetween={80}
          slidesPerView={1}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          breakpoints={{
            768: { slidesPerView: 1 },
            1024: { slidesPerView: 1 },
          }}
          className="dashboardSwipers"
        >
          <SwiperSlide className="dashboardSlide">
            <div className="adminDashboardStatsRow">
              <div className="adminDashboardCard halfWidth">
                <h3>درآمد کل</h3>
                <p className="adminDashboardCardp">{totalRevenue}</p>
              </div>
              <div className="adminDashboardCard halfWidth">
                <h3>تعداد کالاهای تحویل گرفته شده:</h3>
                <p className="adminDashboardCardp">{totalItemsSold}</p>
              </div>
            </div>
          </SwiperSlide>


          <SwiperSlide className="dashboardSlide">
            <div className="adminDashboardStatsRow">
              <div className="adminDashboardCard oneThirdWidth">
                <h3><FaUsers style={{ marginLeft: "6px" }} /> تعداد کل کاربران</h3>
                <p className="adminDashboardCardp">{totalUsers}</p>
              </div>
              <div className="adminDashboardCard oneThirdWidth">
                <h3><FaUserCheck style={{ marginLeft: "6px" }} /> کاربران فعال</h3>
                <p className="adminDashboardCardp">{activeUsers}</p>
              </div>
              <div className="adminDashboardCard oneThirdWidth">
                <h3><FaUserTimes style={{ marginLeft: "6px" }} /> کاربران غیرفعال</h3>
                <p className="adminDashboardCardp">{inactiveUsers}</p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

        <div class="shiny-line"></div>

        <h3 className="newusertitleadmin">جدیدترین کاربر</h3>
        <div className="adminDashboardCard fullWidth">
          {latestUser ? (
            <div className="adminDashboardRecentUserInfo">
              <img
                src={latestUser.profilePicture || "/src/assets/testimage.jpg"}
                alt={`${latestUser.firstName} ${latestUser.lastName}`}
                className="adminDashboardRecentUserPic"
              />
              <div style={{display: "flex",gap: "55px", alignItems: "center", justifyContent: "center"}}>
                <p className="adminDashboardCardp">{latestUser.firstName} {latestUser.lastName}</p>
                <p className="adminDashboardCardp">{latestUser.phoneNumber}</p>
                <p className="adminDashboardCardp">{latestUser.email}</p>
                <p className={`adminDashboardRecentUserStatus ${latestUser.active ? "active" : "inactive"}`}>
                  {latestUser.active ? "فعال" : "غیرفعال"}
                </p>
              </div>
            </div>
          ) : (
            <p style={{fontFamily: "Vazirmatn"}}>در حال بارگذاری...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;