import React, { useRef } from 'react';
import "/src/styles/ProfileOrders.css";
import Navbar from './Navbar';
import Footer from './Footer';
import ProfileMenu from './ProfileMenu';
import delivered from '../assets/delivered.png';
import returned from '../assets/returned.png';
import cancel from '../assets/cancel.png';
import filter from '../assets/filter.png';
import Shop from '../assets/shopping-bag.png';
import BackgroundPattern from './BackgroundPattern';

function Orders() {
  const backgroundAreaRef = useRef(null);

  const orders = [
    { id: 1, orderNumber: '1001', date: '1403/04/15', amount: 250000, status: 'تحویل شده' },
    { id: 2, orderNumber: '1002', date: '1403/04/16', amount: 120000, status: 'لغو شده' },
    { id: 3, orderNumber: '1003', date: '1403/04/17', amount: 300000, status: 'مرجوع شده' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'لغو شده':
        return 'status canceled';
      case 'تحویل شده':
        return 'status delivered';
      case 'مرجوع شده':
        return 'status returned';
      default:
        return 'status';
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
              <div className="statusparts">
                <img src={delivered} alt="" className="statusicons" />
                <div className='statusdiv'>
                  <p>تحویل شده</p>
                  <div>
                    <label className='description'>5</label>
                    <label className='description'>سفارش</label>
                  </div>
                </div>
              </div>

              <div className='statusparts'>
                <img src={returned} alt="" className="statusicons" />
                <div className='statusdiv'>
                  <p>مرجوعی</p>
                  <div>
                    <label className='description'>5</label>
                    <label className='description'>سفارش</label>
                  </div>
                </div>
              </div>

              <div className='statusparts'>
                <img src={cancel} alt="" className="statusicons" />
                <div className='statusdiv'>
                  <p>لغو شده</p>
                  <div>
                    <label className='description'>5</label>
                    <label className='description'>سفارش</label>
                  </div>
                </div>
              </div>
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
                  <select id="selectBox" className="customselect">
                    <option value="1">همه موارد</option>
                    <option value="2">تحویل شده</option>
                    <option value="3">مرجوعی</option>
                    <option value="4">لغو شده</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fromDate" className="formlabel">از تاریخ</label>
                  <input type="date" id="fromDate" className="customdate" />
                </div>

                <div>
                  <label htmlFor="toDate" className="formlabel">تا تاریخ</label>
                  <input type="date" id="toDate" className="customdate" />
                </div>

                <button className='filter'>
                  <img src={filter} alt="" className='editimg' />
                  فیلتر
                </button>
              </div>

              <div className="orderTableContainer">
                {orders.length === 0 ? (
                  <p className="noOrdersMessage">لیست سفارش های شما خالی است.</p>
                ) : (
                  <table className="orderTable">
                    <thead>
                      <tr>
                        <th>ردیف</th>
                        <th>شماره سفارش</th>
                        <th>تاریخ</th>
                        <th>مبلغ</th>
                        <th>وضعیت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr key={order.id}>
                          <td>{index + 1}</td>
                          <td>{order.orderNumber}</td>
                          <td>{order.date}</td>
                          <td>{order.amount.toLocaleString()} تومان</td>
                          <td><span className={getStatusClass(order.status)}>{order.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Orders;
