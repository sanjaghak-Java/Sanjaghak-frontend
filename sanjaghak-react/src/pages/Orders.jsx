import React, { useRef, useState, useEffect } from 'react';
import OrderDetailsModal from './OrderDetailsModal';
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import "/src/styles/ProfileOrders.css";
import Navbar from './Navbar';
import Footer from './Footer';
import ProfileMenu from './ProfileMenu';
import delivered from '../assets/delivered.png';
import returned from '../assets/returned.png';
import cancel from '../assets/cancel.png';
import current from '../assets/current.png';
import Shop from '../assets/shopping-bag.png';
import more from '../assets/more.png';
import BackgroundPattern from './BackgroundPattern';
import phone from "../assets/images (1).jpg";

function Orders() {
  const backgroundAreaRef = useRef(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('همه');
  const [fromDate, setFromDate] = useState(null); // DateObject (persian)
  const [toDate, setToDate] = useState(null);     // DateObject (persian)
  const [filteredOrders, setFilteredOrders] = useState([]);

  const customerId = "4e50c879-baec-4cdb-820f-01192dca08d9";

  // Robust, case-insensitive status mapping
  const mapStatus = (status) => {
    if (!status && status !== "") return status;
    const s = String(status).toLowerCase();
    if (s === "processing") return "در جریان";
    if (s === "delivered") return "تحویل شده";
    if (s === "cancel" || s === "canceled" || s === "cancelled") return "لغو شده";
    if (s === "pending") return null; // hide pending
    return status;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // 1) Fetch orders
        const response = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/Orders/getOrdersByfilter?customerId=${customerId}`
        );
        const data = await response.json();

        const mappedOrders = (data.content || [])
          .map((order) => {
            const status = mapStatus(order.orderStatus);
            if (!status) return null; // skip pending

            const orderDateObj = order.createdAt ? new Date(order.createdAt) : null;
            const deliveryDateObj = order.updatedAt ? new Date(order.updatedAt) : null;

            return {
              id: order.orderId,
              orderNumber: order.orderNumber,
              // Persian strings for UI
orderDate: orderDateObj
  ? new DateObject({ date: orderDateObj, calendar: persian, locale: persian_fa }).format("YYYY/MM/DD")
  : "",
deliveryDate: deliveryDateObj
  ? new DateObject({ date: deliveryDateObj, calendar: persian, locale: persian_fa }).format("YYYY/MM/DD")
  : "",
              // JS Date objects for filtering/comparison
              orderDateObj,
              deliveryDateObj,
              amount: Number(order.totalAmount) || 0,
              status,
              product: {
                title: "محصول خریداری شده", // placeholder; modal fetches real product
                image: phone,
                color: "مشکی",
                colorCode: "black",
                category: "نامشخص",
                price: Number(order.totalAmount) || 0
              }
            };
          })
          .filter(Boolean);

        // 2) Fetch returns for user (requires auth token)
        const token = localStorage.getItem("token");
        const returnRes = await fetch(
          "http://127.0.0.1:8080/api/Sanjaghak/return/getAllReturnByUserId",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          }
        );

        let returnOrders = [];
        if (returnRes.ok) {
          const returnData = await returnRes.json();
          returnOrders = (returnData || [])
            .filter(r => String(r.returnStatus).toUpperCase() !== "PENDING") // skip pending returns
            .map(r => {
              const rDateObj = r.createdAt ? new Date(r.createdAt) : null;
              return {
                id: r.orderId?.orderId || `ret-${r.returnId}`,
                orderNumber: r.returnNumber || `RET-${r.returnId}`,
                orderDate: rDateObj ? new DateObject(rDateObj).format("YYYY/MM/DD", persian, persian_fa) : "",
                orderDateObj: rDateObj,
                deliveryDate: "",
                deliveryDateObj: null,
                amount: 0,
                status: "مرجوع شده",
                product: {
                  title: "محصول مرجوعی",
                  image: phone,
                  color: "-",
                  colorCode: "black",
                  category: "-",
                  price: 0
                }
              };
            });
        }

        const allOrders = [...mappedOrders, ...returnOrders];
        setOrders(allOrders);
        setFilteredOrders(allOrders);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch orders/returns:", err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter using JS Date objects (convert Persian DateObject to JS Date)
useEffect(() => {
  const filtered = orders.filter(order => {
    const matchStatus = statusFilter === 'همه' || order.status === statusFilter;
    if (!matchStatus) return false;

    // If no date filters, accept it
    if (!fromDate && !toDate) return true;

    // Ensure we’re comparing Gregorian dates
    const orderDt = order.orderDateObj; // plain JS Date (Gregorian)
    if (!orderDt) return false;

    const fromGregorian = fromDate
      ? fromDate.toDate() // convert Persian DateObject -> JS Date (Gregorian)
      : null;
    const toGregorian = toDate
      ? toDate.toDate()
      : null;

    // Make to-date inclusive (end of day)
    if (toGregorian) toGregorian.setHours(23, 59, 59, 999);

    if (fromGregorian && orderDt < fromGregorian) return false;
    if (toGregorian && orderDt > toGregorian) return false;

    return true;
  });

  setFilteredOrders(filtered);
}, [statusFilter, fromDate, toDate, orders]);

  // Status counts (based on merged list)
  const deliveredCount = orders.filter(o => o.status === 'تحویل شده').length;
  const returnedCount = orders.filter(o => o.status === 'مرجوع شده').length;
  const canceledCount = orders.filter(o => o.status === 'لغو شده').length;
  const inProgressCount = orders.filter(o => o.status === 'در جریان').length;

  const getStatusClass = (status) => {
    switch (status) {
      case 'لغو شده': return 'status canceled';
      case 'تحویل شده': return 'status delivered';
      case 'مرجوع شده': return 'status returned';
      case 'در جریان': return 'status inprogress';
      default: return 'status';
    }
  };

  return (
    <>
      <Navbar />
      <div className="background-content-wrapper" ref={backgroundAreaRef}>
        <BackgroundPattern parentRef={backgroundAreaRef} />

        <div className="profilecontent">
          <ProfileMenu />
          <div className="orderdiv">
            <div className="border">
              {[
                { icon: delivered, label: 'تحویل شده', count: deliveredCount },
                { icon: returned, label: 'مرجوعی', count: returnedCount },
                { icon: cancel, label: 'لغو شده', count: canceledCount },
                { icon: current, label: 'در جریان', count: inProgressCount },
              ].map(({ icon, label, count }) => (
                <div className="statusparts" key={label}>
                  <img src={icon} alt="" className="statusicons" />
                  <div className='statusdiv'>
                    <p>{label}</p>
                    <div>
                      <label className='description'>{count}</label>
                      <label className='description'>سفارش</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='bordertwo'>
              <div className='titleprofile'>
                <img src={Shop} alt="" className='titleimg' />
                <h3 className='titlehprof'>تاریخچه سفارشات</h3>
              </div>
              <br />
              <hr />
              <br />

              <div className="filterpart">
                <div>
                  <label htmlFor="selectBox" className="formlabel">وضعیت</label>
                  <select
                    id="selectBox"
                    className="customselect"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="همه">همه موارد</option>
                    <option value="در جریان">جاری</option>
                    <option value="تحویل شده">تحویل شده</option>
                    <option value="مرجوع شده">مرجوعی</option>
                    <option value="لغو شده">لغو شده</option>
                  </select>
                </div>

                <div>
                  <label className="formlabel">از تاریخ</label>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={fromDate}
                    onChange={setFromDate}
                    format="YYYY/MM/DD"
                    style={{ direction: "rtl", padding: "22px", fontFamily: "Traffic", border: "2px solid #ccc", borderRadius: "8px", width:"200px"}}
                    className="custom-date-picker"
                    placeholder="از تاریخ"
                  />
                </div>

                <div>
                  <label className="formlabel">تا تاریخ</label>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={toDate}
                    onChange={setToDate}
                    format="YYYY/MM/DD"
                    style={{ direction: "rtl", padding: "22px", fontFamily: "Traffic", border: "2px solid #ccc", borderRadius: "8px", width:"200px"}}
                    className="custom-date-picker"
                    placeholder="تا تاریخ"
                  />
                </div>
              </div>

              <div className="orderTableContainer">
                {loading ? (
                  <p>در حال بارگذاری سفارشات...</p>
                ) : filteredOrders.length === 0 ? (
                  <p className="noOrdersMessage">لیست سفارش های شما خالی است.</p>
                ) : (
                  <table className="orderTable">
                    <thead>
                      <tr>
                        <th>ردیف</th>
                        <th>شماره سفارش</th>
                        <th>تاریخ ثبت</th>
                        <th>تاریخ تحویل</th>
                        <th>مبلغ</th>
                        <th>وضعیت</th>
                        <th>جزئیات بیشتر</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order, index) => (
                        <tr key={`${order.id}_${index}`}>
                          <td>{index + 1}</td>
                          <td>{order.orderNumber}</td>
                          {/* display Persian strings */}
                          <td>{order.orderDate}</td>
                          <td>{(order.status === 'لغو شده' || order.status === 'در جریان') ? '' : order.deliveryDate}</td>
                          <td>{(order.amount || 0).toLocaleString()} تومان</td>
                          <td><span className={getStatusClass(order.status)}>{order.status}</span></td>
                          <td>
                            <button className="profile-more-button" onClick={() => setSelectedOrder(order)}>
                              <img src={more} alt="" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}

        <Footer />
      </div>
    </>
  );
}

export default Orders;