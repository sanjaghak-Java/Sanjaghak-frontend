import React, { useState } from "react";

function AdminEmployeeDetail({ employee, onBack, onUpdateEmployee }) {
  const [editedEmployee, setEditedEmployee] = useState(employee);
  const token = localStorage.getItem("token");

  const handleChange = (field, value) => {
    setEditedEmployee((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // Prepare data to send exactly like backend expects
      const payload = {
        firstName: editedEmployee.name,
        lastName: editedEmployee.surname,
        role: editedEmployee.role,
        active: editedEmployee.isActive === true || editedEmployee.isActive === "active", // normalize boolean
        email: editedEmployee.email,
        phoneNumber: editedEmployee.phone,
      };

      const response = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/UserAccount/updateUsers/${editedEmployee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("خطا در بروزرسانی کارمند");
      }

      // Optionally get updated employee from response (if your API returns it)
      // const updatedEmployee = await response.json();

      // Call the callback to update parent state
      if (onUpdateEmployee) onUpdateEmployee(editedEmployee);

      // Go back to employee list
      onBack();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className="adminProductDetailContainer"
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: 20,
        backgroundColor: "#fff",
        border: "2px solid #d54343",
        borderRadius: 16,
        boxShadow: "0 6px 14px rgba(213, 67, 67, 0.15)",
        direction: "rtl",
        color: "#333",
        position: "relative",
        zIndex: 1000,
      }}
    >
      <button
        className="adminBackButton"
        onClick={onBack}
        style={{ marginBottom: 20 }}
      >
        بازگشت به لیست
      </button>

      <h1 className="adminProductDetail__name">ویرایش کارمند</h1>

      <img
        src={editedEmployee.profilePic}
        alt={`${editedEmployee.name} ${editedEmployee.surname}`}
        className="adminProductDetail__image"
        style={{ width: "100%", maxWidth: 400, borderRadius: 16, marginBottom: 20 }}
      />

      <div
        className="adminProductDetail__fields"
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <label className="adminProductDetail__info">نام:</label>
        <input
          type="text"
          value={editedEmployee.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">نام خانوادگی:</label>
        <input
          type="text"
          value={editedEmployee.surname}
          onChange={(e) => handleChange("surname", e.target.value)}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">ایمیل:</label>
        <input
          type="email"
          value={editedEmployee.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">شماره تلفن:</label>
        <input
          type="text"
          value={editedEmployee.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">نقش:</label>
        <select
          value={editedEmployee.role}
          onChange={(e) => handleChange("role", e.target.value)}
          className="adminProductDetail__input"
        >
          <option value="انباردار">انباردار</option>
          <option value="مدیر">مدیر</option>
        </select>

        {/* Date joined removed */}

        <label className="adminProductDetail__info">وضعیت:</label>
        <select
          value={editedEmployee.isActive ? "active" : "inactive"}
          onChange={(e) => handleChange("isActive", e.target.value === "active")}
          className="adminProductDetail__input"
        >
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
        </select>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <button
          onClick={handleSave}
          className="adminSaveButton"
          style={{
            padding: "12px 24px",
            backgroundColor: "#d54343",
            color: "white",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          ذخیره تغییرات
        </button>
      </div>
    </div>
  );
}

export default AdminEmployeeDetail;