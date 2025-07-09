import React, { useState, useEffect } from 'react';
import '/src/styles/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import UserMenu from "./UserMenu";
import logo from '../assets/sanjaghak-logo.png';
import searchIcon from '../assets/search.png';
import cartIcon from '../assets/icons8-cart-64.png';
import justifyIcon from '../assets/justify.png';
import newIcon from '../assets/icons8-new-32.png';
import cupIcon from '../assets/cup-2.png';

function Navbar() {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goToSignIn = () => {
    navigate("/signin");
    setMobileMenuOpen(false);
  };

  const goTomycart = () => {
    navigate("/mycart");
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
    return () => (document.body.style.overflow = 'auto');
  }, [isMobileMenuOpen]);

  return (
    <div className='navContainer'>
      <div className='upperNav'>
        <Link to="/">
          <img src={logo} alt="logo" className='logonav' />
        </Link>

        <button className="mobileMenuButton" onClick={toggleMobileMenu}>
          <img src={justifyIcon} alt="menu" width="30" />
        </button>

        <div className={`searchContainer ${isFocused ? 'focused' : ''}`}>
          <input
            type="text"
            className="searchBar"
            placeholder="جستجوی محصول"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <button className="searchBtn">
            <img src={searchIcon} alt="search" />
          </button>
        </div>

        <div className='userActions'>
          <button className='loginBtn' onClick={goToSignIn}>
            ثبت نام<span className='space'>|</span>ورود
          </button>

          <UserMenu />

          <div className='cart-navbar'>
            <button className='cartbutton' onClick={goTomycart}>
              <label htmlFor="" className='cart-num'>1</label>
              <img src={cartIcon} alt="cart" className='cartIcon' />
            </button>
          </div>
        </div>
      </div>

      <div className='lowerNav'>
        <div className="dropDownContainer">
          <div className="itemnav">
            <div className="itemContentnav">
              <img src={justifyIcon} alt="" className="iconnav" />
              <span className="itemTextnav">دسته بندی کالا ها</span>
            </div>
          </div>

          <div className="dropDown">
            <div className="dropDownItem">
              <Link to="/productCategory" className='dropDownItem-title'>لپتاپ</Link>
              <div className="subDropDown">
                <Link to="/productCategory" className='category-choise-all'>همه لپتاپ ها</Link>
                <Link to="/productCategory">ایسوس</Link>
                <Link to="/productCategory">لنوو</Link>
              </div>
            </div>

            <div className="dropDownItem">
              <Link to="/productCategory" className='dropDownItem-title'>موبایل</Link>
              <div className="subDropDown">
                <Link to="/productCategory" className='category-choise-all'>همه موبایل ها</Link>
                <Link to="/productCategory">سامسونگ</Link>
                <Link to="/productCategory">آیفون</Link>
              </div>
            </div>

            <div className="dropDownItem">
              <Link to="/productCategory" className='dropDownItem-title'>هدفون</Link>
              <div className="subDropDown">
                <Link to="/productCategory" className='category-choise-all'>همه هدفون ها</Link>
                <Link to="/productCategory">سیمی</Link>
                <Link to="/productCategory">بی سیم</Link>
              </div>
            </div>

            <div className="dropDownItem">
              <Link to="/productCategory" className='dropDownItem-title'>ساعت هوشمند</Link>
              <div className="subDropDown">
                <Link to="/productCategory" className='category-choise-all'>همه ساعت ها</Link>
                <Link to="/productCategory">اپل</Link>
                <Link to="/productCategory">سامسونگ</Link>
              </div>
            </div>
          </div>
        </div>

        <div className='navItem'>
          <Link to="/#newest" className='itemnav'>
            <div className='itemContentnav'>
              <img src={newIcon} alt="" className='iconnav' />
              <span className='itemTextnav'>جدید ترین</span>
            </div>
          </Link>
        </div>

        <div className='navItem'>
          <Link to="/#bestseller" className='itemnav'>
            <div className='itemContentnav'>
              <img src={cupIcon} alt="" className='iconnav' />
              <span className='itemTextnav'>پرفروش‌ترین‌ها</span>
            </div>
          </Link>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobileOverlay active" onClick={toggleMobileMenu}></div>
      )}

      <div className={`mobileDrawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <button className="closeBtn" onClick={toggleMobileMenu}>×</button>
        <Link to="/" id="logonavlink">
          <img src={logo} alt="logo" className='logonav' />
        </Link>

        <div className="usermenucontainer">
          <button className='loginBtn' onClick={goToSignIn}>
            ثبت نام<span className='space'>|</span>ورود
          </button>
        </div>

        <div className="menuitemcontainor">
          <UserMenu />
          <div className='cart-navbar'>
            <button className='cartbutton' onClick={goTomycart}>
              <label htmlFor="" className='cart-num'>1</label>
              <img src={cartIcon} alt="cart" className='cartIcon' />
            </button>
          </div>
        </div>

        <hr />
        <strong>دسته‌بندی‌ها</strong>
        <Link to="/productCategory">لپتاپ</Link>
        <Link to="/productCategory">موبایل</Link>
        <Link to="/productCategory">هدفون</Link>
        <Link to="/productCategory">ساعت هوشمند</Link>

        <hr />
        <Link to="/#newest">جدیدترین‌ها</Link>
        <Link to="/#bestseller">پرفروش‌ترین‌ها</Link>
      </div>
    </div>
  );
}

export default Navbar;
