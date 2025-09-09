import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import '/src/styles/AddPurchaseFactor.css';
import download from '../assets/download.png';

function AddPurchaseFactor({ isOpen, onClose, items = [], supplier, warehouse }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const navigate = useNavigate();
  const roundToThousand = (num) => Math.round(num / 1000) * 1000;
function toEnglishDigits(str) {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const englishDigits = '0123456789';
  let result = '';
  for (const ch of str) {
    const index = persianDigits.indexOf(ch);
    result += index >= 0 ? englishDigits[index] : ch;
  }
  return result;
}
  // Memoize shipping costs per item so they are stable per render
  const shippingCostsMap = useMemo(() => {
    const map = {};
    items.forEach(item => {
      const randomCostPerUnit = Math.floor(Math.random() * (60000 - 10000 + 1)) + 10000;
      const roundedCostPerUnit = roundToThousand(randomCostPerUnit);
      map[item.id] = roundedCostPerUnit * item.quantity;
    });
    return map;
  }, [items]);

  const shipping = Object.values(shippingCostsMap).reduce((sum, cost) => sum + cost, 0);
  if (!isOpen) return null;

  // Generate random shipping cost for each item (between 10,000 and 60,000 per unit)


  // Calculate totals
  const total = items.reduce((sum, item) => sum + (item.product.costPrice * item.quantity), 0);
  const tax = Math.floor(total * 0.09); // 9% VAT example
  const finalTotal = total + tax + shipping;
const getResponseData = async (res) => {
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  } else {
    return await res.text();
  }
};
  const handleBackdropClick = () => onClose();
  const handleModalClick = (e) => e.stopPropagation();

  const handleSubmit = async () => {
  setLoading(true);
  setError(null);
  setSuccess(false);

  try {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // Map each item to a promise that: (1) creates an order, (2) attaches item to that order
const promises = items.map(async (item) => {
  const shippingCostForItem = shippingCostsMap[item.id] || 0;
  const expectedDate = item.arrivalDate
    ? toEnglishDigits(item.arrivalDate.convert('gregorian').format('YYYY-MM-DD'))
    : null;

  const orderBody = {
    shippingCost: shippingCostForItem,
    expectedDate,
    taxAmount: 0
  };

  // 1) Create purchase order
  const orderRes = await fetch(
    `http://127.0.0.1:8080/api/Sanjaghak/purchaseOrders/purchaseOrdersRegistration?warehouseId=${warehouse.warehouseId}&supplierId=${supplier.suppliersId}`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(orderBody),
    }
  );

  if (!orderRes.ok) {
    const txt = await orderRes.text();
    throw new Error(`Failed to create purchase order (status ${orderRes.status}): ${txt}`);
  }

  const orderData = await orderRes.json();
  const purchaseOrderId = orderData.purchaseOrdersId;
  if (!purchaseOrderId) throw new Error("No purchaseOrdersId returned from server");

  // 2) Attach item
  const variantId =
    item.product.variantId ||
    item.product.variantsId ||
    item.product.variantsId?.variantId ||
    item.product.variant?.variantId ||
    item.product.variantId?.variantId;

  if (!variantId) {
    throw new Error(`Missing variantId for product ${item.product.productName || item.product.name}`);
  }

  const itemBody = { quantityOrdered: item.quantity };

  const itemRes = await fetch(
    `http://127.0.0.1:8080/api/Sanjaghak/purchaseOrderItems/purchaseOrdersItemRegistration?purchaseOrderId=${purchaseOrderId}&variantsId=${variantId}`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(itemBody),
    }
  );

  if (!itemRes.ok) {
    const txt = await itemRes.text();
    throw new Error(`Failed to attach item (status ${itemRes.status}): ${txt}`);
  }

  const itemData = await itemRes.json();

  // 3) Register order
  const registerRes = await fetch(
    `http://127.0.0.1:8080/api/Sanjaghak/purchaseOrders/registr/${purchaseOrderId}`,
    {
      method: "PUT", // change if needed
      headers
    }
  );

if (!registerRes.ok) {
  const txt = await registerRes.text();
  throw new Error(`Failed to register order ${purchaseOrderId} (status ${registerRes.status}): ${txt}`);
}

const registerData = await getResponseData(registerRes);

  return { order: orderData, item: itemData, register: registerData };
});

    // wait for all items orders+attachments
    const results = await Promise.all(promises);

    setSuccess(true);
    alert("تمام سفارش‌ها و آیتم‌ها با موفقیت ثبت شدند.");
    onClose();
    navigate("/admin/سفارش خرید");
    return results; // optional, for debugging
  } catch (err) {
    setError(err.message || "خطا در ثبت سفارش‌ها");
    alert(err.message || "خطا در ثبت سفارش‌ها");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="modals-backdrop" onClick={handleBackdropClick}>
      <div className="invoice-modal" onClick={handleModalClick}>
        <h2>پیش‌فاکتور خرید</h2>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>ردیف</th>
              <th>محصول</th>
              <th>تأمین‌کننده</th>
              <th>انبار</th>
              <th>تعداد</th>
              <th>قیمت واحد (تومان)</th>
              <th>قیمت کل</th>
              <th>تاریخ رسید</th> {/* New column for arrival date */}
              <th>هزینه ارسال</th> {/* Shipping cost per item */}
            </tr>
          </thead>
          <tbody>
  {items.map((item, index) => {
    // Use memoized shipping cost here:
    const shippingCostForItem = shippingCostsMap[item.id] || 0;
    return (
      <tr key={item.id}>
        <td>{index + 1}</td>
        <td>{item.product.productName || item.product.name || "نامشخص"}</td>
        <td>{supplier.supplierName}</td>
        <td>{warehouse.name}</td>
        <td>{item.quantity}</td>
        <td>{item.product.costPrice.toLocaleString()}</td>
        <td>{(item.product.costPrice * item.quantity).toLocaleString()}</td>
        <td>{item.arrivalDate ? item.arrivalDate.format("YYYY/MM/DD") : "-"}</td>
        <td>{shippingCostForItem.toLocaleString()}</td>
      </tr>
    );
  })}
</tbody>
        </table>

        <table className="factor-summary-table">
          <thead>
            <tr>
              <th>جمع کل</th>
              <th>ارزش افزوده</th>
              <th>هزینه ارسال</th>
              <th>قیمت نهایی</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{total.toLocaleString()}</td>
              <td>{tax.toLocaleString()}</td>
              <td>{shipping.toLocaleString()}</td>
              <td>{finalTotal.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div className="invoice-actions">
          <button className="cancel-button" onClick={onClose} disabled={loading}>انصراف</button>
          <button
            className="confirm-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "در حال ارسال..." : "ثبت نهایی"}
          </button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>ثبت سفارش با موفقیت انجام شد.</p>}
      </div>
    </div>
  );
}

export default AddPurchaseFactor;