import React from 'react';
import { Link } from 'react-router-dom';
import warranty from '../assets/tools-wench-ruler.png';
import box from '../assets/box.png';
import bin from '../assets/bin.png';
import store from '../assets/store.png';
import "../styles/CartItem.css";

function ProfileFavouriteItem({ item, onQuantityChange, showQuantityControls = true, showDeleteButton = true, onRemoveFavorite }) {
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

const handleRemoveFavorite = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) return alert("No token found!");

  try {
    const res = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/favoritesList/toggle?productId=${item.id}`, {
      method: "POST", 
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to toggle favorite");

  
    window.location.reload();
  } catch (err) {
    console.error("Error toggling favorite:", err);
  }
};


  const discountPercentage = Number(item.discountPercentage) || 0;
  const hasDiscount = discountPercentage > 0;
  const originalPrice = hasDiscount ? item.price / (1 - discountPercentage / 100) : item.price;
  const discountedPrice = item.price;

  return (
    <div className='cartitem'>
      {showDeleteButton && (
        <div className="bincontainor">
          <button className="binbutton" onClick={handleRemoveFavorite}>
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
              {Array.isArray(item.hexadecimal) && Array.isArray(item.color)
                ? item.hexadecimal.map((hex, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                      <label
                        className="itemsproductcolorshow"
                        style={{ backgroundColor: hex }}
                      ></label>
                      <label className="itemsproductcolorname">{item.color[idx]}</label>
                    </div>
                  ))
                : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <label
                        className="itemsproductcolorshow"
                        style={{ backgroundColor: item.hexadecimal }}
                      ></label>
                      <label className="itemsproductcolorname">{item.color}</label>
                    </div>
                  )
              }
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

<div className="pricepart" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
  {item.inventory !== "ناموجود" && hasDiscount && (
    <label
      className="pricelab"
      style={{ textDecoration: 'line-through', color: '#888', fontSize: '14px' }}
    >
      {(originalPrice * item.quantity).toLocaleString()} تومان
    </label>
  )}

  {item.inventory !== "ناموجود" && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label
        className="pricelab"
        style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}
      >
        {(discountedPrice * item.quantity).toLocaleString()} تومان
      </label>

      {hasDiscount && (
        <div style={{
          backgroundColor: 'red',
          color: 'white',
          fontWeight: 'bold',
          padding: '2px 6px',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          %{discountPercentage}
        </div>
      )}
    </div>
  )}
</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProfileFavouriteItem;