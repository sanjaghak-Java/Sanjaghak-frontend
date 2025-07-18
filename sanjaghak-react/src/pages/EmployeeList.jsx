import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import AdminEmployeeDetail from "./AdminEmployeeDetail"; // Adjust path if needed
import "/src/styles/employeelist.css";

const initialEmployees = [
  { id: 1, profilePic: "/src/assets/testimage.jpg", name: "علی", surname: "علیپور", phone: "09148325892", role: "مدیر", isActive: true, dateJoined: "1403/1/1" },
  { id: 2, profilePic: "/src/assets/testimage.jpg", name: "جواد", surname: "جوادیزاده", phone: "09148325891", role: "پشتیبانی", isActive: false, dateJoined: "1403/2/10" },
  { id: 3, profilePic: "/src/assets/testimage.jpg", name: "محمد", surname: "محمدی", phone: "09148325893", role: "فروشنده", isActive: true, dateJoined: "1403/3/5" },
  { id: 4, profilePic: "/src/assets/testimage.jpg", name: "سارا", surname: "سارایی", phone: "09148325894", role: "پشتیبانی", isActive: false, dateJoined: "1403/4/15" },
  { id: 5, profilePic: "/src/assets/testimage.jpg", name: "مهدی", surname: "مهدی‌پور", phone: "09148325895", role: "مدیر", isActive: true, dateJoined: "1403/5/20" },
];

// Helper: parse Persian date string like "1403/1/1" to JS timestamp
function parsePersianDateToTimestamp(dateStr) {
  const [year, month, day] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
}

// Helper: convert timestamp back to Persian date string
function timestampToPersianDate(ts) {
  const d = new Date(ts);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}/${month}/${day}`;
}

function EmployeeList() {
  const navigate = useNavigate();

  // Core states
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchText, setSearchText] = useState("");
  const [searchMode, setSearchMode] = useState("name");
  const [searchModeDropdownOpen, setSearchModeDropdownOpen] = useState(false);
  const searchModeRef = useRef(null);

  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const filterRef = useRef(null);

  // Date range for slider filtering
  const datesTimestamps = employees.map((e) => parsePersianDateToTimestamp(e.dateJoined));
  const minDate = Math.min(...datesTimestamps);
  const maxDate = Math.max(...datesTimestamps);
  const [dateRange, setDateRange] = useState([minDate, maxDate]);

  // Filters
  const [activeFilter, setActiveFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;

  // For jump to page input
  const [jumpPageInput, setJumpPageInput] = useState("");

  // Selected employee for detail edit
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchModeRef.current && !searchModeRef.current.contains(event.target)) setSearchModeDropdownOpen(false);
      if (filterRef.current && !filterRef.current.contains(event.target)) setFilterDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter employees according to all filters/search
  const filteredEmployees = employees.filter((employee) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      searchMode === "name"
        ? employee.name.toLowerCase().includes(search)
        : employee.id.toString() === search;

    const employeeDateTs = parsePersianDateToTimestamp(employee.dateJoined);
    const matchesDate = employeeDateTs >= dateRange[0] && employeeDateTs <= dateRange[1];

    const matchesActive =
      activeFilter === "all"
        ? true
        : activeFilter === "active"
        ? employee.isActive
        : !employee.isActive;

    const matchesRole = roleFilter === "all" ? true : employee.role === roleFilter;

    return matchesSearch && matchesDate && matchesActive && matchesRole;
  });

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  // Employees to display on current page
  const displayedEmployees = filteredEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  // Toggle active state
  const toggleActive = (id) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isActive: !e.isActive } : e))
    );
  };

  // Jump to page handler
  const handleJumpPage = () => {
    const pageNum = Number(jumpPageInput);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setJumpPageInput("");
    }
  };

  // Update employee details from detail view
  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e))
    );
  };

  // If an employee is selected, show the edit detail view
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
    <>
      <h1 className="pageTitle">لیست کارمندان</h1>

      <div className="userListControls">
        <button
          className="adminProductList__filterButton"
          onClick={() => navigate("/admin/افزودن کارمند")}
        >
          افزودن کارمند
        </button>

        <div className="searchInputContainer" ref={searchModeRef}>
          <button
            onClick={() => setSearchModeDropdownOpen((prev) => !prev)}
            className="searchModeToggleBtn"
          >
            ▼
          </button>
          <input
            type="text"
            placeholder={searchMode === "name" ? "جستجو بر اساس نام" : "جستجو بر اساس شناسه"}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="userListSearchInput"
          />
          {searchModeDropdownOpen && (
            <div className="searchModeDropdown">
              <div
                className={`searchModeOption ${searchMode === "name" ? "selected" : ""}`}
                onClick={() => {
                  setSearchMode("name");
                  setSearchModeDropdownOpen(false);
                  setSearchText("");
                }}
              >
                جستجو بر اساس نام
              </div>
              <div
                className={`searchModeOption ${searchMode === "id" ? "selected" : ""}`}
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
        </div>

        <div className="filterContainer" ref={filterRef}>
          <button
            className={`filterButton ${filterDropdownOpen ? "active" : ""}`}
            onClick={() => setFilterDropdownOpen((prev) => !prev)}
          >
            فیلتر
          </button>
          {filterDropdownOpen && (
            <div className="filterDropdown">
              <div>
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
              </div>

              <div>
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
                  <option value="انباردار">انباردار</option>
                  <option value="مدیر">مدیر</option>
                </select>
              </div>

              <div>
                <p className="dateRangeLabel">
                  بازه تاریخ عضویت: {timestampToPersianDate(dateRange[0])} - {timestampToPersianDate(dateRange[1])}
                </p>
                <Slider
                  range
                  min={minDate}
                  max={maxDate}
                  value={dateRange}
                  onChange={setDateRange}
                  trackStyle={[{ backgroundColor: "#d54343" }]}
                  handleStyle={[{ borderColor: "#d54343" }, { borderColor: "#d54343" }]}
                  railStyle={{ backgroundColor: "#e0b1b1" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="userListContainer">
        <table className="userTable">
          <thead>
            <tr>
              <th>شناسه</th>
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
                <tr key={e.id} className={e.isActive ? "activeUser" : "inactiveUser"}>
                  <td>{e.id}</td>
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
                  <td>{e.role}</td>
                  <td>{e.isActive ? "فعال" : "غیرفعال"}</td>
                  <td>{e.dateJoined}</td>
                  <td>
                    <button
                      className="toggleActiveBtn"
                      onClick={() => toggleActive(e.id)}
                    >
                      {e.isActive ? "غیرفعال کردن" : "فعال کردن"}
                    </button>
                    <button
                      className="editUserBtn"
                      onClick={() => setSelectedEmployee(e)}
                      style={{
                        marginRight: 8,
                        padding: "6px 12px",
                        borderRadius: 8,
                        backgroundColor: "#d54343",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      ویرایش
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="noUserFound">
                  کارمندی پیدا نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
              className={`adminProductList__paginationButton${currentPage === pageNum ? " active" : ""}`}
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
    </>
  );
}

export default EmployeeList;