import React, { useState } from 'react';
import jalaali from 'jalaali-js';
import '/src/styles/OrderDetailsModal.css';
import justify from '../assets/justify.png';
import store from '../assets/store.png';

function toGregorian(shamsiDate) {
  const [jy, jm, jd] = shamsiDate.split('/').map(Number);
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  return new Date(gy, gm - 1, gd);
}

function daysSinceDelivery(deliveryDateStr) {
  const deliveryDate = toGregorian(deliveryDateStr);
  const now = new Date();
  const diffTime = now.getTime() - deliveryDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

const returnReasons = [
  'کالا معیوب است',
  'کالا با توضیحات مطابقت ندارد',
  'سفارش اشتباه بوده',
  'دیر رسیدن کالا',
];

const cancelReasons = [
  'تغییر نظر داده‌ام',
  'می‌خواهم کالا دیگری سفارش دهم',
  'مدت زمان ارسال طولانی بود',
];

function OrderDetailsModal({ order, onClose }) {
  const [step, setStep] = useState(1);
  const [reasonText, setReasonText] = useState('');
  const [selectedReturnReason, setSelectedReturnReason] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (!order) return null;

  const isDeliveredAndWithin3Days = order.status === 'تحویل شده' && daysSinceDelivery(order.deliveryDate) < 3;
  const isInProgress = order.status === 'در جریان';

  const handleCancelClick = () => {
    setShowCancelForm(true);
  };

  const handleReturnSubmit = () => {
    if (!selectedReturnReason) {
      alert('لطفاً علت مرجوعی را انتخاب کنید');
      return;
    }
    console.log('گزارش مرجوعی ثبت شد:', { selectedReturnReason, reasonText });
    onClose();
  };

  const handleCancelSubmit = () => {
    if (!cancelReason) {
      alert('لطفاً دلیل لغو سفارش را وارد کنید');
      return;
    }
    console.log('سفارش لغو شد با دلیل:', cancelReason);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-order-content">
        <button className="modal-close" onClick={onClose}>×</button>

        {step === 1 && !showCancelForm && (
          <>
            <h3 className="modal-title">جزئیات سفارش</h3>
            <div className="modal-body">
              <div className="profile-oreder-details">
                <label>کد پیگیری سفارش:</label>
                <label>{order.orderNumber}</label>
                <br />
                <div>
                  <section style={{ display: "flex" }}>
                    <label>تاریخ ثبت سفارش:</label>
                    <label>{order.orderDate}</label>
                  </section>

                  {(order.status !== 'لغو شده' && order.status !== 'در جریان') && (
                    <section style={{ display: "flex" }}>
                      <label>تاریخ تحویل:</label>
                      <label>{order.deliveryDate}</label>
                    </section>
                  )}
                </div>
              </div>
              <br />
              <hr />
              <br />
              <div style={{ display: "flex", gap: "15px" }}>
                <img src={order.product.image} alt="عکس محصول" className="orders-image" />
                <div className="orders-info-div">
                  <label>نام کالا</label>
                  <div className="warrantydiv">
                    <img src={store} alt="فروشگاه" className="warrantyimg" />
                    <label className="warrantylabel">سنجاقک</label>
                  </div>
                  <div className="warrantydiv">
                    <img src={justify} alt="دسته‌بندی" className="warrantyimg" />
                    <label className="warrantylabel">{order.product.category}</label>
                  </div>
                  <div className="itemsproductcolor">
                    <label
                      className="itemsproductcolorshow"
                      style={{ backgroundColor: order.product.colorCode }}
                    ></label>
                    <label className="itemsproductcolorname">{order.product.color}</label>
                  </div>
                  <div className="orders-pricepart">
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <label className="pricelab">تومان</label>
                      <label className="pricelab">{order.product.price.toLocaleString()}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {(isDeliveredAndWithin3Days || isInProgress) && (
              <div style={{ direction: "ltr", width: "100%", display: "flex", gap: '10px' }}>
                {isInProgress ? (
                  <button className="modal-button" onClick={handleCancelClick}>
                    لغو سفارش
                  </button>
                ) : (
                  <button className="modal-button" onClick={() => setStep(2)}>
                    گزارش مرجوعی
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {step === 2 && !showCancelForm && (
          <>
            <h3 className="modal-title">فرم گزارش مرجوعی</h3>
            <select
              className="modal-select"
              value={selectedReturnReason}
              onChange={(e) => setSelectedReturnReason(e.target.value)}
            >
              <option value="">علت مرجوعی راانتخاب کنید</option>
              {returnReasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>

            <textarea
              className="modal-textarea"
              placeholder="توضیحات بیشتر..."
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
            />

            <div className="modal-footer">
              <button className="modal-button gray" onClick={() => setStep(1)}>بازگشت</button>
              <button className="modal-button" onClick={handleReturnSubmit}>
                ارسال
              </button>
            </div>
          </>
        )}

        {showCancelForm && (
          <>
            <h3 className="modal-title">فرم لغو سفارش</h3>

            <select
              className="modal-select"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            >
              <option value="">علت لغو سفارش را انتخاب کنید</option>
              {cancelReasons.map((reason) => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>

            <textarea
              className="modal-textarea"
              placeholder="توضیحات بیشتر (اختیاری)..."
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
            />

            <div className="modal-footer">
              <button className="modal-button gray" onClick={() => setShowCancelForm(false)}>بازگشت</button>
              <button className="modal-button" onClick={handleCancelSubmit}>
                ارسال
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderDetailsModal;
