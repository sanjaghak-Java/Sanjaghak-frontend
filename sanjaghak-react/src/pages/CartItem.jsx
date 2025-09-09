import React from 'react';
import { Link } from 'react-router-dom';
import warranty from '../assets/tools-wench-ruler.png';
import box from '../assets/box.png';
import bin from '../assets/bin.png';
import store from '../assets/store.png';
import "../styles/CartItem.css";

function CartItem({ item, onQuantityChange, onDelete, showQuantityControls = true, showDeleteButton = true }) {

  const updateOrderQuantity = async (newQuantity) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/orderItem/${item.id}`, // orderItemId
        {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ quantity: Number(newQuantity) })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      onQuantityChange(item.id, newQuantity);

    } catch (error) {
      console.error("Error updating order quantity:", error);
    }
  };

  const deleteOrderItem = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/orderItem/${item.id}`,
        {
          method: "DELETE",
          headers: { 
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      // Call the parent handler to remove the item from state
      onDelete(item.id);
      window.location.reload()

    } catch (error) {
      console.error("Error deleting order item:", error);
    }
  };

  const increase = (e) => {
    e.preventDefault();
    updateOrderQuantity(item.quantity + 1);
  };

  const decrease = (e) => {
    e.preventDefault();
    if (item.quantity > 1) {
      updateOrderQuantity(item.quantity - 1);
    }
  };

  return (
    <div className='cartitem'>
      {showDeleteButton && (
        <div className="bincontainor">
          <button className="binbutton" onClick={deleteOrderItem}>
            <img src={bin} alt="حذف" className='binimg' />
          </button>      
        </div>
      )}

      <Link to="/Product" className="cartitemlink">
        <div style={{ display: 'flex' }} id="cartinfocontainor">
          <img src={item.image} alt={item.productname} className="itemsimg" />
          <div className='itemsinfo'>
            <label className="itemsname">{item.productname}</label>

            <div className="itemsproductcolor">
              <label
                className="itemsproductcolorshow"
                style={{ backgroundColor: item.hex }}
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