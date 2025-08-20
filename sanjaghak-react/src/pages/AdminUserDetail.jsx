
import React, { useState } from "react";

function AdminUserDetail({ user, onBack, onUpdateUser }) {
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    surname: user.surname,
    phone: user.phone,
    email: user.email,
    isActive: user.isActive,
    profilePic: user.profilePic,
    id: user.id,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      // Prepare payload using new values if provided, else fallback to original user values
      const payload = {
        id: editedUser.id,
        firstName: editedUser.name.trim() === "" ? user.name : editedUser.name,
        lastName: editedUser.surname.trim() === "" ? user.surname : editedUser.surname,
        role: user.role || "customer", // keep original role
        active: editedUser.isActive,
        email: editedUser.email.trim() === "" ? user.email || "" : editedUser.email,
        phoneNumber:
          editedUser.phone.trim() === "" ? user.phone || "" : editedUser.phone,
      };

      const response = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/UserAccount/updateUsers/${editedUser.id}`,
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
        throw new Error("خطا در به‌روزرسانی اطلاعات کاربر");
      }

      const updatedUserBackend = await response.json();

      const updatedUserFrontend = {
        id: updatedUserBackend.id,
        profilePic: updatedUserBackend.profilePic || "/src/assets/testimage.jpg",
        name: updatedUserBackend.firstName || "",
        surname: updatedUserBackend.lastName || "",
        phone: updatedUserBackend.phoneNumber || "",
        email: updatedUserBackend.email || "",
        isActive: updatedUserBackend.active,
        role: updatedUserBackend.role,
        dateJoined: updatedUserBackend.created_at
          ? new Date(updatedUserBackend.created_at).toLocaleDateString("fa-IR")
          : "نامشخص",
      };

      if (onUpdateUser) onUpdateUser(updatedUserFrontend);
      onBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="supplier-container">
      <h1 className="adminProductDetail__name">ویرایش کاربر</h1>

      <div className="adminProductDetailContainer">
        <div style={{ display: "flex", alignItems: "center", gap: "5px", width: "100%", direction: "ltr" }}>
          <label className="switch">
            <input
              type="checkbox"
              checked={editedUser.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              disabled={loading}
            />
            <span className="slider"></span>
          </label>
          <span>{editedUser.isActive ? "فعال" : "غیرفعال"}</span>
        </div>
        <img
          src={editedUser.profilePic}
          alt={`${user.name} ${user.surname}`}
          style={{ width: "100px", marginBottom: 20 }}
        />

        <div
          className="adminProductDetail__fields"
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <div style={{display: "flex", gap: "35px"}}>
            <div style={{width: "100%", display: "flex", flexDirection: "column", gap: "15px"}}>
              <label className="adminProductDetail__info">نام:</label>
              <input
                type="text"
                value={editedUser.name}
                placeholder={user.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="adminProductDetail__input"
                disabled={loading}
              />
            </div>
            <div style={{width: "100%", display: "flex", flexDirection: "column", gap: "15px"}}>
              <label className="adminProductDetail__info">نام خانوادگی:</label>
              <input
                type="text"
                value={editedUser.surname}
                placeholder={user.surname}
                onChange={(e) => handleChange("surname", e.target.value)}
                className="adminProductDetail__input"
                disabled={loading}
              />
            </div>
          </div>

          <div style={{display: "flex", gap: "35px"}}>
            <div style={{width: "100%", display: "flex", flexDirection: "column", gap: "15px"}}>
              <label className="adminProductDetail__info">شماره تلفن:</label>
              <input
                type="text"
                value={editedUser.phone}
                placeholder={user.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="adminProductDetail__input"
                disabled={loading}
              />
            </div>
            <div style={{width: "100%", display: "flex", flexDirection: "column", gap: "15px"}}>
              <label className="adminProductDetail__info">ایمیل:</label>
              <input
                type="email"
                value={editedUser.email}
                placeholder={user.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className="adminProductDetail__input"
                disabled={loading}
              />
            </div>
          </div>

        </div>

        {error && (
          <p style={{ color: "red", marginTop: 10, fontWeight: "bold" }}>{error}</p>
        )}

        <div className="modal-buttons">
          <button
            className="modal-button gray"
            onClick={onBack}
            // style={{ marginBottom: 20 }}
            disabled={loading}
          >
            ➔ بازگشت
          </button>
          <button
            onClick={handleSave}
            className="modal-button"
            disabled={loading}
          >
            {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </div>
      </div>
  </div>
  );
}

export default AdminUserDetail;