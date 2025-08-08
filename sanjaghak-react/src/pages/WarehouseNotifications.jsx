import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const warehouses = [
  { id: 1, name: "انبار مرکزی" },
  { id: 2, name: "انبار غرب" },
  { id: 3, name: "انبار جنوب" },
];

function WarehouseNotifications() {
  const { warehouseId } = useParams();
  const navigate = useNavigate();

  const warehouse = warehouses.find((w) => w.id === Number(warehouseId));
  if (!warehouse) return <div>انبار یافت نشد.</div>;

  const notifications = [
    {
      id: 1,
      text: "با درخواست انتقال موافقت شد",
      buttonText: "تایید",
      onClick: () => alert("تایید شد!"),
    },
    {
      id: 2,
      text: `درخواست انتقال به انبار ${warehouse.name}`,
      buttonText: "مشاهده",
      onClick: () => alert("نمایش جزئیات انتقال"),
    },
  ];

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Vazirmatn, sans-serif",
        direction: "rtl",
        maxWidth: 600,
        margin: "auto",
      }}
    >
      <h3
        style={{
          marginBottom: 20,
          borderBottom: "1px solid #ddd",
          paddingBottom: 10,
        }}
      >
        اعلانات {warehouse.name}
      </h3>

      {notifications.map((note) => (
        <div
          key={note.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: "1px solid #eee",
            fontSize: 14,
            color: "#333",
          }}
        >
          <span>{note.text}</span>
          <button
            onClick={note.onClick}
            style={{
              backgroundColor: note.buttonText === "تایید" ? "#4caf50" : "#1976d2",
              color: "white",
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              cursor: "pointer",
              fontWeight: 600,
              minWidth: 70,
            }}
          >
            {note.buttonText}
          </button>
        </div>
      ))}

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: 20,
          padding: 10,
          width: "100%",
          borderRadius: 8,
          border: "none",
          backgroundColor: "#f44336",
          color: "white",
          fontWeight: 600,
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#d32f2f")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
      >
        بازگشت
      </button>
    </div>
  );
}

export default WarehouseNotifications;
