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

  const orders = [
    {
      id: 1,
      orderNumber: '1001',
      orderDate: '1404/04/15',
      deliveryDate: '1404/05/04',
      amount: 250000,
      status: 'تحویل شده',
      product: {
        title: 'گوشی موبایل سامسونگ مدل A14',
        image: phone,
        color: 'آبی',
        colorCode: 'blue',
        category: 'موبایل',
        price: 1200000
      }
    },
    {
      id: 2,
      orderNumber: '1002',
      orderDate: '1404/04/16',
      deliveryDate: '1404/04/21',
      amount: 120000,
      status: 'لغو شده',
      product: {
        title: 'هدفون بی‌سیم شیائومی',
        image: phone,
        color: 'قرمز',
        colorCode: 'red',
        category: 'هدفون',
        price: 800000
      }
    },
    {
      id: 3,
      orderNumber: '1003',
      orderDate: '1404/04/17',
      deliveryDate: '1404/04/22',
      amount: 300000,
      status: 'مرجوع شده',
      product: {
        title: 'ساعت هوشمند هواوی',
        image: phone,
        color: 'مشکی',
        colorCode: 'black',
        category: 'ساعت هوشمند',
        price: 1500000
      }
    },
    {
      id: 4,
      orderNumber: '1004',
      orderDate: '1404/04/25',
      deliveryDate: '1404/05/01',
      amount: 180000,
      status: 'در جریان',
      product: {
        title: 'لپ تاپ ایسوس مدل X515',
        image: phone,
        color: 'نقره‌ای',
        colorCode: 'silver',
        category: 'لپ‌تاپ',
        price: 22000000
      }
    },
  ];

  const deliveredCount = orders.filter(order => order.status === 'تحویل شده').length;
  const returnedCount = orders.filter(order => order.status === 'مرجوع شده').length;
  const canceledCount = orders.filter(order => order.status === 'لغو شده').length;
  const inProgressCount = orders.filter(order => order.status === 'در جریان').length;

  const [statusFilter, setStatusFilter] = useState('همه');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState(orders);

  const getStatusClass = (status) => {
    switch (status) {
      case 'لغو شده':
        return 'status canceled';
      case 'تحویل شده':
        return 'status delivered';
      case 'مرجوع شده':
        return 'status returned';
      case 'در جریان':
        return 'status inprogress';
      default:
        return 'status';
    }
  };

  useEffect(() => {
    const filtered = orders.filter(order => {
      const matchStatus = statusFilter === 'همه' || order.status === statusFilter;

      let matchDate = true;

      const orderDateObj = new DateObject({
        date: order.orderDate,
        calendar: persian,
        locale: persian_fa,
        format: "YYYY/MM/DD"
      });

      const orderYMD = orderDateObj.format("YYYY/MM/DD");
      const fromYMD = fromDate?.format("YYYY/MM/DD");
      const toYMD = toDate?.format("YYYY/MM/DD");

      if (fromDate && orderYMD < fromYMD) {
        matchDate = false;
      }

      if (toDate && orderYMD > toYMD) {
        matchDate = false;
      }

      return matchStatus && matchDate;
    });

    setFilteredOrders(filtered);
  }, [statusFilter, fromDate, toDate]);


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
                {filteredOrders.length === 0 ? (
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
                        <tr key={order.id}>
                          <td>{index + 1}</td>
                          <td>{order.orderNumber}</td>
                          <td>{order.orderDate}</td>
                          <td>{(order.status === 'لغو شده' || order.status === 'در جریان') ? '' : order.deliveryDate}</td>
                          <td>{order.amount.toLocaleString()} تومان</td>
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
