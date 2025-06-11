import React from 'react';
import '/src/styles/footer.css';
import { Link, useNavigate } from 'react-router-dom';
import marker from '../assets/marker-pin.png';
import Instagram from '../assets/Instagram.png';
import Delivery from '../assets/Delivery.png';
import box from '../assets/box.png';
import checkmark from '../assets/checkmark.png';
import logo from '../assets/sanjaghak-logo.png';


const Footer = () => {
  return (
    <footer className='footer'>
      <div className="circle"></div>
      <img src={logo} alt="Logo" className="logo-img" />

      <section className="section">
        <div className="Services">
          <p>تلفن پشتیبانی : 33340081-041</p>
          <br />
          <div style={{ display: 'flex' }}>
            <p>همراه ما باشید</p>
            <div className="icon">
              <Link>
                <img src={marker} alt="marker" className="marker-img" />
              </Link>
              <Link>
                <img src={Instagram} alt="Instagram" className="marker-img" />
              </Link>
            </div>
          </div>
        </div>

        <div className="Services">
          <p>خدمات مشتریان</p>
          <br />
          <Link to="/target-path" className="link-footer">شرایط و قوانین</Link>
          <br /><br />
          <Link to="/target-path" className="link-footer">سوالات متداول</Link>
        </div>

        <div className="Services">
          <p>درباره ما</p>
          <br />
          <Link to="/Aboutus" className="link-footer">معرفی فروشگاه</Link>
          <br /><br />
          <Link to="/target-path" className="link-footer">تماس با ما</Link>
        </div>
      </section>

      <div className="custom-hr"></div>

      <div className="service">
        <div className="service-part">
          <img src={Delivery} alt="" className="marker-img" />
          <div>
            <p>ارسال سریع</p>
            <p className="more">در کمترین زمان ممکن</p>
          </div>
        </div>

        <span>- - - - - - - - - </span>

        <div className="service-part">
          <img src={checkmark} alt="" className="marker-img" />
          <div>
            <p>ضمانت بازگشت کالا</p>
            <p className="more">حداکثر 10 روز کاری</p>
          </div>
        </div>

        <span>- - - - - - - - - </span>

        <div className="service-part">
          <img src={box} alt="" className="marker-img" />
          <div>
            <p>اصالت کالا</p>
            <p className="more">از بهترین برند ها</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
