import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WarehouseViewModal from "./WarehouseViewModal";
import WarehousePurchaseModal from "./WarehousePurchaseModal";

function WarehouseNotifications() {
  const { warehouseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transferItems, setTransferItems] = useState([]);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState("");

  const [products, setProducts] = useState([]);
  const [transferRequests, setTransferRequests] = useState([]);
  const [shippingRequests, setShippingRequests] = useState([]); 
  const [transferProductsMap, setTransferProductsMap] = useState({});
  const [shelvesMap, setShelvesMap] = useState({});
  const [shippingProductsMap, setShippingProductsMap] = useState({});
  useEffect(() => {
    if (!warehouseId) return;

const fetchShippingRequests = async () => {
  try {
    const res = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/inventoryMovement/getAllShippingRequestByToWarehouseId?toWarehouseId=${warehouseId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error("خطا در دریافت درخواست‌های ارسال");
    const data = await res.json();
    setShippingRequests(data);

    const uniqueVariantIds = [...new Set(data.map(r => r.variantsId.variantId))];
    const productsMap = {};

    await Promise.all(
      uniqueVariantIds.map(async (variantId) => {
        try {
          const res = await fetch(
            `http://127.0.0.1:8080/api/Sanjaghak/productVariants/${variantId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!res.ok) return;
          const variantData = await res.json();
          productsMap[variantId] = variantData.productId.productName;
        } catch (err) {
          console.error("خطا در دریافت محصول:", err);
        }
      })
    );

    setShippingProductsMap(productsMap);
  } catch (err) {
    console.error(err);
  }
};

    fetchShippingRequests();
  }, [warehouseId, token]);
  useEffect(() => {
    if (!warehouseId) return;

    const fetchProducts = async () => {
      try {
        const resOrders = await fetch(
          "http://127.0.0.1:8080/api/Sanjaghak/purchaseOrders/getAllPurchaseOrders",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!resOrders.ok) throw new Error("خطا در دریافت سفارش‌ها");
        const allOrders = await resOrders.json();

        const warehouseOrders = allOrders.filter(
          (o) =>
            o.warehouseId.warehouseId === warehouseId && o.status === "Shipping"
        );

        const productList = [];

        for (const order of warehouseOrders) {
          const resItems = await fetch(
            `http://127.0.0.1:8080/api/Sanjaghak/purchaseOrderItems/by-order/${order.purchaseOrdersId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!resItems.ok) continue;
          const items = await resItems.json();

          for (const item of items) {
            const variantId = item.variantsId.variantId;
            const resVariant = await fetch(
              `http://127.0.0.1:8080/api/Sanjaghak/productVariants/${variantId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!resVariant.ok) continue;
            const variantData = await resVariant.json();

            productList.push({
              id: variantData.variantId,
              name: variantData.productId.productName,
              quantity: item.quantityOrdered - item.recivedQuantity,
            });
          }
        }

        setProducts(productList);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [warehouseId, token]);

  useEffect(() => {
    if (!warehouseId) return;

    const fetchTransferRequests = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/inventoryMovement/getAllTransferRequestByWarehouseId?fromWarehouseId=${warehouseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("خطا در دریافت درخواست‌های انتقال");

        const data = await res.json();
        const requests = data.filter(r => r.movementType === "REQUEST_TRANSFER");
        setTransferRequests(requests);

        const uniqueVariantIds = [...new Set(requests.map(r => r.variantsId.variantId))];
        const productsMap = {};
        await Promise.all(
          uniqueVariantIds.map(async (variantId) => {
            try {
              const res = await fetch(
                `http://127.0.0.1:8080/api/Sanjaghak/productVariants/${variantId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (!res.ok) return;
              const data = await res.json();
              productsMap[variantId] = data.productId.productName;
            } catch (err) {
              console.error(err);
            }
          })
        );
        setTransferProductsMap(productsMap);

        const uniqueShelfIds = [
          ...new Set([
            ...requests.map(r => r.fromShelvesId.shelvesId),
            ...requests.map(r => r.toShelvesId.shelvesId),
          ]),
        ];
        const shelfCodesMap = {};
        await Promise.all(
          uniqueShelfIds.map(async (shelfId) => {
            try {
              const res = await fetch(
                `http://127.0.0.1:8080/api/Sanjaghak/shelves/${shelfId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (!res.ok) return;
              const data = await res.json();
              shelfCodesMap[shelfId] = data.shelvesCode;
            } catch (err) {
              console.error(err);
            }
          })
        );
        setShelvesMap(shelfCodesMap);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransferRequests();
  }, [warehouseId, token]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8080/api/Sanjaghak/warehouse/getAllWarehouse",
          { headers: { Authorization: `Bearer ${token}` } }
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

  const warehouseNamesMap = {};
  warehouses.forEach((w) => {
    warehouseNamesMap[w.warehouseId] = w.name;
  });

  const approveShipping = async (inventoryMovementId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/inventoryMovement/transferOut/${inventoryMovementId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("خطا در تایید انتقال");

      alert("انتقال تایید شد!");
      setShippingRequests((prev) =>
        prev.filter((s) => s.inventoryMovementId !== inventoryMovementId)
      );
    } catch (err) {
      console.error(err);
      alert("خطا در تایید انتقال");
    }
  };

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا: {error}</div>;

  const warehouse = warehouses.find((w) => w.warehouseId === warehouseId);
  if (!warehouse) return <div>انبار یافت نشد.</div>;

  const notifications = [
...shippingRequests.map((sr) => ({
  id: sr.inventoryMovementId,
  text: `درخواست ارسال محصول ${
    shippingProductsMap[sr.variantsId.variantId] || sr.variantsId.variantId
  } از انبار ${
    warehouseNamesMap[sr.fromWarehouseId.warehouseId] || sr.fromWarehouseId.warehouseId
  }`,
  buttonText: "تایید",
  onClick: () => approveShipping(sr.inventoryMovementId),
})),
    ...transferRequests.map((tr) => ({
      id: tr.inventoryMovementId,
      text: `درخواست انتقال محصول ${transferProductsMap[tr.variantsId.variantId] || tr.variantsId.variantId} از انبار ${warehouseNamesMap[tr.fromWarehouseId.warehouseId] || tr.fromWarehouseId.warehouseId} به انبار ${warehouseNamesMap[tr.toWarehouseId.warehouseId] || tr.toWarehouseId.warehouseId}`,
      buttonText: "مشاهده",
      onClick: () => {
        setTransferItems([
          {
            id: tr.inventoryMovementId,
            productName: transferProductsMap[tr.variantsId.variantId] || tr.variantsId.variantId,
            fromWarehouse: warehouseNamesMap[tr.fromWarehouseId.warehouseId] || tr.fromWarehouseId.warehouseId,
            fromShelf: shelvesMap[tr.fromShelvesId.shelvesId] || tr.fromShelvesId.shelvesId,
            toWarehouse: warehouseNamesMap[tr.toWarehouseId.warehouseId] || tr.toWarehouseId.warehouseId,
            toShelf: shelvesMap[tr.toShelvesId.shelvesId] || tr.toShelvesId.shelvesId,
            quantity: tr.quantity,
            fromSection: shelvesMap[tr.fromShelvesId.shelvesId]?.slice(0, 3) || "نامعلوم",
            toSection: shelvesMap[tr.toShelvesId.shelvesId]?.slice(0, 3) || "نامعلوم",
          },
        ]);
        setIsModalOpen(true);
        setCurrentRequestId(tr.inventoryMovementId);
      },
    })),

    ...(products.length > 0
      ? [
          {
            id: "purchase",
            text: "محموله جدید رسید",
            buttonText: "مشاهده",
            onClick: () => setIsPurchaseModalOpen(true),
          },
        ]
      : []),
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
      <h3 style={{ marginBottom: 20, borderBottom: "1px solid #ddd", paddingBottom: 10 }}>
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
          id={currentRequestId}
          onClose={() => setIsModalOpen(false)}
          onConfirmTransfer={() => {
            alert("انتقال تایید شد!");
            setIsModalOpen(false);
          }}
        />
      )}

      {isPurchaseModalOpen && (
        <WarehousePurchaseModal
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          warehouse={warehouse}
          supplier="شرکت تأمین‌کننده تستی"
          products={products}
        />
      )}
    </div>
  );
}

export default WarehouseNotifications;