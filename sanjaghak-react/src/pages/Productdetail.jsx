import { useState } from "react";
import { Link } from "react-router-dom";
import "/src/styles/productdetail.css";
import warranty from "../assets/tools-wench-ruler.png";
import box from "../assets/box.png";
import toman from "../assets/Toman.png";


function ImageModal({ images, currentIndex, onClose, onChangeImage, title }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="images-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <label className="model-product-name">{title}</label>
        <div className="images-containor">
          <div className="modal-thumbnails">
            {images.map((img, i) => (
              <img
                key={i}
                src={`/src/assets/${img.src}`}
                alt={img.colorName}
                className={`modal-thumb-img ${i === currentIndex ? "active" : ""}`}
                onClick={() => onChangeImage(i)}
              />
            ))}
          </div>

          <div className="main-image">
            <img
              src={`/src/assets/${images[currentIndex].src}`}
              alt="تصویر بزرگ"
              className="modal-main-img"
            />
            <label className="product-color-name2">{images[currentIndex].colorName}</label>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetail({ product, onAddToCart }) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qty, setQty] = useState(0);

  const productInfo = {
    warrantyText: "دارای گارانتی 12 ماهه",
    stockText: "موجود در انبار",
  };

  const openModal = (index) => {
    setMainImageIndex(index);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

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
        <div className="images">
          <img
            src={`/src/assets/${product.images[mainImageIndex].src}`}
            alt={product.images[mainImageIndex].colorName}
            className="product-img"
            onClick={() => openModal(mainImageIndex)}
            style={{ cursor: "pointer" }}
          />

          <div className="miniimg-container">
            {product.images.slice(0, 3).map((img, i) => (
              <div
                className="miniimg-wrapper"
                key={i}
                onClick={() => setMainImageIndex(i)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={`/src/assets/${img.src}`}
                  alt={img.colorName}
                  className="product-miniimg"
                  onClick={() => openModal(i)}
                />
              </div>
            ))}

            {product.images.length > 3 && (
              <div
                id="more-miniimg-wrapper"
                onClick={() => openModal(3)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src="/src/assets/icons8-images-folder-50.png"
                  alt="تصاویر بیشتر"
                  id="more-product-miniimg"
                />
                <label id="more-miniimg-label">
                  +{product.images.length - 3} تصویر
                </label>
              </div>
            )}
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

        <div className="price-mainpage">
          {discountPercent > 0 && (
            <div className="discount">
              <div className="discount-percent">
                <label className="discount-percent-num">{discountPercent}%</label>
              </div>
              <label className="base-price">{basePrice.toLocaleString()}</label>
            </div>
          )}
          <div className="final-price">
            <img src={toman} alt="تومان" className="toman" />
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

      {isModalOpen && (
        <ImageModal
          images={product.images}
          currentIndex={mainImageIndex}
          onClose={closeModal}
          onChangeImage={setMainImageIndex}
          title={product.title}
        />
      )}
    </div>
  );
}

export default ProductDetail;
