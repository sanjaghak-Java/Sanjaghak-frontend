import React, { useEffect, useState, useRef } from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartItem from './CartItem';
import CartPrice from './CartPrice';
import BackgroundPattern from './BackgroundPattern';
import "../styles/CartPage.css";
import Cart from '../assets/Shop.png';
import bill from '../assets/bill.png';

function CartPage() {
  const [items, setItems] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [orderId, setOrderId] = useState(null); 
  const backgroundAreaRef = useRef(null);

  const customerId = localStorage.getItem("customerId");
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const resOrders = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/Orders/getOrdersByfilter?customerId=${customerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!resOrders.ok) throw new Error("Failed to fetch orders");
        const ordersData = await resOrders.json();
        const pendingOrder = ordersData.content?.[0]; 
        if (!pendingOrder) return;

        setShippingCost(pendingOrder.shippingCost || 0);
        setOrderId(pendingOrder.orderId); 

        const resItems = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/orderItem/getOrderItemByFilter?orderId=${pendingOrder.orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!resItems.ok) throw new Error("Failed to fetch order items");
        const itemsData = await resItems.json();
        const orderItems = Array.isArray(itemsData.content) ? itemsData.content : [];

        const cartItems = await Promise.all(
          orderItems.map(async item => {
            const variantId = item.variantId?.variantId;
            if (!variantId) return null;

            const resVariant = await fetch(
              `http://127.0.0.1:8080/api/Sanjaghak/productVariants/${variantId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!resVariant.ok) throw new Error("Failed to fetch variant info");
            const variantData = await resVariant.json();

            let price = variantData.price || 0;

            try {
              const resDiscount = await fetch(
                `http://127.0.0.1:8080/api/Sanjaghak/discount/active/${variantId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (resDiscount.ok) {
                const discountData = await resDiscount.json();
                if (discountData.discountPercentage) {
                  price = price - (price * discountData.discountPercentage / 100);
                }
              }
            } catch (err) {
              console.error(err);
            }

            const productId = variantData.productId?.productId;
            let productData = {};
            let mainImage = './src/assets/default-image.png';

            if (productId) {
              const resProduct = await fetch(
                `http://127.0.0.1:8080/api/Sanjaghak/product/${productId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (resProduct.ok) productData = await resProduct.json();

              const resImages = await fetch(
                `http://127.0.0.1:8080/api/Sanjaghak/productImages/${productId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (resImages.ok) {
                const imagesData = await resImages.json();
                const primaryImage = imagesData.find(img => img.primary);
                if (primaryImage) mainImage = `http://127.0.0.1:8080${primaryImage.imageUrl}`;
              }
            }

            return {
              id: item.orderItemId,
              productname: productData.productName || "محصول",
              model: productData.model || "",
              warranty: variantData.warranty || "",
              inventory: "موجود در انبار",
              color: variantData.color || "",
              hex: variantData.hexadecimal || "#ffffff",
              price: price,
              quantity: item.quantity || 1,
              image: mainImage,
            };
          })
        );

        setItems(cartItems.filter(Boolean));
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCartItems();
  }, [customerId, token]);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <div className="background-content-wrapper" ref={backgroundAreaRef}>
        <BackgroundPattern parentRef={backgroundAreaRef} />
        <div className="cartpagecontainer" id="main-scroll-container">
<div className="itemcontainor">
  <div className="title">
    <img src={Cart} alt="cart" className='titleimg' />
    <h3 className="carttitle">سبد خرید من</h3>
  </div>

  {items.length === 0 ? (
    <div className="empty-cart">
      <p>🛒 سبد خرید شما خالی است!</p>
      <p>برای شروع خرید، محصولات مورد علاقه‌تان را اضافه کنید.</p>
    </div>
  ) : (
    <div className='items'>
      {items.map(item => (
        <CartItem
          key={item.id}
          item={item}
          onQuantityChange={(id, qty) => {
            setItems(prev =>
              prev.map(it => (it.id === id ? { ...it, quantity: qty } : it))
            );
          }}
          onDelete={id => setItems(prev => prev.filter(it => it.id !== id))}
        />
      ))}
    </div>
  )}
</div>

<div className="pricediv">
  {items.length > 0 && (
    <>
      <div className="title" id='carttitle1'>
        <img src={bill} alt="bill" className='titleimg' />
        <h3 className="carttitle">صورت حساب</h3>
      </div>
      <CartPrice
        totalPrice={totalPrice}
        shippingCost={shippingCost}
        orderId={orderId} 
      />
    </>
  )}
</div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default CartPage;