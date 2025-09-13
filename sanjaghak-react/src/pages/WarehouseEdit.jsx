import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "/src/styles/EditWarehouse.css";

export default function EditWarehouse() {
  const { warehouseId } = useParams(); 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [isCentralWarehouse, setIsCentralWarehouse] = useState(false);
const { id } = useParams();

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/warehouse/${id}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("خطا در دریافت اطلاعات انبار");

        const data = await res.json();
        setWarehouse(data);


setName(data.name || "");
setAddress(data.address || "");
setCountry(data.country || "");
setProvince(data.state || ""); 
setCity(data.city || "");
setPostalCode(data.postalCode || "");
setPhone(data.phone || "");
setIsCentralWarehouse(data.isCentral || false);
      } catch (err) {
        console.error(err);
        setError("مشکلی در دریافت اطلاعات انبار پیش آمد.");
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouse();
  }, [warehouseId, token]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!warehouse) return;

  const updatedWarehouse = {
    name,
    address,
    city,
    state: province, 
    country,
    postalCode,
    phone,
    isCentral: isCentralWarehouse,
    isActive: true, 
  };

  try {
    const res = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/warehouse/${warehouse.warehouseId}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedWarehouse),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "خطا در بروزرسانی انبار");
    }

    alert("تغییرات با موفقیت ذخیره شد!");
    navigate("/admin/لیست%20انبار%20ها");
  } catch (err) {
    console.error(err);
    alert("مشکلی در ذخیره تغییرات پیش آمد.");
  }
};

  if (loading) return <p className="loading-text">در حال بارگذاری...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!warehouse) return <p className="error-text">انبار پیدا نشد.</p>;

  return (
    <div className="edit-warehouse-container">
      <h2>ویرایش انبار: {warehouse.name}</h2>
      <form onSubmit={handleSubmit} className="edit-warehouse-form">
        <label>نام انبار:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isCentralWarehouse}
            onChange={(e) => setIsCentralWarehouse(e.target.checked)}
          />
          تنظیم انبار مرکزی
        </label>

        <label>کشور:</label>
        <input value={country} onChange={(e) => setCountry(e.target.value)} required />

        <label>استان:</label>
        <input value={province} onChange={(e) => setProvince(e.target.value)} required />

        <label>شهر:</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} required />

        <label>آدرس:</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} required />

        <label>کد پستی:</label>
        <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />

        <label>شماره تماس:</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} required />

        <div className="form-buttons">
          <button type="submit" className="modal-button">ذخیره</button>
          <button type="button" onClick={() => navigate(-1)} className="modal-button gray">
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}