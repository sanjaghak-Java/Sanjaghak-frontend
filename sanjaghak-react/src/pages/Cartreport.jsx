import React, { useState } from "react";
import "../styles/cartreport.css";

function Cartreport({ onClose }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="total">
            <div className="cartreport-container">
                <div className="cartreport-head">
                    <h3 className="title">کالا به سبد خرید شما اضافه شد</h3>
                    <button onClick={onClose}>
                        <img
                            src={isHovered ? '/src/assets/icons8-close.gif' : '/src/assets/icons8-close-48.png'}
                            alt="close button"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="close"
                        />
                    </button>
                </div>
                <hr className="hr" />
                
                <div className="cartreport-body">
                    <div className="product-info">
                        <img src="./src/assets/images.jpg" alt="" className="img"/>
                        <div className="vasat">
                        <labale className="product-name">سامسونگ</labale>
                        <div className="product-color1">
                            <label className="product-color-name1">سفید</label>
                            <label className="product-color-show1"></label>
                        </div>
                        </div>
                        <div className="product-price">
                            <label className="price-num">80.000.000</label>
                            <img src="./src/assets/toman.png" alt="تومان" className="price-img" />
                        </div>
                    </div>
                    
                    <button className="go-to-cart-btn">برو به سبد خرید</button>
                </div>
            </div>
        </div>
    );
}

export default Cartreport;