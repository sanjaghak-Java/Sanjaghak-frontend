import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/WarehouseList.css";

const initialWarehouses = [
  { id: 1, name: "انبار مرکزی", country: "ایران", province: "تهران", city: "تهران", address: "خیابان انقلاب، پلاک ۱۲۳", postalCode: "12345", phone: "021-12345678" },
  { id: 2, name: "انبار غرب", country: "ایران", province: "البرز", city: "کرج", address: "میدان آزادگان، نبش خیابان سوم", postalCode: "23456", phone: "026-87654321" },
  { id: 3, name: "انبار جنوب", country: "ایران", province: "خوزستان", city: "اهواز", address: "خیابان کیانپارس، پلاک ۵۰", postalCode: "34567", phone: "061-33445566" },
];

const ITEMS_PER_PAGE = 5;

function WarehouseList() {
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const filteredWarehouses = useMemo(() => {
    return warehouses.filter((w) =>
      w.name.includes(searchTerm) ||
      w.country.includes(searchTerm) ||
      w.province.includes(searchTerm) ||
      w.city.includes(searchTerm) ||
      w.phone.includes(searchTerm) // اضافه کردن جستجو روی شماره تماس
    );
  }, [searchTerm, warehouses]);

  const paginatedWarehouses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWarehouses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredWarehouses, currentPage]);

  const totalPages = Math.ceil(filteredWarehouses.length / ITEMS_PER_PAGE);

  const handleDelete = (id) => {
    if (window.confirm("آیا از حذف این انبار مطمئن هستید؟")) {
      setWarehouses((prev) => prev.filter((w) => w.id !== id));
      if ((currentPage - 1) * ITEMS_PER_PAGE >= filteredWarehouses.length - 1) {
        setCurrentPage(Math.max(currentPage - 1, 1));
      }
    }
  };

  const handleEdit = (id) => navigate(`/admin/ویرایش-انبار/${id}`);
  const handleAdd = () => navigate("/admin/افزودن-انبار");

  return (
    <div className="warehouse-list-container">
      <h2 className="warehousetitle">لیست انبارها</h2>

      <input
        type="text"
        placeholder="جستجو..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="warehouse-search-input"
      />

      <div className="warehouse-cards">
        <div className="warehouse-titles">
          <h5>نام انبار</h5>
          <h5>آدرس</h5>
          <h5>کد پستی</h5>
          <h5>شماره تماس</h5> 
          <h5>عملیات</h5>
        </div>

        {paginatedWarehouses.length === 0 ? (
          <p className="no-results">موردی برای نمایش وجود ندارد.</p>
        ) : (
          paginatedWarehouses.map((warehouse) => (
            <div
              key={warehouse.id}
              className="warehouse-card"
              onClick={() => navigate(`/admin/انبار/${warehouse.id}`)}
            >
              <h3>{warehouse.name}</h3>
              <div className="info-line">
                <span>
                  {warehouse.country} - {warehouse.province} - {warehouse.city} - {warehouse.address}
                </span>
              </div>
              <div className="info-line">{warehouse.postalCode}</div>
              <div className="info-line">{warehouse.phone}</div> {/* شماره تماس نمایش داده می‌شود */}
              <div className="card-buttons" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => handleEdit(warehouse.id)} className="edit-button">ویرایش</button>
                <button onClick={() => handleDelete(warehouse.id)} className="delete-button">حذف</button>
                <button
                  onClick={() => {
                    navigate("/admin/انتقال-بین-انبار", { state: { sourceWarehouseName: warehouse.name } });
                  }}
                >
                  ⇅
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/اعلانات-انبار/${warehouse.id}`);
                  }}
                  className="notifications-button"
                >
                  اعلانات
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            قبلی
          </button>
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                className={page === currentPage ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            بعدی
          </button>
        </div>
      )}

      <div className="add-warehouse-button-container">
        <button onClick={handleAdd} className="add-warehouse-button">
          + افزودن انبار
        </button>
      </div>
    </div>
  );
}

export default WarehouseList;
