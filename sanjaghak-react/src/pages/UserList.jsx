import React, { useState, useEffect, useRef } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "/src/styles/userList.css";

import AdminUserDetail from "./AdminUserDetail";

function timestampToPersianDate(ts) {
  if (!ts) return "نامشخص";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "نامشخص";
  return d.toLocaleDateString("fa-IR");
}

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [searchMode, setSearchMode] = useState("name");
  const [searchModeDropdownOpen, setSearchModeDropdownOpen] = useState(false);
  const searchModeRef = useRef(null);

  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const filterRef = useRef(null);

  const usersPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const [dateRange, setDateRange] = useState([0, Date.now()]);
  const [activeFilter, setActiveFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [jumpPageInput, setJumpPageInput] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/UserAccount/getPaginationUser?role=customer`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت کاربران");
        return res.json();
      })
      .then((data) => {
        const mappedUsers = data.content.map((u) => {
          const timestamp = u.createdAt ? new Date(u.createdAt).getTime() : null;
          return {
            id: u.id,
            profilePic: u.profilePic || "/src/assets/testimage.jpg",
            name: u.firstName || "",
            surname: u.lastName || "",
            phone: u.phoneNumber || "",
            email: u.email || "",
            isActive: u.active,
            isoDateJoined: timestamp,
          };
        });

        setUsers(mappedUsers);

        if (mappedUsers.length > 0) {
          const timestamps = mappedUsers.map((u) => u.isoDateJoined || 0);
          setDateRange([Math.min(...timestamps), Math.max(...timestamps)]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchModeRef.current &&
        !searchModeRef.current.contains(event.target)
      ) {
        setSearchModeDropdownOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredUsers = users.filter((user) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      searchMode === "name"
        ? user.name.toLowerCase().includes(search)
        : user.id.toString() === search;

    const userDateTs = user.isoDateJoined || 0;
    const matchesDate = userDateTs >= dateRange[0] && userDateTs <= dateRange[1];

    const matchesActive =
      activeFilter === "all"
        ? true
        : activeFilter === "active"
        ? user.isActive
        : !user.isActive;

    return matchesSearch && matchesDate && matchesActive;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const displayedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const toggleActive = async (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isActive: !user.isActive } : user
      )
    );

    try {
      const userToUpdate = users.find((user) => user.id === id);
      const updatedActive = !userToUpdate.isActive;

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
            firstName: userToUpdate.name,
            lastName: userToUpdate.surname,
            role: "customer",
            active: updatedActive,
            email: userToUpdate.email,
            phoneNumber: userToUpdate.phone,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("خطا در بروزرسانی وضعیت کاربر");
      }
    } catch (error) {
      alert(error.message);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, isActive: !user.isActive } : user
        )
      );
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleJumpPage = () => {
    const pageNum = Number(jumpPageInput);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setJumpPageInput("");
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setSelectedUser(null);
  };

  if (loading) return <p>در حال بارگذاری کاربران...</p>;

  if (selectedUser) {
    return (
      <AdminUserDetail
        user={selectedUser}
        onBack={() => setSelectedUser(null)}
        onUpdateUser={handleUpdateUser}
      />
    );
  }

  return (
    <>
      <h1 className="pageTitle">لیست کاربران</h1>

      <div className="userListControls">
        <div className="searchInputContainer" ref={searchModeRef}>
          <button
            onClick={() => setSearchModeDropdownOpen((prev) => !prev)}
            className="searchModeToggleBtn"
            aria-label="Toggle Search Mode"
            type="button"
          >
            ▼
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
            className="userListSearchInput"
          />

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
        </div>

        <div className="filterContainer" ref={filterRef}>
          <button
            onClick={() => setFilterDropdownOpen((prev) => !prev)}
            className={`filterButton ${filterDropdownOpen ? "active" : ""}`}
            type="button"
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

      <div className="userListContainer">
        <table className="userTable">
          <thead>
            <tr>
              <th></th>
              <th>نام</th>
              <th>نام خانوادگی</th>
              <th>شماره تلفن</th>
              <th>وضعیت</th>
              <th>تاریخ عضویت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.length > 0 ? (
              displayedUsers.map((user) => (
                <tr
                  key={user.id}
                  className={user.isActive ? "activeUser" : "inactiveUser"}
                >
                  <td>
                    <img
                      src={user.profilePic}
                      alt={`${user.name} ${user.surname}`}
                      className="profilePic"
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.surname}</td>
                  <td>{user.phone}</td>
                  <td>{user.isActive ? "فعال" : "غیرفعال"}</td>
                  <td>{timestampToPersianDate(user.isoDateJoined)}</td>
                  <td>
                    <button
                      className="toggleActiveBtn"
                      onClick={() => toggleActive(user.id)}
                    >
                      {user.isActive ? "غیرفعال کردن" : "فعال کردن"}
                    </button>
                    <button
                      className="editUserBtn"
                      onClick={() => setSelectedUser(user)}
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
                <td colSpan={7} className="noUserFound">
                  کاربری پیدا نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="adminProductList__pagination">
        <button
          className="adminProductList__paginationButton"
          onClick={() => handlePageChange(currentPage - 1)}
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
              onClick={() => handlePageChange(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          className="adminProductList__paginationButton"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleJumpPage();
            }
          }}
        />
        <button
          className="adminProductList__filterButton"
          onClick={handleJumpPage}
        >
          برو
        </button>
      </div>
    </>
  );
}

export default UserList;