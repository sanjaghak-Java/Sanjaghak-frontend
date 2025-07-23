import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ImageCard from "./AddProductImageCard"; // Your existing ImageCard component
import "/src/styles/productdetail.css";
import warranty from "../assets/tools-wench-ruler.png";
import box from "../assets/box.png";

function ProductDetail({ product, onAddToCart }) {
  // Use product images as files or URLs -- here assuming URLs
  // We track main image index + preview URLs for side images (same as product.images)

  const [mainImageIndex, setMainImageIndex] = useState(0);

  // For this example, treat product.images as array of {src, colorName, hex}
  const [mainImagePreview, setMainImagePreview] = useState(product.images[0]?.src || null);
  const [sideImagesPreview, setSideImagesPreview] = useState(product.images.map(img => img.src));

  const [qty, setQty] = useState(0);

  const productInfo = {
    warrantyText: "دارای گارانتی 12 ماهه",
    stockText: "موجود در انبار",
  };

  useEffect(() => {
    if (product.images[mainImageIndex]) {
      setMainImagePreview(product.images[mainImageIndex].src);
    }
  }, [mainImageIndex, product.images]);

  const handleMainImageSelect = (file) => {
    // If you want to support file upload here, implement preview update and uploading logic
    // For now, no upload, just ignore
  };

  const handleSideImageClick = (index) => {
    setMainImageIndex(index);
  };

  const handleAddToCart = () => {
    setQty(1);
    onAddToCart?.();
  };
  const inc = () => setQty((p) => p + 1);
  const dec = () => setQty((p) => (p > 1 ? p - 1 : 0));

  const discountPercent = product.discountPercent ?? 0;
  const basePrice = product.basePrice ?? 0;
  const finalPrice = product.finalPrice ?? 0;

  return (
    <div className="head-cart">
      <div className="product">
        <div className="images" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Main ImageCard */}
          <div style={{ width: 400, height: 320, margin: "0 auto" }}>
<ImageCard
  key={idx}
  image={src}
  width={100}
  height={80}
  title={`تصویر شماره ${idx + 1}`}
  onClick={() => handleSideImageClick(idx)}
  onFileSelect={() => {}}
  style={{ border: idx === mainImageIndex ? "2px solid #e75454" : undefined }}
/>
          </div>

          {/* Side Images Cards */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            {sideImagesPreview.map((src, idx) => (
              <ImageCard
                key={idx}
                image={src}
                width={100}
                height={80}
                title={`تصویر شماره ${idx + 1}`}
                onFileSelect={() => {}}
                // Clicking sets main image index
                onClick={() => handleSideImageClick(idx)}
                style={{ border: idx === mainImageIndex ? "2px solid #e75454" : undefined }}
              />
            ))}
          </div>
        </div>

        <div className="information">
          <div className="brand">
            <img src={`/src/assets/${product.brand.logo}`} alt="brand" className="brand-img" />
            <label className="brand-name">{product.brand.name}</label>
          </div>

          <h2 className="product-name">{product.title}</h2>

          <p className="product-information-title">رنگبندی :</p>
          {product.colors.map((color, i) => (
            <div className="product-color" key={i}>
              <span className="product-color-show" style={{ backgroundColor: color.hex }} />
              <label className="product-color-name">{color.name}</label>
            </div>
          ))}

          <hr className="hr" />

          <p className="product-information-title">ویژگی‌ها :</p>
          <div className="features-container">
            {product.features.map((feat, i) => (
              <div className="features" key={i}>
                <label className="features-title">{feat.label}</label>
                <label className="features-inf">{feat.value}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="icons-container">
          <Link>
            <img src="/src/assets/icons8-like-50.png" alt="like" className="like" />
          </Link>
        </div>
      </div>

      <div className="pay-part">
        <div id="pay-containor" style={{ marginTop: "8px" }}>
          <label className="product-nameprice">{product.title}</label>
          <div className="product-color selected-color">
            <span
              className="product-color-show"
              style={{ backgroundColor: product.images[mainImageIndex].hex }}
            />
            <label className="product-color-name">
              {product.images[mainImageIndex].colorName}
            </label>
          </div>
        </div>

        <hr style={{ margin: "5px 10px" }} />

        <div className="value-div">
          <div className="value-parts">
            <img src={warranty} alt="گارانتی" className="warrantyimg" />
            <label className="valuelabel">{productInfo.warrantyText}</label>
          </div>
          <div className="value-parts">
            <img src={box} alt="انبار" className="warrantyimg" />
            <label className="valuelabel">{productInfo.stockText}</label>
          </div>
        </div>

        <hr style={{ margin: "5px 10px" }} />

        <div className="price">
          {discountPercent > 0 && (
            <div className="discount">
              <div className="discount-percent">
                <label className="discount-percent-num">{discountPercent}%</label>
              </div>
              <label className="base-price">{basePrice.toLocaleString()}</label>
            </div>
          )}
          <div className="final-price">
            <img src="./src/assets/toman.png" alt="تومان" className="toman" />
            <label className="final-price-num">{finalPrice.toLocaleString()}</label>
          </div>
        </div>

        <div className="buy-box">
          {qty === 0 ? (
            <button className="buy-button" onClick={handleAddToCart}>
              افزودن به سبد خرید
            </button>
          ) : (
            <div style={{ display: "flex" }}>
              <div className="qty-controller">
                <button className="qty-btn" onClick={inc}>+</button>
                <span className="qty-num">{qty}</span>
                <button className="qty-btn" onClick={dec}>−</button>
              </div>
              <button className="go-to-cart-page">مشاهده سبد خرید</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;