import React, { useState } from 'react';
import tomanIcon from '../assets/toman.png';
import "../styles/CartPrice.css";
import ThankYouModal from './ThankYouModal';

const CartPrice = ({ totalPrice, shippingCost }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const payable = totalPrice + shippingCost;

  return (
    <>
      <div className="pricecontainor">
        <div className="Totalprice" id="Totalprice1">
          <div className="pricetext">
            <p>قیمت کل:</p>
          </div>
          <div className="pricenumdiv">
            <img src={tomanIcon} alt="تومان" className="tomanimg" />
            <label>{totalPrice.toLocaleString()}</label>
          </div>
        </div>

        <div className="Totalprice" id="Totalprice2">
          <div className="pricetext">
            <p>هزینه ارسال:</p>
          </div>
          <div className="pricenumdiv">
            <img src={tomanIcon} alt="تومان" className="tomanimg" />
            <label>{shippingCost.toLocaleString()}</label>
          </div>
        </div>

        <hr style={{ margin: '5px 15px' }} />

        <div className="Totalprice" id="Totalprice3">
          <div className="pricetext">
            <p>قابل پرداخت:</p>
          </div>
          <div className="pricenumdiv">
            <img src={tomanIcon} alt="تومان" className="tomanimg" />
            <label>{payable.toLocaleString()}</label>
          </div>
        </div>

        <button className="buybutton" onClick={() => setIsModalOpen(true)}>
          تایید و ادامه خرید
        </button>
      </div>

      <ThankYouModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default CartPrice;
