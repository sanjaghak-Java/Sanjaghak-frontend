import React from 'react';
import { Link } from 'react-router-dom';
import warranty from '../assets/tools-wench-ruler.png';
import box from '../assets/box.png';
import bin from '../assets/bin.png';
import store from '../assets/store.png';
import "../styles/CartPage.css";

function CartItem({ item, onQuantityChange, showQuantityControls = true, showDeleteButton = true }) {
  const increase = (e) => {
    e.preventDefault();
    onQuantityChange(item.id, item.quantity + 1);
  };

  const decrease = (e) => {
    e.preventDefault();
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  return (
    <div className='cartitem'>
      {showDeleteButton && (
        <button className="binbutton">
          <img src={bin} alt="حذف" className='binimg' />
        </button>
      )}

      <Link to="/Product" className="cartitemlink">
        <div style={{ display: 'flex' }}>
          <img src={item.image} alt={item.productname} className="itemsimg" />
          <div className='itemsinfo'>
            <label className="itemsname">{item.productname}</label>

            <div className="itemsproductcolor">
              <label
                className="itemsproductcolorshow"
                style={{ backgroundColor: item.color }}
              ></label>
              <label className="itemsproductcolorname">{item.color}</label>
            </div>

            <div className="warrantydiv">
              <img src={store} alt="فروشگاه" className="warrantyimg" />
              <label className="warrantylabel">سنجاقک</label>
            </div>

            <div className="warrantycontainor">
              <div className="warrantydiv">
                <img src={warranty} alt="گارانتی" className="warrantyimg" />
                <label className="warrantylabel">{item.warranty}</label>
              </div>
              <div className="warrantydiv">
                <img src={box} alt="انبار" className="warrantyimg" />
                <label className="warrantylabel">{item.inventory}</label>
              </div>
            </div>

            <hr className="itemshr" />

            <div className="pricenum">
              {showQuantityControls && (
                <div className='number'>
                  <button className="numberbtn" onClick={decrease}>−</button>
                  <span className="numbercount">{item.quantity}</span>
                  <button className="numberbtn" onClick={increase}>+</button>

                </div>
              )}
              <div className="pricepart">
                <div style={{ display: 'flex', gap: '5px' }}>
                  <label className="pricelab">تومان</label>
                  <label className="pricelab">{(item.price * item.quantity).toLocaleString()}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CartItem;
