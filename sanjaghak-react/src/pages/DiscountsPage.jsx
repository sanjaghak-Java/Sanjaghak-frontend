import React, { useState } from "react";
import jalaali from "jalaali-js";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import "/src/styles/DiscountsPage.css";
import bin from "../assets/bin.png";
import ModalConfirm from "./ModalConfirm";
import DiscountCreateModal from "./DiscountCreateModal";
import DiscountDetailsModal from "./DiscountDetailsModal";


const initialDiscounts = [
  {
    id: 1,
    productName: "گوشی موبایل سامسونگ مدل A54",
    title: "تخفیف تابستانی",
    active: true,
    startDate: "1404/04/01",
    endDate: "1404/05/31",
    amount: 20,
  },
  {
    id: 2,
    productName: "گوشی موبایل سامسونگ مدل A54",
    title: "حراج پاییز",
    active: false,
    startDate: "1404/07/01",
    endDate: "1404/08/30",
    amount: 5,
  },
  {
    id: 3,
    productName: "گوشی موبایل سامسونگ مدل A54",
    title: "ویژه تعطیلات",
    active: false,
    startDate: "1404/01/15",
    endDate: "1404/02/15",
    amount: 15,
  },
  {
    id: 4,
    productName: "گوشی موبایل سامسونگ مدل A54",
    title: "تخفیف کاربران جدید",
    active: false,
    startDate: "1403/12/01",
    endDate: "1404/01/01",
    amount: 10,
  },
  {
    id: 5,
    productName: "گوشی موبایل سامسونگ مدل A54",
    title: "تخفیف تابستانی",
    active: true,
    startDate: "1404/04/01",
    endDate: "1404/05/31",
    amount: 20,
  },
];

function toComparableNumber(shamsiDate) {
  return Number(shamsiDate.replace(/\//g, ""));
}

function daysLeft(endDate, todayDate) {
  const [ey, em, ed] = endDate.split("/").map(Number);
  const [ty, tm, td] = todayDate.split("/").map(Number);
  const endG = jalaali.toGregorian(ey, em, ed);
  const todayG = jalaali.toGregorian(ty, tm, td);
  const endDateObj = new Date(endG.gy, endG.gm - 1, endG.gd);
  const todayDateObj = new Date(todayG.gy, todayG.gm - 1, todayG.gd);
  const diffTime = endDateObj - todayDateObj;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

const today = "1404/05/03";

function DiscountsPage() {
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const itemsPerPage = 4;

  const selectedTitle = discounts.find((d) => d.id === selectedId)?.title || "";

  const ongoingDiscounts = discounts.filter((d) => {
    if (!d.active) return false;
    const todayNum = toComparableNumber(today);
    const startNum = toComparableNumber(d.startDate);
    const endNum = toComparableNumber(d.endDate);
    return todayNum >= startNum && todayNum <= endNum;
  });

  const filteredDiscounts = discounts.filter((d) => {
    if (filterStatus === "active" && !d.active) return false;
    if (filterStatus === "inactive" && d.active) return false;
    if (!d.title.includes(searchText)) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredDiscounts.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDiscounts = filteredDiscounts.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (pageNum) => {
    if (totalPages === 0) return;
    const num = Math.max(1, Math.min(pageNum, totalPages));
    setCurrentPage(num);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    setDiscounts(discounts.filter((d) => d.id !== selectedId));
    setShowModal(false);
    setSelectedId(null);
    if ((currentPage - 1) * itemsPerPage >= filteredDiscounts.length - 1) {
      goToPage(currentPage - 1);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedId(null);
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateDiscount = (newDiscount) => {
    setDiscounts((prev) => {
      const updated = [newDiscount, ...prev];
      const newTotalPages = Math.ceil(updated.length / itemsPerPage);
      setCurrentPage(1);
      return updated;
    });
  };

  const handleRowClick = (discount) => {
    setSelectedDiscount(discount);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedDiscount(null);
  };

  return (
    <div className="discount-page">
      <div className="discounts-container">
        {showModal && (
          <ModalConfirm
            message={`آیا از حذف "${selectedTitle}" اطمینان دارید؟`}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}

        {showCreateModal && (
          <DiscountCreateModal
            onClose={handleCloseCreateModal}
            onSubmit={handleCreateDiscount}
          />
        )}

        <div className="discounts-filters">
          <input
            type="text"
            className="discounts-search"
            placeholder="جستجو عنوان تخفیف..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="discounts-select"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">همه</option>
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
          </select>

        </div>
        {ongoingDiscounts.length > 0 && (
          <div className="ongoing-discounts-cards">
            <Swiper
              className="swiper-slide"
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              initialSlide={0}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                900: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
              }}
              dir="rtl"
            >
              {ongoingDiscounts.map((d) => {
                const daysRemaining = daysLeft(d.endDate, today);
                return (
                  <SwiperSlide key={d.id}>
                    <div className="discount-card">
                      <div className="active-badge">فعال</div>
                      <h4 className="card-title">{d.title}</h4>
                      <h6 className="card-title-name">{d.productName}</h6>
                      <p className="card-amount">%{d.amount}</p>
                      <p className="card-dates">
                        <span>از: {d.startDate}</span>
                        <span>تا: {d.endDate}</span>
                      </p>
                      <div className="days-left">{daysRemaining} روز مانده</div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "88%",
            direction: "rtl",
          }}
        >
          <h2>لیست تخفیف‌ها</h2>
          <button className="add-warehouse-button" onClick={handleOpenCreateModal}>
            +ایجاد کد تخفیف
          </button>
        </div>

        <table className="discounts-table">
          <thead>
            <tr>
              <th>عنوان</th>
              <th>از تاریخ</th>
              <th>تا تاریخ</th>
              <th>وضعیت</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedDiscounts.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>
                  موردی یافت نشد
                </td>
              </tr>
            )}
            {paginatedDiscounts.map((d) => (
              <tr
                key={d.id}
                className={`${d.active ? "active-row" : "inactive-row"}`}
                onClick={() => handleRowClick(d)}
                style={{ cursor: "pointer" }}
              >
                <td>{d.title}</td>
                <td>{d.startDate}</td>
                <td>{d.endDate}</td>
                <td>
                  <label className={`statuslabel ${d.active ? "active" : "inactive"}`}>
                    {d.active ? "فعال" : "غیرفعال"}
                  </label>
                </td>
                <td>
                  <button
                    className="admin-edit-button"
                    style={{ marginRight: "15px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(d.id);
                    }}
                  >
                    <img src={bin} alt="حذف" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            قبلی
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? "active-page" : ""}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            بعدی
          </button>

          <div className="goto-page-box">
            <input
              type="number"
              min="1"
              max={totalPages}
              placeholder="شماره صفحه..."
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
            />
            <button onClick={() => goToPage(Number(pageInput))}>برو</button>
          </div>
        </div>

        {showDetailsModal && (
          <DiscountDetailsModal discount={selectedDiscount} onClose={handleCloseDetailsModal} />
        )}
      </div>
    </div>

  );
}

export default DiscountsPage;
