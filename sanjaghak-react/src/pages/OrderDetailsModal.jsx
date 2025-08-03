import React, { useState } from 'react';
import jalaali from 'jalaali-js';
import '/src/styles/OrderDetailsModal.css';
import download from '../assets/download.png';

function toGregorian(shamsiDate) {
  const [jy, jm, jd] = shamsiDate.split('/').map(Number);
  const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
  return new Date(gy, gm - 1, gd);
}

function OrderDetailsModal({ order, onClose }) {
  const [step, setStep] = useState(1);
  const [reasonText, setReasonText] = useState('');
  const [selectedReturnReason, setSelectedReturnReason] = useState('');

  if (!order) return null;

  const isDelivered = order.status === 'تحویل شده';
  const isInProgress = order.status === 'در جریان';

  const handleCancelClick = () => {
    const confirmCancel = window.confirm('آیا مطمئن هستید که می‌خواهید این سفارش را لغو کنید؟');
    if (confirmCancel) {
      console.log('سفارش لغو شد');
      onClose();
    }
  };

  const handleReturnSubmit = () => {
    if (!selectedReturnReason) {
      alert('لطفاً علت مرجوعی را انتخاب کنید');
      return;
    }
    console.log('گزارش مرجوعی ثبت شد:', { selectedReturnReason, reasonText });
    onClose();
  };

  return (
    <div className="modal-order-overlay" onClick={onClose}>
      <div className="modal-orders-content" onClick={(e) => e.stopPropagation()}>

        {step === 1 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: " 5px 10px"}}>
              <h3 className="modal-title">جزئیات سفارش</h3>
              <button className="downloadbutton" title='دانلود'>
                <img src={download} alt="دانلود" />
              </button>
            </div>
            <div className="modal-body">
              <p><strong>کد پیگیری سفارش:</strong> {order.orderNumber}</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p><strong>تاریخ ثبت سفارش:</strong> {order.orderDate}</p>
                <p><strong>تاریخ تحویل:</strong> {order.deliveryDate}</p>
              </div>

              <hr style={{ margin: "1rem 0" }} />

              <table className='order-modal-table'>
                <thead>
                  <tr>
                    <th>ردیف</th>
                    <th>عکس</th>
                    <th>نام محصول</th>
                    <th>دسته‌بندی</th>
                    <th>رنگ</th>
                    <th>قیمت</th>
                    {(isDelivered || isInProgress) && <th>عملیات</th>}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <img
                        src={order.product.image}
                        alt="محصول"
                        className='orders-image'
                      />
                    </td>
                    <td>{order.product.title}</td>
                    <td>{order.product.category}</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '15px',
                          height: '15px',
                          backgroundColor: order.product.colorCode,
                          borderRadius: '50%',
                          marginLeft: '5px',
                        }}
                      ></span>
                      {order.product.color}
                    </td>
                    <td>{order.product.price.toLocaleString()} تومان</td>
                    {(isDelivered || isInProgress) && (
                      <td>
                        {isDelivered && (
                          <button onClick={() => setStep(2)} className='modal-button'>
                            گزارش مرجوعی
                          </button>
                        )}
                        {isInProgress && (
                          <button onClick={handleCancelClick} className='modal-button'>
                            لغو سفارش
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="modal-title">فرم گزارش مرجوعی</h3>
            <select
              className='modal-select'
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              value={selectedReturnReason}
              onChange={(e) => setSelectedReturnReason(e.target.value)}
            >
              <option value="">علت مرجوعی را انتخاب کنید</option>
              <option value="کالا معیوب است">کالا معیوب است</option>
              <option value="کالا با توضیحات مطابقت ندارد">کالا با توضیحات مطابقت ندارد</option>
              <option value="سفارش اشتباه بوده">سفارش اشتباه بوده</option>
              <option value="دیر رسیدن کالا">دیر رسیدن کالا</option>
            </select>

            <textarea
              className='modal-textarea'
              placeholder="توضیحات بیشتر..."
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
            />

            <div className='modal-footer'>
              <button onClick={() => setStep(1)} className='modal-button-back'>بازگشت</button>
              <button onClick={handleReturnSubmit} className='modal-button'>ارسال</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderDetailsModal;
