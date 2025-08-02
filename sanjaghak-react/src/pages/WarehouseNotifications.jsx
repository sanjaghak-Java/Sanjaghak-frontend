import React from "react";

function WarehouseNotifications({ warehouseName, onClose }) {
  const notifications = [
    {
      id: 1,
      text: "با درخواست انتقال موافقت شد",
      buttonText: "تایید",
      onClick: () => alert("تایید شد!"),
    },
    {
      id: 2,
      text: `درخواست انتقال به انبار ${warehouseName}`,
      buttonText: "مشاهده",
      onClick: () => alert("نمایش درخواست انتقال"),
    },
  ];

  return (
    <>
      <div
        className="modal-overlay"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 1100,
        }}
      ></div>

      <div
        className="modal-content"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          padding: "20px 25px",
          borderRadius: "12px",
          width: "350px",
          maxHeight: "70vh",
          overflowY: "auto",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          zIndex: 1200,
          fontFamily: "Vazirmatn, sans-serif",
          direction: "rtl",
          userSelect: "none",
        }}
      >
        <h3
          style={{
            marginBottom: "20px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "10px",
          }}
        >
          اعلانات {warehouseName}
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
              fontSize: "14px",
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
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
                fontWeight: "600",
                minWidth: "70px",
              }}
            >
              {note.buttonText}
            </button>
          </div>
        ))}

        <button
          onClick={onClose}
          style={{
            marginTop: "20px",
            padding: "10px",
            width: "100%",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#f44336",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#d32f2f")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
        >
          بستن
        </button>
      </div>
    </>
  );
}

export default WarehouseNotifications;
