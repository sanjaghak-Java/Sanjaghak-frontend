import React, { useState, useEffect, useRef } from "react";
import { FaCheckCircle, FaBan } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import AdminEmployeeDetail from "./AdminEmployeeDetail";
import "/src/styles/employeelist.css";
import edit from '../assets/edit.png';

function timestampToPersianDate(ts) {
  if (!ts) return "نامشخص";
  const d = new Date(ts);
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(d);
}
function getRoleLabel(role) {
  switch (role) {
    case "admin":
      return "ادمین";
    case "manager":
      return "مدیر";
    case "staff":
      return "انباردار";
    default:
      return "نامشخص";
  }
}

function EmployeeList() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [searchMode, setSearchMode] = useState("name");
  const [searchModeDropdownOpen, setSearchModeDropdownOpen] = useState(false);
  const searchModeRef = useRef(null);

  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const filterRef = useRef(null);

  const [dateRange, setDateRange] = useState([0, Date.now()]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  const [jumpPageInput, setJumpPageInput] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all users except customers
  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8080/api/Sanjaghak/UserAccount/getPaginationUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت کارمندان");
        return res.json();
      })
      .then((data) => {
        const filteredUsers = data.content.filter((u) => u.role !== "customer");

const mappedEmployees = filteredUsers.map((u) => ({
  id: u.id,
  profilePic: u.profilePic || "/src/assets/testimage.jpg",
  name: u.firstName || "",
  surname: u.lastName || "",
  phone: u.phoneNumber || "",
  email: u.email || "",          // <--- add this line
  role: u.role || "",
  isActive: u.active,
  dateJoinedTs: u.createdAt ? Date.parse(u.createdAt) : 0,
  dateJoinedStr: u.createdAt
    ? timestampToPersianDate(Date.parse(u.createdAt))
    : "نامشخص",
}));
        setEmployees(mappedEmployees);

        if (mappedEmployees.length > 0) {
          const timestamps = mappedEmployees.map((e) => e.dateJoinedTs || 0);
          setDateRange([Math.min(...timestamps), Math.max(...timestamps)]);
        } else {
          setDateRange([0, Date.now()]);
        }

        setLoading(false);
      })
      .catch((err) => {
        alert(err.message);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchModeRef.current && !searchModeRef.current.contains(event.target)) {
        setSearchModeDropdownOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEmployees = employees.filter((e) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      searchMode === "name"
        ? e.name.toLowerCase().includes(search)
        : e.id.toString() === search;

    const matchesDate = e.dateJoinedTs >= dateRange[0] && e.dateJoinedTs <= dateRange[1];

    const matchesActive =
      activeFilter === "all"
        ? true
        : activeFilter === "active"
        ? e.isActive
        : !e.isActive;

    const matchesRole = roleFilter === "all" ? true : e.role === roleFilter;

    return matchesSearch && matchesDate && matchesActive && matchesRole;
  });

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const displayedEmployees = filteredEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  const toggleActive = async (id) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isActive: !e.isActive } : e))
    );

    try {
      const employeeToUpdate = employees.find((e) => e.id === id);
      const updatedActive = !employeeToUpdate.isActive;

      const response = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/UserAccount/updateUsers/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id,
            firstName: employeeToUpdate.name,
            lastName: employeeToUpdate.surname,
            role: employeeToUpdate.role,
            active: updatedActive,
            email: employeeToUpdate.email,
            phoneNumber: employeeToUpdate.phone,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("خطا در بروزرسانی وضعیت کارمند");
      }
    } catch (error) {
      alert(error.message);
      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, isActive: !e.isActive } : e))
      );
    }
  };

  const handleJumpPage = () => {
    const pageNum = Number(jumpPageInput);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setJumpPageInput("");
    }
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e))
    );
    setSelectedEmployee(null);
  };

  if (loading) return <p>در حال بارگذاری کارمندان...</p>;

  if (selectedEmployee) {
    return (
      <AdminEmployeeDetail
        employee={selectedEmployee}
        onBack={() => setSelectedEmployee(null)}
        onUpdateEmployee={handleUpdateEmployee}
      />
    );
  }

  return (
    <div className="supplier-container">
      <div className="userListControls">
        <div className="searchInputContainer" ref={searchModeRef}>
          <div   style={{position: "relative", display: "flex", alignItems: "center",}}>
            <button
              onClick={() => setSearchModeDropdownOpen((prev) => !prev)}
              className="searchModeToggleBtn"
              aria-label="Toggle Search Mode"
              type="button"
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer"
              }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>

            <input
              type="text"
              placeholder={
                searchMode === "name"
                  ? "جستجو بر اساس نام"
                  : "جستجو بر اساس شناسه"
              }
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="supplier-search"
              style={{
                paddingLeft: "30px",
              }}
            />
          </div>

          {searchModeDropdownOpen && (
            <div className="searchModeDropdown">
              <div
                className={`searchModeOption ${
                  searchMode === "name" ? "selected" : ""
                }`}
                onClick={() => {
                  setSearchMode("name");
                  setSearchModeDropdownOpen(false);
                  setSearchText("");
                }}
              >
                جستجو بر اساس نام
              </div>
              <div
                className={`searchModeOption ${
                  searchMode === "id" ? "selected" : ""
                }`}
                onClick={() => {
                  setSearchMode("id");
                  setSearchModeDropdownOpen(false);
                  setSearchText("");
                }}
              >
                جستجو بر اساس شناسه
              </div>
            </div>
          )}
          <select
            id="activeFilter"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="discounts-select"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
          </select>
          <select
            id="roleFilter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="discounts-select"
          >
            <option value="all">همه نقش‌ها</option>
            <option value="admin">ادمین</option>
            <option value="manager">مدیر</option>
            <option value="staff">انباردار</option>
          </select>
        </div>

        <div className="filterContainer" ref={filterRef}>
          <button
            className={`filterButton ${filterDropdownOpen ? "active" : ""}`}
            onClick={() => setFilterDropdownOpen((prev) => !prev)}
            type="button"
          >
            بازه تاریخ
            <span style={{display: "flex", alignItems: "center"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </button>

          {filterDropdownOpen && (
            <div className="filterDropdown">
              {/* <div>
                <label htmlFor="activeFilter" className="filterLabel">
                  وضعیت فعال:
                </label>
                <select
                  id="activeFilter"
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="filterSelect"
                >
                  <option value="all">همه</option>
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                </select>
              </div> */}

              {/* <div>
                <label htmlFor="roleFilter" className="filterLabel">
                  نقش:
                </label>
                <select
                  id="roleFilter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="filterSelect"
                >
                   <option value="all">همه</option>
                  <option value="admin">ادمین</option>
                  <option value="manager">مدیر</option>
                  <option value="staff">انباردار</option>
                </select>
              </div> */}

              <div>
                <p className="dateRangeLabel">
                  بازه تاریخ عضویت: {timestampToPersianDate(dateRange[0])} -{" "}
                  {timestampToPersianDate(dateRange[1])}
                </p>
                <Slider
                  range
                  min={dateRange[0]}
                  max={dateRange[1]}
                  value={dateRange}
                  onChange={setDateRange}
                  trackStyle={[{ backgroundColor: "#d54343" }]}
                  handleStyle={[
                    { borderColor: "#d54343" },
                    { borderColor: "#d54343" },
                  ]}
                  railStyle={{ backgroundColor: "#e0b1b1" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: "space-between",
          width: '88%',
          direction: 'rtl',
          padding: '10px 0px',
          marginTop: "80px"
        }}
      >
        <h2 className="adminliststitle">لیست کارمندان</h2>
        <button
          className="add-warehouse-button"
          onClick={() => navigate("/admin/افزودن کارمند")}
        >
          + افزودن کارمند
        </button>
      </div>
        <table className="userTable">
          <thead>
            <tr>
              {/* ID column removed */}
              <th></th>
              <th>نام</th>
              <th>نام خانوادگی</th>
              <th>شماره تلفن</th>
              <th>نقش</th>
              <th>وضعیت</th>
              <th>تاریخ عضویت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {displayedEmployees.length > 0 ? (
              displayedEmployees.map((e) => (
                <tr
                  key={e.id}
                  className={e.isActive ? "activeUser" : "inactiveUser"}
                >
                  {/* ID column removed */}
                  <td>
                    <img
                      src={e.profilePic}
                      alt={`${e.name} ${e.surname}`}
                      className="profilePic"
                    />
                  </td>
                  <td>{e.name}</td>
                  <td>{e.surname}</td>
                  <td>{e.phone}</td>
                  <td>{getRoleLabel(e.role)}</td>
                  <td>
                    <span className={e.isActive ? "Status-Badge Active" : "Status-Badge Inactive"}>
                      {e.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td>{timestampToPersianDate(e.dateJoinedTs)}</td>
                  <td>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: "5px"}}>
                      <button
                        className="toggleActiveBtn"
                        onClick={() => toggleActive(e.id)}
                      >
                        <span className="status-icon">
                          {e.isActive 
                            ? <FaBan className="icon-ban" title="غیرفعال کردن" /> 
                            : <FaCheckCircle className="icon-check" title="فعال کردن"/>
                          }
                        </span>
                        {/* {e.isActive ? "غیرفعال کردن" : "فعال کردن"} */}
                      </button>

                      <button
                        className="editUserBtn , admin-edit-button "
                        onClick={() => setSelectedEmployee(e)}

                      >        
                        <img src={edit} alt="" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="noUserFound">
                  کارمندی پیدا نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>

      <div className="adminProductList__pagination">
        <button
          className="adminProductList__paginationButton"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          قبلی
        </button>
        {[...Array(totalPages)].map((_, idx) => {
          const pageNum = idx + 1;
          return (
            <button
              key={pageNum}
              className={`adminProductList__paginationButton${
                currentPage === pageNum ? " active" : ""
              }`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          className="adminProductList__paginationButton"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          بعدی
        </button>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={jumpPageInput}
          onChange={(e) => setJumpPageInput(e.target.value)}
          placeholder="شماره صفحه"
          className="adminProductList__jumpInput"
          onKeyDown={(e) => e.key === "Enter" && handleJumpPage()}
        />
        <button className="adminProductList__filterButton" onClick={handleJumpPage}>
          برو
        </button>
      </div>
    </div>
  );
}

export default EmployeeList;