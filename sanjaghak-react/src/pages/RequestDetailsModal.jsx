import React from "react";
import "/src/styles/RequestDetailsModal.css";


const fakeOrderId = "RQ-1234";
const fakeRequestType = "خرید";
const fakeOrderDate = "1403/05/15";
const fakeRecipient = "علی رضایی";
const fakeAddress = "تهران، خیابان انقلاب، پلاک 123";

const fakeItems = [
  { id: 1, name: "گوشی موبایل", unitPrice: "1,00,000", quantity: 1, totalPrice: "1,200,000" },
  { id: 2, name: "شارژر سریع", unitPrice: "300,000", quantity: 2, totalPrice: "100,000" },
];

const fakeTotals = {
  subtotal: "1,800,000",
  tax: "180,000",
  shipping: "50,000",
  finalPrice: "2,030,000",
};

function RequestDetailsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="req-modal-overlay" onClick={onClose}>
      <div className="req-modal-content" onClick={(e) => e.stopPropagation()}>

        <h4>جزئیات درخواست</h4>
        <br />
        <div style={{display: "flex", flexDirection:"column", gap: "8px"}}>
          <p>شماره سفارش: <span>{fakeOrderId}</span></p>
          <p>توع درخواست: <span>{fakeRequestType}</span></p>
          <p>تاریخ ثبت: <span>{fakeOrderDate}</span></p>
          <p>تحویل گیرنده: <span>{fakeRecipient}</span></p>
          <p> آدرس: <span>{fakeAddress}</span></p>
        </div>
        <br />
        <hr />
        <table className="req-order-items-table">
          <thead>
            <tr>
              <th>ردیف</th>
              <th>نام محصول</th>
              <th>قیمت واحد</th>
              <th>تعداد</th>
              <th>قیمت کل</th>
            </tr>
          </thead>
          <tbody>
            {fakeItems.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{item.unitPrice}</td>
                <td>{item.quantity}</td>
                <td>{item.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="req-order-items-table" style={{borderCollapse: "separate"}}>
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
                <td>{fakeTotals.subtotal}</td>
                <td>{fakeTotals.tax}</td>
                <td>{fakeTotals.shipping}</td>
                <td style={{backgroundColor: "#f5f5f5"}}>{fakeTotals.finalPrice}</td>
                </tr>
            </tbody>
        </table>
        <div style={{direction: "ltr"}}>
          <button id="reject-butt">
            رد کردن ✖
          </button>
          <button id="confirm-butt">
            تایید کردن ✔
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestDetailsModal;
