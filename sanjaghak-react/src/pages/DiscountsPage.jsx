import React, { useState, useEffect } from "react";
import jalaali from "jalaali-js";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import "/src/styles/DiscountsPage.css";
import bin from "../assets/bin.png";
import ModalConfirm from "./ModalConfirm";
import DiscountCreateModal from "./DiscountCreateModal";
import DiscountDetailsModal from "./DiscountDetailsModal";

function toComparableNumber(shamsiDate) {
  if (!shamsiDate || typeof shamsiDate !== "string") return 0; 
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

function getTodayShamsi() {
  const now = new Date();
  const { jy, jm, jd } = jalaali.toJalaali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );
  return `${jy}/${jm.toString().padStart(2, "0")}/${jd.toString().padStart(2, "0")}`;
}

const today = getTodayShamsi();
function isoFromJalali(shamsiDate) {
  if (!shamsiDate) return "";
  const [jy, jm, jd] = shamsiDate.split("/").map(Number);
  const g = jalaali.toGregorian(jy, jm, jd);
  const isoString = new Date(g.gy, g.gm - 1, g.gd, 23, 59, 59).toISOString(); 
  return isoString;
}

function DiscountsPage() {
  console.log(localStorage.getItem("token"));
  const [discounts, setDiscounts] = useState([]);
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
  function jalaliFromISO(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  const { jy, jm, jd } = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${jy}/${jm.toString().padStart(2, "0")}/${jd.toString().padStart(2, "0")}`;
}
const handleSaveDiscount = async (updatedDiscount) => {
  try {
    const token = localStorage.getItem("token");
    const discountId = updatedDiscount.id;
    const variantId = updatedDiscount.variantId;



    const body = {
      discountDescription: updatedDiscount.title,
      startFrom: isoFromJalali(updatedDiscount.startDate),
      endFrom: isoFromJalali(updatedDiscount.endDate),
      discountPercentage: updatedDiscount.amount,
    };

    const response = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/discount/${discountId}?variantId=${variantId}`,
      {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error("خطا در ذخیره تخفیف");
    }

    setDiscounts((prev) =>
      prev.map((d) => (d.id === updatedDiscount.id ? updatedDiscount : d))
    );
    alert("تخفیف با موفقیت به‌روزرسانی شد");
  } catch (error) {
    console.error(error);

  }
};
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await fetch(
          "http://127.0.0.1:8080/api/Sanjaghak/discount/getAllDiscount",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        if (!response.ok) {
          throw new Error("خطا در دریافت تخفیف‌ها");
        }

        const data = await response.json();
        const mappedDiscounts = data.map((d) => ({
          id: d.discountId,
          variantId: d.variantsId?.variantId, 
          productName: d.productName || "نامشخص", 
          title: d.discountDescription || "",
          active: d.active,
          startDate: jalaliFromISO(d.startFrom), 
          endDate: jalaliFromISO(d.endFrom),
          amount: d.discountPercentage,
        }));

        setDiscounts(mappedDiscounts);
      } catch (error) {
        console.error(error);
        alert("خطا در بارگذاری تخفیف‌ها");
      }
    };

    fetchDiscounts();
  }, []);


  function jalaliFromISO(isoDate) {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    const { jy, jm, jd } = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    return `${jy}/${jm.toString().padStart(2, "0")}/${jd.toString().padStart(2, "0")}`;
  }

  const selectedTitle = discounts.find((d) => d.id === selectedId)?.title || "";


  const ongoingDiscounts = discounts.filter((d) => {
    console.log("Discounts loaded:", discounts);
discounts.forEach((d) => {
  console.log(
    `Discount: ${d.title} active=${d.active} startDate=${d.startDate} endDate=${d.endDate}`
  );
});
console.log("Today (comparable number):", toComparableNumber(today));
    if (!d.active) return false;
    const todayNum = toComparableNumber(today);
    const startNum = toComparableNumber(d.startDate);
    const endNum = toComparableNumber(d.endDate);
    return todayNum >= startNum && todayNum <= endNum;
  });

const filteredDiscounts = discounts.filter((d) => {
  if (filterStatus === "active" && !d.active) return false;
  if (filterStatus === "inactive" && d.active) return false;
  if (!d.title || !d.title.includes(searchText)) return false;
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
          <DiscountCreateModal onClose={handleCloseCreateModal} onSubmit={handleCreateDiscount} />
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
              id="swiper-slide"
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
          <h2 className="adminliststitle">لیست تخفیف‌ها</h2>
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

          <div className="gooto-page-box">
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
  <DiscountDetailsModal
    discount={selectedDiscount}
    onClose={handleCloseDetailsModal}
    onSave={handleSaveDiscount}
  />
)}
      </div>
    </div>
  );
}

export default DiscountsPage;