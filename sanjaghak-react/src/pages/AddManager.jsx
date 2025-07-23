import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/addmanager.css";

function AddEmployee() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    role: "staff",
  });

  const token = localStorage.getItem("token");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8080/api/Sanjaghak/UserAccount/adminRegistration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("کارمند با موفقیت ثبت شد!");
        navigate("/admin/لیست کارکنان");
      } else {
        alert(data.error || "خطایی رخ داده است");
      }
    } catch (error) {
      alert("مشکل در ارتباط با سرور");
      console.error(error);
    }
  };

  return (
    <>
      <button
        className="backButtonadmin"
        onClick={() => navigate("/admin/لیست کارکنان")}
      >
        بازگشت
      </button>

      <h1 className="addManagerTitle">افزودن کارمند</h1>

      <form className="addManagerBox" onSubmit={handleSubmit}>
        <div className="addmanager-inputWrapper">
          <input
            type="text"
            required
            className="addmanagerInput"
            placeholder=" "
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
          <label className="addmanager-floatingLabel">نام</label>
        </div>

        <div className="addmanager-inputWrapper">
          <input
            type="text"
            required
            className="addmanagerInput"
            placeholder=" "
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
          <label className="addmanager-floatingLabel">نام خانوادگی</label>
        </div>

        <div className="addmanager-inputWrapper">
          <input
            type="tel"
            required
            pattern="^09\d{9}$"
            inputMode="numeric"
            className="addmanagerInput"
            placeholder=" "
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
          />
          <label className="addmanager-floatingLabel">شماره موبایل</label>
        </div>

        <div className="addmanager-inputWrapper">
          <input
            type="email"
            required
            className="addmanagerInput"
            placeholder=" "
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <label className="addmanager-floatingLabel">ایمیل</label>
        </div>

        <div className="addmanager-inputWrapper">
          <select
            required
            className="addmanagerInput"
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
          >
            <option value="staff">انباردار</option>
            <option value="manager">مدیر</option>
            <option value="admin">ادمین</option>
          </select>
          <label className="addmanager-floatingLabel">نقش</label>
        </div>

        <button className="addmanagerButton" type="submit">
          ثبت نام
        </button>
      </form>
    </>
  );
}

export default AddEmployee;