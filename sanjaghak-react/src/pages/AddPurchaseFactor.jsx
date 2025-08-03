import React from "react";
import { useNavigate } from "react-router-dom";
import '/src/styles/AddPurchaseFactor.css';
import download from '../assets/download.png';


function AddPurchaseFactor({ isOpen, onClose, purchase }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const sampleRows = [
    {
      id: 1,
      product: "گوشی موبایل سامسونگ",
      supplier: "شرکت الف",
      warehouse: "انبار مرکزی",
      quantity: 10,
      unitPrice: 5500000,
      totalPrice: 16300000,
    },
    {
      id: 2,
      product: "هدفون بی‌سیم",
      supplier: "شرکت الف",
      warehouse: "انبار مرکزی",
      quantity: 20,
      unitPrice: 1200000,
      totalPrice: 2400000,
    },
    {
      id: 3,
      product: "لپ‌تاپ ایسوس",
      supplier: "شرکت الف",
      warehouse: "انبار مرکزی",
      quantity: 50,
      unitPrice: 25000000,
      totalPrice: 25000000,
    },
  ];

  const sampleTotal = 43900000;
  const sampleTax = 3951000;
  const sampleShipping = 60000;
  const sampleFinalTotal = 47846000;

  const showEditCancelButtons = purchase && (purchase.status === "در حال پردازش" || purchase.status === "در حال ارسال");

  const handleBackdropClick = () => {
    onClose();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleEditClick = () => {
  navigate("/admin/ثبت-سفارش");
  };

  const handleCancelClick = () => {
    const confirmCancel = window.confirm("آیا از لغو سفارش مطمئن هستید؟");
    if (confirmCancel) {
      alert("سفارش با موفقیت لغو شد.");
      onClose();
    }
  };


  return (
    <div className="modals-backdrop" onClick={handleBackdropClick}>
      <div className="invoice-modal" onClick={handleModalClick}>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <h2>پیش‌فاکتور خرید</h2>
          <button className="downloadbutton" title="دانلود"> <img src={download} alt="دانلود" /></button>
        </div>
        <br />
        <h4>{purchase ? ` شماره سفارش: ${purchase.id}` : ""}</h4>
        <br />

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
            </tr>
          </thead>
          <tbody>
            {sampleRows.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>{row.product}</td>
                <td>{row.supplier}</td>
                <td>{row.warehouse}</td>
                <td>{row.quantity}</td>
                <td>{row.unitPrice.toLocaleString()}</td>
                <td>{row.totalPrice.toLocaleString()}</td>
              </tr>
            ))}
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
              <td>{sampleTotal.toLocaleString()}</td>
              <td>{sampleTax.toLocaleString()}</td>
              <td>{sampleShipping.toLocaleString()}</td>
              <td>{sampleFinalTotal.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>


        <div className="invoice-actions">
          {showEditCancelButtons ? (
            <>
              <button className="edit-order-button" onClick={handleEditClick}>ویرایش</button>
              <button className="cancel-order-button" onClick={handleCancelClick}>لغو کردن</button>
            </>
          ) : (
            <>
              {!purchase && (
                <>
                  <button className="cancel-button" onClick={onClose}>انصراف</button>
                  <button className="confirm-button">ثبت نهایی</button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddPurchaseFactor;
