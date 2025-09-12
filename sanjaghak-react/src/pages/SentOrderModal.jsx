import React, { useState, useEffect } from "react";
import "/src/styles/SentOrderModal.css";

function SentOrderModal({ isOpen, onClose, orders, token }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    if (!isOpen || !orders || orders.length === 0) return;

    const fetchOrderDetails = async () => {
      const enrichedOrders = await Promise.all(
        orders.map(async (order) => {
          let customerName = "نامشخص";
          let customerAddress = "نامشخص";

          if (order.customerId?.customerId) {
            try {
              const resCustomer = await fetch(
                `http://127.0.0.1:8080/api/Sanjaghak/Customer/${order.customerId.customerId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (resCustomer.ok) {
                const customerData = await resCustomer.json();
                customerName = `${customerData.userId.firstName} ${customerData.userId.lastName}`;
              }
            } catch (err) {
              console.error("Error fetching customer:", err);
            }
          }

          if (order.billingAddressId?.addressId) {
            try {
              const resAddress = await fetch(
                `http://127.0.0.1:8080/api/Sanjaghak/customerAddress/${order.billingAddressId.addressId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (resAddress.ok) {
                const addressData = await resAddress.json();
                customerAddress = `${addressData.addressLine1} ${addressData.addressLine2}`;
              }
            } catch (err) {
              console.error("Error fetching address:", err);
            }
          }

          let items = [];
          try {
            const resItems = await fetch(
              `http://127.0.0.1:8080/api/Sanjaghak/orderItem/getOrderItemByFilter?orderId=${order.orderId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (resItems.ok) {
              const itemsData = await resItems.json();
              items = await Promise.all(
                itemsData.content.map(async (item) => {
                  let productName = "نامشخص";
                  try {
                    const resVariant = await fetch(
                      `http://127.0.0.1:8080/api/Sanjaghak/productVariants/${item.variantId.variantId}`,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (resVariant.ok) {
                      const variantData = await resVariant.json();
                      productName = variantData.productId.productName;
                    }
                  } catch (err) {
                    console.error("Error fetching product variant:", err);
                  }
                  return {
                    ...item,
                    productName,
                  };
                })
              );
            }
          } catch (err) {
            console.error("Error fetching order items:", err);
          }

          return {
            ...order,
            customerName,
            customerAddress,
            items,
          };
        })
      );

      setOrderList(enrichedOrders);
    };

    fetchOrderDetails();
  }, [isOpen, orders, token]);

  const confirmOrder = async (orderId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/Orders/${orderId}/confirm-sale`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        alert("سفارش با موفقیت تایید شد!");
        setOrderList((prev) =>
          prev.map((order) =>
            order.orderId === orderId
              ? { ...order, orderStatus: "confirmed" }
              : order
          )
        );
         window.location.reload();

      } else {
        alert("خطا در تایید سفارش!");
      }
    } catch (err) {
      console.error("Error confirming order:", err);
      alert("خطا در تایید سفارش!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sent-modal-overlay" onClick={onClose}>
      <div className="sent-modal-content" onClick={(e) => e.stopPropagation()}>
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
                {orderList.map((order) => (
                  <tr key={order.orderId} onClick={() => setSelectedOrder(order)}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>{order.customerAddress}</td>
                    <td>{order.orderStatus}</td>
                    <td>{order.notes || "-"}</td>
                    <td>
                      <button
                        className="sent-operation-btn"
                        title="تایید و ارسال"
                        onClick={(e) => {
                          e.stopPropagation(); 
                          confirmOrder(order.orderId);
                        }}
                      >
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
            <h3 style={{ marginBottom: "20px" }}>
              جزئیات سفارش شماره {selectedOrder.orderNumber}
            </h3>

            <table className="sent-detail-table">
              <thead>
                <tr>
                  <th>ردیف</th>
                  <th>نام محصول</th>
                  <th>تعداد</th>
                  <th>قیمت واحد</th>
                  <th>جمع</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, index) => (
                  <tr key={item.orderItemId}>
                    <td>{index + 1}</td>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice.toLocaleString()}</td>
                    <td>{item.totalAmount.toLocaleString()}</td>
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
                      .reduce((sum, i) => sum + i.totalAmount, 0)
                      .toLocaleString()}
                  </td>
                  <td>{selectedOrder.taxAmount.toLocaleString()}</td>
                  <td>{selectedOrder.shippingCost.toLocaleString()}</td>
                  <td>{selectedOrder.totalAmount.toLocaleString()}</td>
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