import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/AddSupplier.css";

function AddSupplier() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: URL.createObjectURL(files[0]) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Supplier:", formData);
    navigate("/تامین‌کنندگان");
  };

  return (
    <div className="add-supplier-container">
      <h2>افزودن تأمین‌کننده جدید</h2>
        <form onSubmit={handleSubmit} className="add-supplier-form">
            <label>نام تأمین‌کننده:</label>
            <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            />

            <label>ایمیل:</label>
            <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            />

            <label>شماره تماس:</label>
            <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            />

            <label>آدرس:</label>
            <textarea
            rows="3"
            cols="40"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            />

            <button type="submit">ثبت تأمین‌کننده</button>
        </form>

    </div>
  );
}

export default AddSupplier;
