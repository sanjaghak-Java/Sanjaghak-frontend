import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartItem from './CartItem';
import CartPrice from './CartPrice';
import "../styles/CartPage.css";
import Cart from '../assets/shop.png';

function CartPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const sampleItems = [
      {
        id: 1,
        productname: 'گوشی موبایل سامسونگ',
        warranty: 'گارانتی 12 ماهه',
        inventory: 'موجود در انبار',
        color: 'قرمز',
        price: 40000000,
        quantity: 1,
        image: './src/assets/images (1).jpg',
      },
      {
        id: 2,
        productname: 'گوشی موبایل سامسونگ',
        warranty: 'گارانتی 12 ماهه',
        inventory: 'موجود در انبار',
        color: 'سفید',
        price: 25000000,
        quantity: 1,
        image: './src/assets/images (2).jpg',
      }
    ];

    setItems(sampleItems);
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const shippingCost = 400000;
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <div className="cartpagecontainer" id="main-scroll-container">
        <div className="itemcontainor">
          <div className="title">
            <img src={Cart} alt="cart" className='titleimg' />
            <h3 className="titleh">سبد خرید من</h3>
          </div>
          <div className='items'>
            {items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
              />
            ))}
          </div>
        </div>

        <div className="pricediv">
            <h3 className="title">صورت حساب</h3>
          <CartPrice totalPrice={totalPrice} shippingCost={shippingCost} />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default CartPage;
