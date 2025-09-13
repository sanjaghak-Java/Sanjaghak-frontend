import React, { useState, useEffect } from 'react';
import "/src/styles/RequestPage.css";
import Slider from 'react-slider';
import RequestDetailsModal from './RequestDetailsModal';
import download from '../assets/download.png';

const menuData = {
  "همه موارد": [],
  "خریدها": ["در حال پردازش", "تحویل داده شده"],
  "مرجوعی‌ها": ["تائید شده", "رد شده", "در حال بررسی"],
  "لغو شده‌ها": ["تائید شده", "رد شده", "در حال بررسی"],
};

const persianToEnglishDigits = (str) =>
  str.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

const parsePersianDate = (dateStr) =>
  parseInt(persianToEnglishDigits(dateStr).replaceAll("/", ""));

const formatPersianDate = (num) => {
  const str = num.toString();
  return `${str.substring(0, 4)}/${str.substring(4, 6)}/${str.substring(6)}`;
};

const statusMap = {
  pending: "در حال پردازش",
  processing: "در حال پردازش",
  delivered: "تحویل داده شده",
  Cancel: "لغو شده"
};

const categoryToTypeMap = {
  "خریدها": "خرید",
  "مرجوعی‌ها": "مرجوعی",
  "لغو شده‌ها": "لغو خرید",
};

function RequestPage() {
  const [dateRange, setDateRange] = useState([0, 99999999]);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [openMainMenu, setOpenMainMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRes = await fetch("http://127.0.0.1:8080/api/Sanjaghak/Orders/getOrdersByfilter");
        const ordersData = await ordersRes.json();
        const ordersWithDetails = await Promise.all(
          ordersData.content.map(async (order) => {
            // Full address
            let fullAddress = "—, —";
            if (order.billingAddressId?.addressId) {
              const addressRes = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/customerAddress/${order.billingAddressId.addressId}`);
              const addressData = await addressRes.json();
              fullAddress = `${addressData.addressLine1 || "—"}, ${addressData.addressLine2 || "—"}`;
            }

            // Items
            const itemsRes = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/orderItem/getOrderItemByFilter?orderId=${order.orderId}`);
            const itemsData = await itemsRes.json();

            const detailedItems = await Promise.all(
              itemsData.content.map(async (item) => {
                const productRes = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/productVariants/${item.variantId.variantId}`);
                const productData = await productRes.json();
                return {
                  id: item.orderItemId,
                  name: productData.productId.productName,
                  unitPrice: item.unitPrice,
                  quantity: item.quantity,
                  totalPrice: item.totalAmount,
                  color: productData.color
                };
              })
            );

            // Customer
            let requesterName = order.customerId?.customerId || "—";
            if (order.customerId?.customerId) {
              const customerRes = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/Customer/${order.customerId.customerId}`);
              const customerData = await customerRes.json();
              requesterName = `${customerData.userId.firstName} ${customerData.userId.lastName}`;
            }

            return {
              id: order.orderNumber,
              requester: requesterName,
              type: "خرید",
              status: statusMap[order.orderStatus] || "نامشخص",
              date: new Date(order.createdAt).toLocaleDateString('fa-IR').replace(/-/g, '/'),
              totalAmount: order.totalAmount.toLocaleString(),
              address: fullAddress,
              items: detailedItems,
              totals: {
                subtotal: order.subTotal.toLocaleString(),
                tax: order.taxAmount.toLocaleString(),
                shipping: order.shippingCost.toLocaleString(),
                finalPrice: order.totalAmount.toLocaleString(),
              },
            };
          })
        );
        setOrders(ordersWithDetails);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Fetch returns
useEffect(() => {
  const fetchReturns = async () => {
    try {
      const returnsRes = await fetch("http://127.0.0.1:8080/api/Sanjaghak/return/getAllReturn");
      const returnsData = await returnsRes.json();
        console.log(returnsData);

      const returnsWithDetails = await Promise.all(
        returnsData.map(async (ret) => {
          // Skip PENDING returns
          if (ret.returnStatus === "PENDING") return null;

          // Return items
          const returnItemsRes = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/returnItem/getReturnItemByReturnId?returnId=${ret.returnId}`);
          const returnItemsData = await returnItemsRes.json();

          const detailedItems = await Promise.all(
            returnItemsData.map(async (item) => {
              // Fetch order item info
              const orderItemRes = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/orderItem/${item.orderItemId.orderItemId}`);
              const orderItemData = await orderItemRes.json();

              // Fetch product info
              const productRes = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/productVariants/${orderItemData.variantId.variantId}`);
              const productData = await productRes.json();

              return {
                id: item.returnItemId,
                returnId: ret.returnId,
                name: productData.productId.productName,
                unitPrice: orderItemData.unitPrice,
                quantity: item.quantity,
                totalPrice: orderItemData.totalAmount,
                description: item.description,
                restock: item.restock
              };
            })
          );

          // Determine status
          let returnStatus = "";
          if (ret.returnStatus === "CHECKING") {
            returnStatus = "در حال بررسی";
          } else if (ret.returnStatus === "CHECKED") {
            const anyRestock = detailedItems.some(item => item.restock === true);
            returnStatus = anyRestock ? "قبول شده" : "رد شده";
          }

          // Fetch requester name from order → customer
          let requesterName = "—";
          if (ret.orderId?.orderId) {
            const orderRes = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/Orders/${ret.orderId.orderId}`);
            const orderData = await orderRes.json();

            if (orderData.customerId?.customerId) {
              const customerRes = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/Customer/${orderData.customerId.customerId}`);
              const customerData = await customerRes.json();
              requesterName = `${customerData.userId.firstName} ${customerData.userId.lastName}`;
            }
          }

          return {
            id: ret.returnNumber || ret.returnId,
            requester: requesterName,
            returnId: ret.returnId,
            type: "مرجوعی",
            status: returnStatus,
            date: new Date(ret.createdAt).toLocaleDateString('fa-IR').replace(/-/g, '/'),
            totalAmount: detailedItems.reduce((sum, i) => sum + Number(i.totalPrice), 0).toLocaleString(),
            items: detailedItems,
            address: "—",
          };
        })
      );

      // Filter out nulls (skipped PENDING)
      setReturns(returnsWithDetails.filter(r => r !== null));
    } catch (error) {
      console.error("Error fetching returns:", error);
    }
  };

  fetchReturns();
}, []);

  // Combine orders + returns
const allRequests = [...orders, ...returns];

useEffect(() => {
  if (allRequests.length > 0) {
    const allDates = allRequests.map(r => parsePersianDate(r.date));
    const minDate = Math.min(...allDates);
    const maxDate = Math.max(...allDates);
    setDateRange([minDate, maxDate]);
  }
}, [orders, returns]); // depend on orders & returns, not allRequests

  // Filtering
  const filteredRequests = allRequests.filter(r => {
    const matchesSearch = r.id.includes(searchText) || r.requester.includes(searchText);
    const rDate = parsePersianDate(r.date);
    const inDateRange = rDate >= dateRange[0] && rDate <= dateRange[1];

    if (!selectedStatus) return matchesSearch && inDateRange;

    const expectedType = categoryToTypeMap[selectedStatus.category];
    return (
      matchesSearch &&
      r.type === expectedType &&
      (selectedStatus.status === null || r.status === selectedStatus.status) &&
      inDateRange
    );
  });

  // Pagination
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedData = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNum) => {
    const num = Math.max(1, Math.min(pageNum, totalPages));
    setCurrentPage(num);
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const allDates = allRequests.map(r => parsePersianDate(r.date));
  const minDate = Math.min(...allDates);
  const maxDate = Math.max(...allDates);


  return (
    <div className="request-page">
      {/* Filters */}
      <div className="request-filters" style={{ position: "relative", display: "flex", gap: "20px", alignItems: "center", padding: "10px 0" }}>
        <input
          type="text"
          placeholder="جستجو با شماره یا درخواست‌کننده"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ flex: 1, padding: "6px 10px", fontSize: "14px" }}
        />
        {/* Main menu */}
        <div className={`request-main-menu-title ${openMainMenu ? "open" : ""}`}
          onMouseEnter={() => setOpenMainMenu(true)}
          onMouseLeave={() => { setOpenMainMenu(false); setOpenSubMenu(null); }}
        >
          درخواست‌ها
          {openMainMenu && (
            <ul className="main-menu">
              {Object.entries(menuData).map(([mainKey, subItems]) => (
                <li key={mainKey}
                  onMouseEnter={() => setOpenSubMenu(mainKey)}
                  onMouseLeave={() => setOpenSubMenu(null)}
                  onClick={() => {
                    if (mainKey === "همه موارد") setSelectedStatus(null);
                    else if (categoryToTypeMap[mainKey]) {
                      setSelectedStatus({ category: mainKey, status: null });
                      setOpenMainMenu(false);
                      setOpenSubMenu(null);
                    }
                  }}
                >
                  {mainKey}
                  {subItems.length > 0 && openSubMenu === mainKey && (
                    <ul className="sub-menu">
                      {subItems.map(subItem => (
                        <li key={subItem} onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStatus({ category: mainKey, status: subItem });
                          setOpenMainMenu(false);
                          setOpenSubMenu(null);
                        }}>{subItem}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Date filter */}
        <div className={`request-main-menu-title ${openDateFilter ? "open" : ""}`}
          onMouseEnter={() => setOpenDateFilter(true)}
          onMouseLeave={() => setOpenDateFilter(false)}
        >
          بازه تاریخ
          {openDateFilter && (
            <div className="date-range-filter-menu">
              <p>بازه تاریخ: {formatPersianDate(dateRange[0])} - {formatPersianDate(dateRange[1])}</p>
              <Slider
                className="date-slider"
                value={dateRange}
                min={minDate}
                max={maxDate}
                step={1}
                onChange={setDateRange}
                pearling
                minDistance={1}
              />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="request-title-div">
        <h2 className='adminliststitle'>لیست درخواست‌ها</h2>
        <div>
          {selectedStatus && (["خریدها", "مرجوعی‌ها", "لغو شده‌ها"].includes(selectedStatus.category) && ["در حال پردازش", "تحویل داده شده", "تائید شده", "رد شده", "در حال بررسی"].includes(selectedStatus.status)) && (
            <button className="downloadbutton" title="دانلود">
              <img src={download} alt="دانلود" />
            </button>
          )}
        </div>
      </div>

      <table className="request-table">
        <thead>
          <tr>
            <th>کد</th>
            <th>درخواست‌کننده</th>
            <th>تاریخ</th>
            <th>نوع</th>
            <th>وضعیت</th>
            <th>مبلغ</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map(req => (
            <tr key={req.id} onClick={() => openModal(req)} style={{ cursor: "pointer" }}>
              <td>{req.id}</td>
              <td>{req.requester}</td>
              <td>{req.date}</td>
              <td>
                <span className={`request-type ${req.type === "خرید" ? "order" : req.type === "مرجوعی" ? "return" : "cancel"}`}>
                  {req.type}
                </span>
              </td>
              <td>
                <span className={`request-status-badge ${req.status === "رد شده" ? "rejected" : (req.status === "تائید شده" || req.status === "تحویل داده شده") ? "approved" : "pending"}`}>
                  {req.status}
                </span>
              </td>
              <td>{req.totalAmount} تومان</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>قبلی</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} className={currentPage === i + 1 ? "active-page" : ""} onClick={() => goToPage(i + 1)}>{i + 1}</button>
        ))}
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>بعدی</button>
        <div className="gooto-page-box">
          <input type="number" min="1" max={totalPages} placeholder="شماره صفحه..." value={pageInput} onChange={(e) => setPageInput(e.target.value)} />
          <button onClick={() => goToPage(Number(pageInput))}>برو</button>
        </div>
      </div>

      <RequestDetailsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} request={selectedRequest} />
    </div>
  );
}

export default RequestPage;