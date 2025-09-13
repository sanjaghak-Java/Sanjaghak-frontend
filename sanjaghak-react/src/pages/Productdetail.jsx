
import "/src/styles/productdetail.css";
import warranty from "../assets/tools-wench-ruler.png";
import box from "../assets/box.png";
import toman from "../assets/Toman.png";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
function ImageModal({ images, currentIndex, onClose, onChangeImage, title ,}) {
  if (!images || images.length === 0) return null;

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
                src={`${img.src}`}
                alt={img.colorName || `Image ${i + 1}`}
                className={`modal-thumb-img ${i === currentIndex ? "active" : ""}`}
                onClick={() => onChangeImage(i)}
              />
            ))}
          </div>

          <div className="main-image">
            <img
              src={`${images[currentIndex].src}`}
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

function ProductDetail({ product, onAddToCart, requiredAttributes = [] }) {
const [selectedColorIndex, setSelectedColorIndex] = useState(0);
const [qty, setQty] = useState(1);
const token = localStorage.getItem("token");
console.log(token)

const selectedVariant =
  product.variants && product.variants.length > 0
    ? product.variants[selectedColorIndex]
    : null;
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
const navigate = useNavigate();

  useEffect(() => {
    if (!token || !product?.productId) return;

    const checkFavorite = async () => {
      setLoadingFavorite(true);
      try {
        const res = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/favoritesList/check?productId=${product.productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to check favorite");
        const data = await res.json();
        setIsFavorite(data.exists);
      } catch (error) {
        console.error("Favorite check error:", error);
      } finally {
        setLoadingFavorite(false);
      }
    };

    checkFavorite();
  }, [product, token]);
    const customerId = localStorage.getItem("customerId"); 
    console.log(customerId)
  useEffect(() => {
    if (!token || !product?.productId) return;

    const checkFavorite = async () => {
      setLoadingFavorite(true);
      try {
        const res = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/favoritesList/check?productId=${product.productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to check favorite");
        const data = await res.json();
        setIsFavorite(data.exists);
      } catch (error) {
        console.error("Favorite check error:", error);
      } finally {
        setLoadingFavorite(false);
      }
    };
    checkFavorite();
  }, [product, token]);

useEffect(() => {
  if (!token || !customerId || !product?.variants) return;

  const fetchCart = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/Orders/getOrdersByfilter?customerId=${customerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      console.log("Cart data:", data); 

      const cartItems = Array.isArray(data.content) ? data.content : [];
const existingItem = cartItems.find(item => 
  product.variants.some(v => v.variantId === item.productId)
);

      if (existingItem) {
        setOrderItemId(existingItem.id || existingItem.orderItemId);
        setQty(existingItem.quantity);
      }
    } catch (error) {
      console.error("Cart fetch error:", error);
    }
  };

  fetchCart();
}, [token, customerId, product]);
  const toggleFavorite = async () => {
  if (!token || !product?.productId) {
    alert("لطفا وارد شوید"); 
    return;
  }

  setLoadingFavorite(true);
  try {
    const res = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/favoritesList/toggle?productId=${product.productId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) throw new Error("Failed to toggle favorite");
    const result = await res.text(); 

    setIsFavorite((prev) => !prev);
  } catch (error) {
    console.error("Toggle favorite error:", error);
    alert("خطا در تغییر وضعیت علاقه‌مندی");
  } finally {
    setLoadingFavorite(false);
  }
};
 const [discountPercent, setDiscountPercent] = useState(0);
const [finalPrice, setFinalPrice] = useState(
  product.variants && product.variants.length > 0
    ? product.variants[0].price ?? 0
    : 0
);
const [basePrice, setBasePrice] = useState(
  product.variants && product.variants.length > 0
    ? product.variants[0].price ?? 0  
    : 0
);
  const [stock, setStock] = useState(null); 
const [loadingStock, setLoadingStock] = useState(false);
useEffect(() => {
  if (product.variants && product.variants.length > 0) {
    const fetchInitialStockAndDiscount = async () => {
      setLoadingStock(true);
      try {
        const variant = product.variants[0];
        const resStock = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/inventoryStock/variant/${variant.variantId}/stock`
        );
        if (!resStock.ok) throw new Error("Failed to fetch stock");
        const stockCount = await resStock.json();
        setStock(stockCount);

        if (stockCount > 0) {
          const resDiscount = await fetch(
  `http://127.0.0.1:8080/api/Sanjaghak/discount/active/${variant.variantId}`
);

if (resDiscount.status === 204) {
  setDiscountPercent(0);
  setFinalPrice(variant.price ?? 0);
  setBasePrice(variant.price ?? 0);
} else if (resDiscount.ok) {
  const discountData = await resDiscount.json();
  if (discountData && discountData.discountPercentage) {
    setDiscountPercent(discountData.discountPercentage);
    const price = variant.price ?? 0;
    const discountAmount = (price * discountData.discountPercentage) / 100;
    setFinalPrice(price - discountAmount);
    setBasePrice(price);
  } else {
    setDiscountPercent(0);
    setFinalPrice(variant.price ?? 0);
    setBasePrice(variant.price ?? 0);
  }
} else {
  setDiscountPercent(0);
  setFinalPrice(variant.price ?? 0);
  setBasePrice(variant.price ?? 0);
}

        }
        

      } catch (error) {
        setStock(0);
        setDiscountPercent(0);
        setFinalPrice(product.finalPrice ?? 0);
        setBasePrice(product.basePrice ?? 0);
      } finally {
        setLoadingStock(false);
      }
    };
    fetchInitialStockAndDiscount();
  }
}, [product.variants]);
const checkVariantInCart = async (variant) => {
  if (!token || !customerId || !variant) return;

  try {
    const resOrders = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/Orders/getOrdersByfilter?customerId=${customerId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!resOrders.ok) throw new Error("Failed to fetch orders");
    const ordersData = await resOrders.json();
    
    const pendingOrder = ordersData.content?.[0]; 
    if (!pendingOrder) {
      setOrderItemId(null);
      setQty(0);
      return;
    }

    const resItems = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/orderItem/getOrderItemByFilter?orderId=${pendingOrder.orderId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!resItems.ok) throw new Error("Failed to fetch order items");
    const itemsData = await resItems.json();
    const orderItems = Array.isArray(itemsData.content) ? itemsData.content : [];

    const existingItem = orderItems.find(
      item => item.variantId.variantId === variant.variantId
    );

    if (existingItem) {
      setOrderItemId(existingItem.orderItemId);
      setQty(existingItem.quantity);
    } else {
      setOrderItemId(null);
      setQty(0);
    }
  } catch (error) {
    console.error("Cart fetch error:", error);
    setOrderItemId(null);
    setQty(0);
  }
};

useEffect(() => {
  if (selectedVariant) checkVariantInCart(selectedVariant);
}, [selectedVariant]);

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ src: "default.jpg", colorName: "default", hex: "#ccc" }];

  const colors = product.colors && product.colors.length > 0
    ? product.colors
    : [{ name: "default", hex: "#ccc" }];

const features =
  requiredAttributes.length > 0
    ? requiredAttributes.map(attr => ({
        label: attr.attributeName,
        value: attr.value,
        type:attr.attributeType
      }))
    : product.features && product.features.length > 0
      ? product.features
      : [{ label: "اطلاعات", value: "موجود نیست" }];

  const brand = product.brand || { logo: "default-logo.png", name: "نامشخص" };

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const productInfo = {
    warrantyText: "دارای گارانتی 12 ماهه",
    stockText: "موجود در انبار",
  };

  const openModal = (index) => {
    setMainImageIndex(index);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

const [orderItemId, setOrderItemId] = useState(null);

const handleAddToCart = async () => {
  if (!token || !selectedVariant) return alert("لطفا وارد شوید");
  try {
    const res = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/orderItem/orderItemRegistration?productId=${selectedVariant.variantId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: 1 }),
      }
    );
    if (!res.ok) throw new Error("Failed to add item to cart");
    const data = await res.json(); 
    setOrderItemId(data.id || data.orderItemId); 
    setQty(1);
    window.location.reload();
  } catch (err) {
    console.error(err);
    alert("خطا در افزودن به سبد خرید");
  }
};

const inc = async () => {
  if (!orderItemId) return; 
  try {
    const newQty = qty + 1;
    const res = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/orderItem/${orderItemId}`,
      {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      }
    );
    console.log(orderItemId)
    if (!res.ok) throw new Error("Failed to update quantity");
    setQty(newQty);
    
  } catch (err) {
    console.error(err);
    alert("خطا در افزایش تعداد");
  }
};

const dec = async () => {
  if (!orderItemId) return;

  if (qty <= 1) {
    try {
      const res = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/orderItem/${orderItemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete item");
      setQty(0);
      window.location.reload();
      setOrderItemId(null);
    } catch (err) {
      console.error(err);
      alert("خطا در حذف محصول از سبد خرید");
    }
  } else {
    try {
      const newQty = qty - 1;
      const res = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/orderItem/${orderItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQty }),
        }
      );
      if (!res.ok) throw new Error("Failed to update quantity");
      setQty(newQty);
    } catch (err) {
      console.error(err);
      alert("خطا در کاهش تعداد");
    }
  }
};



function cleanLogoUrl(logo) {
  if (!logo) return "/src/assets/default-logo.png";

  if (logo.startsWith("http://") || logo.startsWith("https://")) {
    const idx = logo.indexOf("http", 1); 
    if (idx > 0) {
      return logo.slice(idx);
    }
    return logo;
  }

  return `http://127.0.0.1:8080${logo}`;
}

  const currentImage = images[mainImageIndex];
  return (
    <div className="head-cart">
      <div className="product">
        <div className="images">
          <img
            src={`${currentImage.src}`}
            alt={currentImage.colorName}
            className="product-img"
            onClick={() => images.length > 0 && openModal(mainImageIndex)}
            style={{ cursor: images.length > 0 ? "pointer" : "default" }}
          />

          <div className="miniimg-container">
            {images.slice(0, 3).map((img, i) => (
              <div
                className="miniimg-wrapper"
                key={i}
                onClick={() => setMainImageIndex(i)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={`${img.src}`}
                  alt={img.colorName}
                  className="product-miniimg"
                  onClick={() => openModal(i)}
                />
              </div>
            ))}

            {images.length > 3 && (
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
                  +{images.length - 3} تصویر
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="information">
          <div className="brand">
<img
  src={cleanLogoUrl(brand.logo)}
  alt={brand.name || "brand"}
  className="brand-img"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "/src/assets/default-logo.png";
  }}
/>
            <label className="brand-name">{brand.name}</label>
          </div>

          <h2 className="product-name">{product.title || "نام محصول موجود نیست"}</h2>

          <p className="product-information-title">رنگبندی :</p>
          {colors.length > 0 ? (
colors.map((color, i) => (
  <div
    className="product-color"
    key={i}
onClick={async () => {
  setSelectedColorIndex(i);
  try {
    const resStock = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/inventoryStock/variant/${product.variants[i].variantId}/stock`
    );
    const stockCount = resStock.ok ? await resStock.json() : 0;
    setStock(stockCount);

    const resDiscount = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/discount/active/${product.variants[i].variantId}`
    );
    if (resDiscount.status === 204) {
      setDiscountPercent(0);
      setFinalPrice(product.variants[i].price ?? 0);
      setBasePrice(product.variants[i].price ?? 0);
    } else if (resDiscount.ok) {
      const discountData = await resDiscount.json();
      const price = product.variants[i].price ?? 0;
      const discountAmount = (price * (discountData.discountPercentage ?? 0)) / 100;
      setDiscountPercent(discountData.discountPercentage ?? 0);
      setFinalPrice(price - discountAmount);
      setBasePrice(price);
    } else {
      setDiscountPercent(0);
      setFinalPrice(product.variants[i].price ?? 0);
      setBasePrice(product.variants[i].price ?? 0);
    }

    checkVariantInCart(product.variants[i]);
  } catch (err) {
    console.error(err);
    setStock(0);
    setDiscountPercent(0);
    setFinalPrice(product.variants[i].price ?? 0);
    setBasePrice(product.variants[i].price ?? 0);
    setOrderItemId(null);
    setQty(0);
  }
}}
    style={{ cursor: "pointer" }}
  >
                <span
                  className={`product-color-show ${i === selectedColorIndex ? "active-border" : ""}`}
                  style={{ backgroundColor: color.hex }}
                />
                <label className="product-color-name">{color.name}</label>
              </div>
            ))
          ) : (
            <div>رنگی موجود نیست</div>
          )}

          <hr className="hr" />

          <p className="product-information-title">ویژگی‌ها :</p>
          <div className="features-container">
{features.length > 0 ? (
  features.map((feat, i) => 
    feat.value && feat.value.trim() !== "" ? (
      <div className="features" key={i}>
        <label className="features-title">{feat.label}</label>
        <label className="features-inf">{feat.value} {feat.type}</label>
      </div>
    ) : null
  )
) : (
  <div>ویژگی‌ای موجود نیست</div>
)}
          </div>
        </div>

<div className="icons-container">
  <button
    onClick={toggleFavorite}
    disabled={loadingFavorite}
    aria-label={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
    }}
  >
    <img
      src={isFavorite ? "/src/assets/icons8-like-50-red.png" : "/src/assets/icons8-like-50.png"}
      alt={isFavorite ? "محصول مورد علاقه است" : "محصول مورد علاقه نیست"}
      className="like"
    />
  </button>
</div>
      </div>

      <div className="pay-part">
        <div id="pay-containor" style={{ marginTop: "8px" }}>
          <label className="product-nameprice">{product.title || "نام محصول موجود نیست"}</label>
          <div className="product-color selected-color">
<span
  className="product-color-show"
  style={{ backgroundColor: colors[selectedColorIndex]?.hex || "#ccc" }}
/>
<label className="product-color-name">
  {colors[selectedColorIndex]?.name || "نامشخص"}
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
  {loadingStock ? (
    <div>در حال بررسی موجودی...</div>
  ) : stock > 0 ? (
    <>
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
    </>
  ) : (
    <div style={{ color: "red", fontWeight: "bold" }}>ناموجود</div>
  )}
</div>

       <div className="buy-box">
  {stock > 0 ? (
    qty === 0 ? (
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
        <button
  className="go-to-cart-page"
  onClick={() => navigate("/mycart")}
>
  مشاهده سبد خرید
</button>
      </div>
    )
  ) : (
    <></> 
  )}
</div>
      </div>

      {isModalOpen && (
        <ImageModal
          images={images}
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