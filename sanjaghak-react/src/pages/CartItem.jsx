import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import warranty from '../assets/tools-wench-ruler.png';
import box from '../assets/box.png';
import bin from '../assets/bin.png';
// import './CartPage.css'; 


function CartItem({ item }) {
  const [count, setCount] = useState(1);

  const increase = (e) => {
    e.preventDefault(); 
    setCount(prev => prev + 1);
  };

  const decrease = (e) => {
    e.preventDefault(); 
    setCount(prev => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className='cartitem'>
      <Link  className='cartitemlink'>
        <img src="./src/assets/images.jpg" alt="" className="itemsimg" />
        <div className='itemsinfo'>
          <label className="itemsname">{item.productname}</label>

          <div className="warrantycontainor">
            <div className="warrantydiv">
              <img src={warranty} alt="" className="warrantyimg"/>
              <span className="warrantylabel">گارانتی</span>
              <label className="warrantylabel">{item.warranty}</label>
            </div>
            <div className="warrantydiv">
              <img src={box} alt="" className="warrantyimg"/>
              <label className="warrantylabel">{item.inventory}</label>
            </div>
          </div>

          <div className="itemsproductcolor">
            <label className="itemsproductcolorshow" style={{ backgroundColor: item.color}}></label>
            <label className="itemsproductcolorname">{item.color}</label>
          </div>

          <div className='number'>
            <button className="numberbtn" onClick={increase}>+</button>
            <span className="numbercount">{count}</span>
            <button className="numberbtn" onClick={decrease}>−</button>
          </div>

          <div className="pricepart">
            <p>قیمت محصول:</p>
            <div style={{display : 'flex' , gap:'5px'}}>
              <label className="pricelab">{(item.price * count).toLocaleString()}</label>
              <label className="pricelab">تومان</label>
            </div>
          </div>

        </div>
      </Link>

      <div className='bindiv'>
        <button className="binbutton">
          <img src={bin} alt="" className='binimg'/>
        </button>
      </div>
    </div>
  );
}

export default CartItem;