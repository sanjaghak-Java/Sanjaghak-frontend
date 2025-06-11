import React from 'react';
import tomanIcon from '../assets/toman.png';
import "../styles/CartPage.css";

const CartPrice = ({ totalPrice, shippingCost }) => {
  const payable = totalPrice + shippingCost;

  return (
    <div className="pricecontainor">
      <div className="Totalprice">
        <div className="pricetext">
          <p>قیمت کل:</p>
        </div>
        <div className="pricenumdiv">
          <img src={tomanIcon} alt="تومان" className="tomanimg" />
          <label>{totalPrice.toLocaleString()}</label>
        </div>
      </div>

      <div className="Totalprice">
        <div className="pricetext">
          <p>هزینه ارسال:</p>
        </div>
        <div className="pricenumdiv">
          <img src={tomanIcon} alt="تومان" className="tomanimg" />
          <label>{shippingCost.toLocaleString()}</label>
        </div>
      </div>

      <hr style={{ margin: '5px 15px' }} />

      <div className="Totalprice">
        <div className="pricetext">
          <p>قابل پرداخت:</p>
        </div>
        <div className="pricenumdiv">
          <img src={tomanIcon} alt="تومان" className="tomanimg" />
          <label>{payable.toLocaleString()}</label>
        </div>
      </div>

      <button className="buybutton">تایید و ادامه خرید</button>
    </div>
  );
};

export default CartPrice;
