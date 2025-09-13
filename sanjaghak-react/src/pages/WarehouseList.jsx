import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/WarehouseList.css";
import edit from "../assets/edit.png";
import notif from "../assets/notification.png";

const ITEMS_PER_PAGE = 5;

function WarehouseList() {
  const [warehouses, setWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8080/api/Sanjaghak/warehouse/getAllWarehouse?page=0&size=20", {
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
        if (!res.ok) throw new Error("خطا در دریافت اطلاعات انبارها");
        const data = await res.json();

        const mapped = data.map((w) => ({
          id: w.warehouseId,
          name: w.name,
          country: w.country,
          province: w.state, 
          city: w.city,
          address: w.address,
          postalCode: w.postalCode,
          phone: w.phone,
          active: w.isActive, 
        }));

        setWarehouses(mapped);
      } catch (err) {
        console.error(err);
        setError("مشکلی در دریافت انبارها پیش آمد.");
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  const filteredWarehouses = useMemo(() => {
    return warehouses.filter(
      (w) =>
        w.name.includes(searchTerm) ||
        w.country.includes(searchTerm) ||
        w.province.includes(searchTerm) ||
        w.city.includes(searchTerm) ||
        w.phone.includes(searchTerm)
    );
  }, [searchTerm, warehouses]);

  const paginatedWarehouses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWarehouses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredWarehouses, currentPage]);

  const totalPages = Math.ceil(filteredWarehouses.length / ITEMS_PER_PAGE);

  const handleToggleActive = (id) => {
    setWarehouses((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  };

  const handleEdit = (id) => navigate(`/admin/ویرایش-انبار/${id}`);
  const handleAdd = () => navigate("/admin/افزودن-انبار");

  if (loading) return <p className="loading-text">در حال بارگذاری...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="warehouse-list-container">
      <div style={{ position: "relative", display: "flex", alignItems: "center",  justifyContent: "center"}}>
      <input
        type="text"
        placeholder="جستجو..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="supplier-search"
      />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: "space-between",
          width: '100%',
          direction: 'rtl',
          padding: '10px 0px',
          marginTop: "30px"
        }}
        >
      <h2 className="adminliststitle">لیست انبارها</h2>
        <button onClick={handleAdd} className="add-warehouse-button">
          + افزودن انبار
        </button>
      </div>

      <div className="warehouse-cards">
        <div className="warehouse-titles">
          <h5>نام انبار</h5>
          <h5>آدرس</h5>
          <h5>وضعیت</h5>
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
              style={{marginBottom: "20px"}}
              onClick={() => navigate(`/admin/انبار/${warehouse.id}`)}
            >
              <h3>{warehouse.name}</h3>
              <div className="info-line">
                <span>
                  {warehouse.country} - {warehouse.province} - {warehouse.city} -{" "}
                  {warehouse.address}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  className={warehouse.active ? "status-active" : "status-inactive"}
                  title={warehouse.active ? "فعال" : "غیرفعال"}
                >
                  {warehouse.active ? "فعال" : "غیرفعال"}
                </span>
              </div>
              <div className="info-line">{warehouse.postalCode}</div>
              <div className="info-line">{warehouse.phone}</div>

<div className="card-buttons" onClick={(e) => e.stopPropagation()} style={{display: "flex"}}>
  <button onClick={() => handleEdit(warehouse.id)} className="admin-edit-button">
                  <img src={edit} alt="ویرایش" />
  </button>
  {/* <button
    onClick={() => handleToggleActive(warehouse.id)}
    className={warehouse.active ? "deactivate-button" : "activate-button"}
  >
    {warehouse.active ? "غیرفعال کردن" : "فعال کردن"}
  </button> */}
  <button
      className="notifications-buttonnotif"
    onClick={() => {
      navigate("/admin/انتقال-بین-انبار", {
        state: { sourceWarehouseName: warehouse.name },
      });
    }}
  >
    ⇅
  </button>
  <button
    onClick={(e) => {
      e.stopPropagation(); 
      navigate(`/admin/اعلانات-انبار/${warehouse.id}`);
    }}
    className="notifications-buttonnotif"
  >
                  <img src={notif} alt="اعلانات" />
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


    </div>
  );
}

export default WarehouseList;