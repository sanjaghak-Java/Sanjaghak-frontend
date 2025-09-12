import React, { useState, useEffect } from 'react';
import jalaali from 'jalaali-js';
import '/src/styles/OrderDetailsModal.css';
import download from '../assets/download.png';

function toPersianDate(date) {
  if (!date) return '';
  if (typeof date === 'string' && date.includes('/')) return date;
  const d = new Date(date);
  const j = jalaali.toJalaali(d);
  return `${j.jy}/${j.jm.toString().padStart(2,'0')}/${j.jd.toString().padStart(2,'0')}`;
}
function OrderDetailsModal({ order, onClose }) {
  const [step, setStep] = useState(1);
  const [reasonText, setReasonText] = useState('');
  const [selectedReturnReason, setSelectedReturnReason] = useState('');
  const [returnQuantity, setReturnQuantity] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  if (!order) return null;

  const isDelivered = order.status === 'تحویل شده';
  const isInProgress = order.status === 'در جریان';

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const itemsRes = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/orderItem/getOrderItemByFilter?orderId=${order.id}`
        );
        const itemsData = await itemsRes.json();

        const detailedItems = await Promise.all(
          itemsData.content.map(async (item) => {
            const variantRes = await fetch(
              `http://127.0.0.1:8080/api/Sanjaghak/productVariants/${item.variantId.variantId}`
            );
            const variantData = await variantRes.json();

            const imagesRes = await fetch(
              `http://127.0.0.1:8080/api/Sanjaghak/productImages/${variantData.productId.productId}`
            );
            const imagesData = await imagesRes.json();
            const mainImage = imagesData.find((img) => img.primary)?.imageUrl || '';

            return {
              ...item,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalAmount: item.totalAmount,
              variant: { ...variantData },
              product: {
                id: variantData.productId.productId,
                name: variantData.productId.productName,
                image: mainImage ? `http://127.0.0.1:8080${mainImage}` : '',
                color: variantData.color,
                hex: variantData.hexadecimal,
              },
            };
          })
        );

        setItems(detailedItems);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order]);

  const handleCancelClick = async () => {
    const confirmCancel = window.confirm('آیا مطمئن هستید که می‌خواهید این سفارش را لغو کنید؟');
    if (!confirmCancel) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/Orders/cancelOrder/${order.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('خطا در لغو سفارش');
      }

      alert('سفارش با موفقیت لغو شد');
      onClose();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('لغو سفارش با خطا مواجه شد');
    }
  };

  const handleReturnClick = (item) => {
    setSelectedItem(item);
    setReturnQuantity(1);
    setStep(2);
  };

  const handleReturnSubmit = async () => {
    if (!selectedReturnReason) {
      alert('لطفاً علت مرجوعی را انتخاب کنید');
      return;
    }

    try {
      const createRes = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/return/create?orderId=${order.id}`,
              {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({}) 
      }
      );
      const createdReturn = await createRes.json();
      const returnId = createdReturn.returnId;

      const addRes = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/returnItem/addToReturn?returnId=${returnId}&orderItemId=${selectedItem.orderItemId}`,
        {
          method: 'POST',
                  headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
          body: JSON.stringify({
            quantity: returnQuantity,
            title: 'درخواست مرجوعی',
            description: reasonText || selectedReturnReason,
          }),
        }
      );

      if (!addRes.ok) {
        throw new Error('خطا در افزودن آیتم مرجوعی');
      }

      const finalizeRes = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/return/finalizeReturn/${returnId}`,
        {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      }
      );

      if (!finalizeRes.ok) {
        throw new Error('خطا در نهایی‌سازی مرجوعی');
      }

      alert('درخواست مرجوعی با موفقیت ثبت شد');
      onClose();
    } catch (error) {
      console.error('Return request failed:', error);
      alert('ثبت مرجوعی با خطا مواجه شد');
    }
  };

  return (
    <div className="modal-order-overlay" onClick={onClose}>
      <div className="modal-orders-content" onClick={(e) => e.stopPropagation()}>
        {loading ? (
          <p>در حال بارگذاری جزئیات سفارش...</p>
        ) : (
          <>
            {step === 1 && (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: ' 5px 10px',
                  }}
                >
                  <h3 className="modal-title">جزئیات سفارش</h3>
                  <button className="downloadbutton" title="دانلود">
                    <img src={download} alt="دانلود" />
                  </button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>کد پیگیری سفارش:</strong> {order.orderNumber}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p>
                      <strong>تاریخ ثبت سفارش:</strong> {toPersianDate(order.orderDate)}
                    </p>
                    <p>
                      <strong>تاریخ تحویل:</strong>{' '}
                      {order.status === 'لغو شده' ? '' : toPersianDate(order.deliveryDate)}
                    </p>
                  </div>

                  <hr style={{ margin: '1rem 0' }} />

                  <table className="order-modal-table">
                    <thead>
                      <tr>
                        <th>ردیف</th>
                        <th>عکس</th>
                        <th>نام محصول</th>
                        <th>رنگ</th>
                        <th>قیمت واحد</th>
                        <th>تعداد</th>
                        <th>مجموع</th>
                        {(isDelivered || isInProgress) && <th>عملیات</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.orderItemId}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="orders-image"
                            />
                          </td>
                          <td>{item.product.name}</td>
                          <td>
                            <span
                              style={{
                                display: 'inline-block',
                                width: '15px',
                                height: '15px',
                                backgroundColor: item.product.hex,
                                borderRadius: '50%',
                                marginLeft: '5px',
                              }}
                            ></span>
                            {item.product.color}
                          </td>
                          <td>{item.unitPrice.toLocaleString()} تومان</td>
                          <td>{item.quantity}</td>
                          <td>{item.totalAmount.toLocaleString()} تومان</td>
                          {(isDelivered || isInProgress) && (
                            <td>
                              {isDelivered && (
                                <button onClick={() => handleReturnClick(item)} className="modal-button">
                                  گزارش مرجوعی
                                </button>
                              )}
                              {isInProgress && (
                                <button onClick={handleCancelClick} className="modal-button">
                                  لغو سفارش
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="modal-title">فرم گزارش مرجوعی</h3>

                <p>
                  <strong>محصول انتخاب شده:</strong> {selectedItem?.product.name}
                </p>
                <p>
                  <strong>حداکثر تعداد قابل مرجوع:</strong> {selectedItem?.quantity}
                </p>

                <input
                  type="number"
                  min="1"
                  max={selectedItem?.quantity || 1}
                  value={returnQuantity}
                  onChange={(e) => setReturnQuantity(Number(e.target.value))}
                  className="modal-input"
                  style={{ width: '100%', marginBottom: '1rem' }}
                />

                <select
                  className="modal-select"
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
                  className="modal-textarea"
                  placeholder="توضیحات بیشتر..."
                  value={reasonText}
                  onChange={(e) => setReasonText(e.target.value)}
                />

                <div className="modal-footer">
                  <button onClick={() => setStep(1)} className="modal-button-back">
                    بازگشت
                  </button>
                  <button onClick={handleReturnSubmit} className="modal-button">
                    ارسال
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default OrderDetailsModal;