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

  return (
    <>
      <Navbar />

      <ProductDetail onAddToCart={handleAddToCart} />

      <hr className="hr-side" />

      <ProductIntroduction />

      <p className="Information-title">مشخصات</p>

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
