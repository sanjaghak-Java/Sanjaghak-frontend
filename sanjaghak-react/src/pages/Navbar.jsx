import React, { useEffect, useState } from 'react';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
const [brandsByCategory, setBrandsByCategory] = useState({});
const [loadingBrandsFor, setLoadingBrandsFor] = useState(null);
const [categories, setCategories] = useState([]);
const [categoryLoading, setCategoryLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState("");
const [cartItemCount, setCartItemCount] = useState(0); 
const customerId = localStorage.getItem("customerId")
const token = localStorage.getItem("token")
  const fetchCartCount = async () => {
    if (!token) return;
    try {
      const resOrders = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/Orders/getOrdersByfilter?customerId=${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!resOrders.ok) throw new Error("Failed to fetch orders");
      const ordersData = await resOrders.json();
      const pendingOrder = ordersData.content?.[0];
      if (!pendingOrder) {
        setCartItemCount(0);
        return;
      }

      const resItems = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/orderItem/getOrderItemByFilter?orderId=${pendingOrder.orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!resItems.ok) throw new Error("Failed to fetch order items");
      const itemsData = await resItems.json();
      const orderItems = Array.isArray(itemsData.content) ? itemsData.content : [];
      setCartItemCount(orderItems.length); 
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) fetchCartCount(); 
  }, [token]);
const handleSearch = () => {
  if (searchTerm.trim()) {
    navigate(`/productSearch?productName=${encodeURIComponent(searchTerm.trim())}`);
    setMobileMenuOpen(false);
  }
};
const fetchBrandsForCategory = (categoryId) => {
  if (brandsByCategory[categoryId]) return; 

  setLoadingBrandsFor(categoryId);

  fetch(`http://127.0.0.1:8080/api/Sanjaghak/product/brands-by-category/${categoryId}`)
    .then((res) => {
      if (!res.ok) throw new Error("خطا در دریافت برندها");
      return res.json();
    })
    .then((data) => {
      setBrandsByCategory((prev) => ({
        ...prev,
        [categoryId]: data,
      }));
    })
    .catch((err) => {
      console.error("دریافت برندها ناموفق بود:", err);
    })
    .finally(() => {
      setLoadingBrandsFor(null);
    });
};
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/api/Sanjaghak/categories/getActiveCategory");
      if (!response.ok) throw new Error("خطا در دریافت دسته‌بندی‌ها");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("دریافت دسته‌بندی‌ها ناموفق بود:", error);
    } finally {
      setCategoryLoading(false);
    }
  };

  fetchCategories();
}, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

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
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  onKeyDown={(e) => e.key === "Enter" && handleSearch()} 
/>
<button className="searchBtn" onClick={handleSearch}>
  <img src={searchIcon} alt="search" />
</button>
        </div>

        <div className='userActions'>
          {!isLoggedIn ? (
            <button className='loginBtn' onClick={goToSignIn}>
              ثبت نام<span className='space'>|</span>ورود
            </button>
          ) : (
            <UserMenu />
          )}

<div className='cart-navbar'>
  <button className='cartbutton' onClick={goTomycart}>
    <label className='cart-num'>{cartItemCount}</label> 
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
{categories.map((category) => (
  <div
    className="dropDownItem"
    key={category.categoryId}
    onMouseEnter={() => {
      setHoveredCategoryId(category.categoryId);
      fetchBrandsForCategory(category.categoryId);
    }}
  >
    <Link
      to={`/productCategory?category=${category.categoryId}`}
      className="dropDownItem-title"
    >
      {category.categoryName}
    </Link>

    <div className="subDropDown">
      {loadingBrandsFor === category.categoryId ? (
        <p>در حال بارگذاری برندها...</p>
      ) : (
        (brandsByCategory[category.categoryId] || []).map((brand) => (
          <Link
            key={brand.brandId}
            to={`/productCategory?category=${category.categoryId}&brand=${brand.brandId}`}
          >
            {brand.brandName}
          </Link>
        ))
      )}
    </div>
  </div>
))}
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
          {!isLoggedIn ? (
            <button className='loginBtn' onClick={goToSignIn}>
              ثبت نام<span className='space'>|</span>ورود
            </button>
          ) : (
            <UserMenu />
          )}
        </div>

        <div className="menuitemcontainor">
          <div className='cart-navbar'>
            <button className='cartbutton' onClick={goTomycart}>
              <label className='cart-num'>1</label>
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