import "./cart.css"
import { Link } from 'react-router-dom';

function Cart(){

    return(
        <div className="head-cart">
            <div className="side-cart">
                <div className="warranty">
                    <img src="./src/assets/tools-wench-ruler.png" alt="warranty" className="warranty-img"/>
                    <label className="warranty-name">گارانتی 12 ماهه گلدیران</label>
                </div>
                  <hr className="hr-side"/>
                <div className="final-color">
                    <img src="./src/assets/Color, Palette.png" alt="color" className="final-color-img"/>
                    <label className="final-color-name">صورتی</label>
                </div>
                  <hr className="hr-side"/>
                <div className="pric">
                    <div className="discount">
                        <label htmlFor="" className="base-price">100.000.000</label>
                        <div className="discount-percent">
                            <label htmlFor="" className="discount-percent-num">15%</label>
                        </div>
                    </div>
                    <div className="final-price">
                        <label htmlFor="" className="final-price-num">80.000.000</label>
                        <img src="./src/assets/toman.png" alt="تومان" className="toman"/>
                    </div>
                </div>
                <div className="buy">
                    <button className="buy-button">افزودن به سبد خرید</button>
                </div>
            </div>

            <div className="product">
                <div className="icons-container">
                    <Link><img src="./src/assets/icons8-like-50.png" alt="like" className="like"/></Link>
                    <Link><img src="./src/assets/icons8-link-24.png" alt="like" className="link"/></Link>
                </div>
                <div className="information"> 
                    <h2>سامسونگ </h2>
                    <p className="product-information-title">رنگبندی :</p>
                    <div className="product-color">
                        <label htmlFor="" className="product-color-name">سفید</label>
                        <label htmlFor="" className="product-color-show"></label>
                    </div>
                    <hr className="hr"/>
                    <p className="product-information-title">ویژگی ها :</p>
                    <div className="features">
                        <label htmlFor="" className="features-title">حافظه</label>
                        <label htmlFor="" className="features-inf">256gb</label>
                    </div>
                </div>
                <div>
                    <img src="./src/assets/images.jpg" alt="تصویر محصول" className="product-img"/>
                    <div className="miniimg-container">
                        <div id="more-miniimg-wrapper">
                            <img src="./src/assets/icons8-images-folder-50.png" alt="تصویر محصول" id="more-product-miniimg" />
                            <label id="more-miniimg-label">+2 تصویر</label>
                        </div>
                        <div className="miniimg-wrapper">
                            <img src="./src/assets/images (1).jpg" alt="تصویر محصول" className="product-miniimg" />
                        </div>
                        <div className="miniimg-wrapper">
                            <img src="./src/assets/images (2).jpg" alt="تصویر محصول" className="product-miniimg" />
                        </div>
                        <div className="miniimg-wrapper">
                            <img src="./src/assets/images.jpg" alt="تصویر محصول" className="product-miniimg" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Cart;