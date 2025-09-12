import React, { useState } from "react";
import "/src/styles/SentOrderModal.css";

function SentOrderModal({ isOpen, onClose }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!isOpen) return null;

  const orders = [
    {
      id: 1,
      customer: "زهرا احمدی",
      address: "تهران - خیابان ولیعصر",
      status: "در حال پردازش",
      note: "ارسال فوری",
      items: [
        { id: 1, productName: "گوشی موبایل", quantity: 1, discount: "10000", total: 8000000 },
        { id: 2, productName: "هندزفری", quantity: 2, discount: "0", total: 600000 },
      ],
      shippingCost: 50000,
      vat: 800000,
    },
    {
      id: 2,
      customer: "علی رضایی",
      address: "اصفهان - میدان نقش جهان",
      status: "ارسال شده",
      note: "پرداخت در محل",
      items: [
        { id: 1, productName: "لپ‌تاپ", quantity: 1, discount: "10%", total: 25000000 },
      ],
      shippingCost: 70000,
      vat: 2500000,
    },
  ];

  return (
    <div
      className="sent-modal-overlay"
      onClick={onClose} // کلیک روی پس‌زمینه مودال رو می‌بنده
    >
      <div
        className="sent-modal-content"
        onClick={(e) => e.stopPropagation()} // جلوگیری از بسته شدن با کلیک داخل باکس
      >
        {!selectedOrder ? (
          <>
            <h2 style={{ marginBottom: "20px" }}>ارسال سفارشات</h2>
            <table className="sent-supplier-table">
              <thead>
                <tr>
                  <th>شماره سفارش</th>
                  <th>سفارش دهنده</th>
                  <th>آدرس</th>
                  <th>وضعیت</th>
                  <th>یادداشت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} onClick={() => setSelectedOrder(order)}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.address}</td>
                    <td>{order.status}</td>
                    <td>{order.note}</td>
                    <td>
                      <button className="sent-operation-btn" title="تایید و ارسال">
                        ✔
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h3 style={{ marginBottom: "20px" }}>جزئیات سفارش شماره {selectedOrder.id}</h3>

            <table className="sent-detail-table">
              <thead>
                <tr>
                  <th>ردیف</th>
                  <th>نام محصول</th>
                  <th>تعداد</th>
                  <th>تخفیف</th>
                  <th>مبلغ کل</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.discount}</td>
                    <td>{item.total.toLocaleString()} تومان</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table className="sent-cost-table">
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
                  <td>
                    {selectedOrder.items
                      .reduce((sum, i) => sum + i.total, 0)
                      .toLocaleString()}
                  </td>
                  <td>{selectedOrder.vat.toLocaleString()}</td>
                  <td>{selectedOrder.shippingCost.toLocaleString()}</td>
                  <td>
                    {(
                      selectedOrder.items.reduce((sum, i) => sum + i.total, 0) +
                      selectedOrder.vat +
                      selectedOrder.shippingCost
                    ).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            <button
              className="sent-modal-button"
              onClick={() => setSelectedOrder(null)}
            >
              بازگشت به لیست سفارشات
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default SentOrderModal;
