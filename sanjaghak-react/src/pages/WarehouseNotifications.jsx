import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WarehouseViewModal from "./WarehouseViewModal";

function WarehouseNotifications() {
  const { warehouseId } = useParams();
  const navigate = useNavigate();

  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transferItems, setTransferItems] = useState([]);

  // Replace this with your actual token
  const token = localStorage.getItem("token"); // or wherever you store it

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8080/api/Sanjaghak/warehouse/getAllWarehouse",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("خطا در دریافت انبارها");
        const data = await res.json();
        setWarehouses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWarehouses();
  }, [token]);

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا: {error}</div>;

  const warehouse = warehouses.find((w) => w.warehouseId === warehouseId);
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
      onClick: () => {
        setTransferItems([
          {
            id: 1,
            productName: "محصول تست",
            fromWarehouse: "انبار غرب",
            fromSection: "بخش 1",
            fromShelf: "قفسه 3",
            toWarehouse: warehouse.name,
            toSection: "بخش 2",
            toShelf: "قفسه 1",
            quantity: 50,
          },
        ]);
        setIsModalOpen(true);
      },
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

      {isModalOpen && (
        <WarehouseViewModal
          transferItems={transferItems}
          onClose={() => setIsModalOpen(false)}
          onConfirmTransfer={() => {
            alert("انتقال تایید شد!");
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default WarehouseNotifications;