import React, { useRef, useState } from "react";
import "/src/styles/product.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProductIntroduction from "./PorductIntroduction";
import Cartreport from "./Cartreport";
import ProductDetail from "./Productdetail";
import ProductSpecifications from "./ProductSpecifications";
import Similarproducts from "./Similarproducts";
import BackgroundPattern from "./BackgroundPattern";

const sampleProduct = {
  title: "سامسونگ Galaxy A53",
  brand: {
    name: "Samsung",
    logo: "instagram.png",

  },

  discountPercent: 20,
  basePrice: 100000000, 
  finalPrice: 80000000,

  images: [
    { src: "images.jpg", colorName: "مشکی", hex: "#111111" },
    { src: "images (1).jpg", colorName: "سبز", hex: "#73e1a3ff" },
    { src: "images (2).jpg", colorName: "سفید", hex: "#ffffff" },
    { src: "images (2).jpg", colorName: "سفید", hex: "#ffffff" },
    { src: "images (2).jpg", colorName: "سفید", hex: "#ffffff" },
    { src: "images (2).jpg", colorName: "سفید", hex: "#ffffff" },
    { src: "images (2).jpg", colorName: "سفید", hex: "#ffffff" },
    { src: "images (2).jpg", colorName: "سفید", hex: "#ffffff" },
    { src: "images (2).jpg", colorName: "سفید", hex: "#ffffff" },
    { src: "images (2).jpg", colorName: "سفید", hex: "#ffffff" },

  ],
  colors: [
    { name: "سفید", hex: "#ffffff" },
    { name: "مشکی", hex: "#000000" },
    { name: "سبز", hex: "#73e1a3ff" },
  ],
  features: [
    { label: "رم", value: "8GB" },
    { label: "حافظه داخلی", value: "256GB" },
    { label: "سیستم عامل", value: "Android 14" },
    { label: "وزن", value: "189 گرم" },
    { label: "ابعاد", value: "159.9 × 74.7 × 8.1 میلی‌متر" }
  ],

  warranty: "گارانتی 12 ماهه گلدیران",

  introduction: `
    گوشی‌ها هر روز زرق و برق بیشتری پیدا می‌کنند و ویژگی‌های جدیدتری را به لیست خود اضافه می‌کنند.
    گوشی موبایل سامسونگ مدل Galaxy A53 یکی از گوشی‌های محبوب بازار است که با سخت‌افزار مناسب و قیمت معقول،
    انتخاب خوبی برای کاربرانی است که به دنبال تعادل بین عملکرد و قیمت هستند.
  `,
    specifications: [
    { label: "سیستم عامل", value: "Android 14" },
    { label: "پردازنده", value: "Snapdragon 8 Gen 2" },
    { label: "پردازنده", value: "Snapdragon 8 Gen 2" },
    { label: "پردازنده", value: "Snapdragon 8 Gen 2" },
  ],
};

function Product() {
  const [showCartReport, setShowCartReport] = useState(false);
  const backgroundAreaRef = useRef(null);

  const handleAddToCart = () => setShowCartReport(true);
  const handleCloseCartReport = () => setShowCartReport(false);

  return (
    <>
      <Navbar />

      <div className="background-content-wrapper" ref={backgroundAreaRef}>
        <BackgroundPattern parentRef={backgroundAreaRef} />

        <ProductDetail product={sampleProduct} onAddToCart={handleAddToCart} />

        <hr className="hr-side" />
        <p className="Information-title">
          <span style={{color : "#dc2655"}}>●</span> معرفی
        </p>
        <ProductIntroduction text={sampleProduct.introduction} />

        <p className="Information-title">
          <span style={{color : "#dc2655"}}>●</span> مشخصات
        </p>
        <ProductSpecifications specifications={sampleProduct.specifications} />

        <div className="similar-dev">
          <hr className="hr-side" />
          <h1 className="similar-title">محصولات مشابه</h1>
          <Similarproducts />
        </div>

        {showCartReport && <Cartreport onClose={handleCloseCartReport} />}

        <Footer />
      </div>
    </>
  );
}

export default Product;
