import React, { useMemo } from "react";
import '/src/styles/AddPurchaseFactor.css';
import download from '../assets/download.png';

function PurchaseOrderFactor({ isOpen, onClose, purchase }) {
    console.log('Purchase received in factor:', purchase);
  if (!isOpen || !purchase) return null;

  const items = purchase.items || []; 
  const supplier = purchase.suppliersId || { supplierName: "نامشخص" };
  const warehouse = purchase.warehouseId || { name: "نامشخص" };

  const roundToThousand = (num) => Math.round(num / 1000) * 1000;

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
  const total = items.reduce((sum, item) => sum + (item.product?.costPrice || 0) * item.quantity, 0);
  const tax = Math.floor(total * 0.09); 
  const finalTotal = total + tax + shipping;

  const handleBackdropClick = () => onClose();
  const handleModalClick = (e) => e.stopPropagation();

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
              <th>تاریخ رسید</th>
              <th>هزینه ارسال</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const shippingCostForItem = shippingCostsMap[item.id] || 0;
              return (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.product?.productName || item.product?.name || "نامشخص"}</td>
<td>{supplier?.supplierName || "نامشخص"}</td>
<td>{warehouse?.name || "نامشخص"}</td>
                  <td>{item.quantity}</td>
                  <td>{(item.product?.costPrice || 0).toLocaleString()}</td>
                  <td>{((item.product?.costPrice || 0) * item.quantity).toLocaleString()}</td>
                  <td>{item.arrivalDate ? item.arrivalDate : "-"}</td>
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


      </div>
    </div>
  );
}

export default PurchaseOrderFactor;