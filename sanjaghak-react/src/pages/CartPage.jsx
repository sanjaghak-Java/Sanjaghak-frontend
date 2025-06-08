import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartItem from './CartItem';
import "../styles/CartPage.css";
import Cart from '../assets/shop.png';

function CartPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const sampleItems = [
      {
        productname: 'کالای اول',
        warranty: 'دارد',
        inventory: 'موجود در انبار',
        color: 'قرمز',
        price: 40000000,
        image: './src/assets/product1.png',
      },

    ];

    setItems(sampleItems);
  }, []);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
        <Navbar />
        <div className="cartpagecontainer">
            <div className="itemcontainor">
                <div className="title">
                    <img src={Cart} alt="" className='titleimg' />
                    <h3 className="titleh">سبد خرید</h3>
                </div>
                <br />
                <hr />
                <div className='items'>
                    {items.map(item => (
                    <CartItem key={item.id} item={item} />
                    ))}
                </div>
                </div>

                <div className="pricediv">
                    <div className="pricecontainor">
                      <div className="Totalprice">
                        <div className='pricetext'>
                          <p>قیمت کل:</p>
                        </div>
                        <div className='pricenum'>
                          
                            <label>2000000</label>
                          
                            <img src="./src/assets/toman.png" alt="تومان" className="tomanimg" />
                        </div>
                      </div>
                      <div className="Totalprice">
                        <div className='pricetext'>
                          <p>هزینه ارسال:</p>
                        </div>
                        <div className="pricenum">
                            <label>400000</label>
                            <img src="./src/assets/toman.png" alt="تومان" className="tomanimg" />
                        </div>                        
                      </div>
                      <hr style={{ margin : '5px 15px'}}/>
                      <div className="Totalprice">
                        <div className='pricetext'>
                          <p>قابل پرداخت</p>
                        </div>
                        <div className="pricenum">
                            <label>400000</label>
                            <img src="./src/assets/toman.png" alt="تومان" className="tomanimg" />
                        </div>                        
                      </div>


                        <button className="buybutton">تایید و ادامه خرید</button>
                    </div>
                </div>
        </div>
        <Footer/>
    </>
  );
}

export default CartPage;