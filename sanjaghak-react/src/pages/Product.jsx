import React, { useRef, useState } from 'react';
import "/src/styles/product.css";
import Navbar from "./navbar";
import Footer from "./Footer";
import ProductIntroduction from "./PorductIntroduction";
import Cartreport from './Cartreport';
import ProductDetail from "./Productdetail";
import Similarproducts from "./Similarproducts";

function Product() {
  const [showCartReport, setShowCartReport] = useState(false);

  const handleAddToCart = () => setShowCartReport(true);
  const handleCloseCartReport = () => setShowCartReport(false);

  const introRef = useRef(null);
  const specsRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref.current) {
      const navbarHeight = 80; // ارتفاع Navbar ثابت خودت را وارد کن
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = window.pageYOffset + elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <Navbar />

      <ProductDetail onAddToCart={handleAddToCart} />

      <hr className="hr-side" />

      <div className="Information">
        <input
          type="radio"
          name="section"
          value="intro"
          id="intro"
          className="Introduction"
          onChange={() => scrollToSection(introRef)}
        />
        <label htmlFor="intro" className="up-cadr">معرفی</label>

        <input
          type="radio"
          name="section"
          value="specs"
          id="specs"
          className="specs"
          onChange={() => scrollToSection(specsRef)}
        />
        <label htmlFor="specs" className="up-cadr">مشخصات</label>
      </div>

      {/* معرفی محصول */}
      <ProductIntroduction introRef={introRef} />

      {/* مشخصات محصول */}
      <p className="Information-title" ref={specsRef}>مشخصات</p>

      <div className="similar-dev">
        <hr className="hr-side" />
        <h1 className="similar-title">محصولات مشابه</h1>
        <Similarproducts />
      </div>

      {showCartReport && <Cartreport onClose={handleCloseCartReport} />}

      <Footer />
    </>
  );
}

export default Product;
