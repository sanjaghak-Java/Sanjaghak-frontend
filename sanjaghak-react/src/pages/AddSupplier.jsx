import React, { useState, useEffect } from "react";
import "/src/styles/AddSupplier.css";

function AddSupplier({ onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    province: "",
    city: "",
    address: "",
  });


  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        postalCode: initialData.postalCode || "",
        country: initialData.country || "",
        province: initialData.province || "",
        city: initialData.city || "",
        address: initialData.address || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        postalCode: "",
        country: "",
        province: "",
        city: "",
        address: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="supplier-modal-overlay">
      <div className="supplier-modal-content">
        <button
          onClick={onClose}
          className="modal-close-button"
          aria-label="بستن"
          type="button"
        >
          &times;
        </button>

        <h2>{initialData ? "ویرایش تأمین‌کننده" : "افزودن تأمین‌کننده جدید"}</h2>
        <br />

        <form onSubmit={handleSubmit} className="add-supplier-form">

          <div className="floating-label">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="name">نام تأمین‌کننده</label>
          </div>

          <div className="floating-label">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label htmlFor="email">ایمیل</label>
          </div>
          <div className="location-inputs">
            <div className="floating-label">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label htmlFor="phone">شماره تماس</label>
            </div>
            <div className="floating-label">
              <input
                type="tel"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label htmlFor="postalCode">کد پستی</label>
            </div>
          </div>

          <div className="location-inputs">
            <div className="floating-label">
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label htmlFor="country">کشور</label>
            </div>

            <div className="floating-label">
              <input
                type="text"
                id="province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label htmlFor="province">استان</label>
            </div>

            <div className="floating-label">
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label htmlFor="city">شهر</label>
            </div>
          </div>

          <div className="floating-label">
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder=" "
              rows="3"
              required
            />
            <label htmlFor="address" id="addsupplier-address-label">آدرس</label>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="admin-submit-button">
              {initialData ? "ویرایش" : "ثبت"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSupplier;
