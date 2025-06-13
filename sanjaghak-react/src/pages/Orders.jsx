import React from 'react';
import "/src/styles/profile.css";
import Navbar from './navbar';    
import Footer from './Footer';  
import ProfileMenu from './ProfileMenu';
import delivered from '../assets/delivered.png';
import returned from '../assets/returned.png';
import cancel from '../assets/cancel.png';
import filter from '../assets/filter.png';
import Shop from '../assets/shop.png';

function Orders() {
  return (
    <>
    <Navbar/>
    <div className="profilecontent">
        <ProfileMenu/>
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

            
            </div>
        </div>
    </div>
    <Footer/>

    </>

  );
}

export default Orders;
