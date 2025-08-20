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
    <div className="supplier-container">
      <h1 className="adminProductDetail__name">ویرایش کارمند</h1>
      <div className="adminProductDetailContainer">
          <div style={{display: "flex", gap: "5px", width: "100%", direction: "ltr"}}>
            <span>{editedEmployee.isActive ? "فعال" : "غیرفعال"}</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={editedEmployee.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        {/* style={{
          maxWidth: 800,
          margin: "40px auto",
          padding: 20,
          backgroundColor: "#fff",
          borderRadius: 16,
          boxShadow: "0 6px 14px rgba(213, 67, 67, 0.15)",
          direction: "rtl",
          color: "#333",
          position: "relative",
          zIndex: 1000,
        }} */}
        <img
          src={editedEmployee.profilePic}
          alt={`${editedEmployee.name} ${editedEmployee.surname}`}
          style={{ width: "100px", marginBottom: 20 }}
        />

        <div
          className="adminProductDetail__fields"
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <div style={{display: "flex", gap: "15px"}}>
            <div style={{width: "100%", display: "flex", flexDirection: "column", gap: "5px"}}>
              <label className="adminProductDetail__info">نام:</label>
              <input
                type="text"
                value={editedEmployee.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="adminProductDetail__input"
              />
            </div>
            <div style={{width: "100%", display: "flex", flexDirection: "column", gap: "5px"}}>
              <label className="adminProductDetail__info">نام خانوادگی:</label>
              <input
                type="text"
                value={editedEmployee.surname}
                onChange={(e) => handleChange("surname", e.target.value)}
                className="adminProductDetail__input"
              />
            </div>
            <div style={{width: "100%", display: "flex", flexDirection: "column", gap: "5px"}}>
              <label className="adminProductDetail__info">نقش:</label>
              <select
                value={editedEmployee.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="adminProductDetail__input"
              >
                <option value="انباردار">انباردار</option>
                <option value="مدیر">مدیر</option>
              </select>
            </div>
          </div>
          <div style={{display: "flex", gap: "35px"}}>
            <div style={{width: "100%", display: "flex", flexDirection: "column", gap: "5px"}}>
              <label className="adminProductDetail__info">ایمیل:</label>
              <input
                type="email"
                value={editedEmployee.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className="adminProductDetail__input"
              />
            </div>
            <div style={{width: "100%", display: "flex", flexDirection: "column", gap: "5px"}}>
              <label className="adminProductDetail__info">شماره تلفن:</label>
              <input
                type="text"
                value={editedEmployee.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="adminProductDetail__input"
              />
            </div>
          </div>

        </div>

        <div className="modal-buttons">
          <button
            className="modal-button gray"
            onClick={onBack}
          >
            ➔ بازگشت
          </button>
          <button
            onClick={handleSave}
            className="modal-button"
            // style={{
            //   padding: "12px 24px",
            //   backgroundColor: "#d54343",
            //   color: "white",
            //   border: "none",
            //   borderRadius: 12,
            //   cursor: "pointer",
            //   fontSize: "18px",
            //   fontWeight: "bold",
            // }}
          >
            ذخیره تغییرات
          </button>
        </div>
      </div>
    </div>

  );
}

export default AdminEmployeeDetail;