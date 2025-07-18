




import React, { useState } from "react";

function AdminUserDetail({ user, onBack, onUpdateUser }) {
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onUpdateUser) onUpdateUser(editedUser);
    onBack();
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

      <h1 className="adminProductDetail__name">ویرایش کاربر</h1>

      <img
        src={editedUser.profilePic}
        alt={`${editedUser.name} ${editedUser.surname}`}
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
          value={editedUser.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">نام خانوادگی:</label>
        <input
          type="text"
          value={editedUser.surname}
          onChange={(e) => handleChange("surname", e.target.value)}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">شماره تلفن:</label>
        <input
          type="text"
          value={editedUser.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="adminProductDetail__input"
        />

        {/* Added Email Field */}
        <label className="adminProductDetail__info">ایمیل:</label>
        <input
          type="email"
          value={editedUser.email || ""}
          onChange={(e) => handleChange("email", e.target.value)}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">تاریخ عضویت:</label>
        <input
          type="text"
          value={editedUser.dateJoined}
          onChange={(e) => handleChange("dateJoined", e.target.value)}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">وضعیت:</label>
        <select
          value={editedUser.isActive ? "active" : "inactive"}
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

export default AdminUserDetail;