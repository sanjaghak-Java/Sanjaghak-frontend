import "/src/styles/productdetail.css";
import { Link } from 'react-router-dom';

function ProductDetail({ onAddToCart }) {
    return (
        <div className="head-cart">
            <div className="product">
                <div className="icons-container">
                    <Link><img src="./src/assets/icons8-like-50.png" alt="like" className="like" /></Link>
                </div>
                <div className="pay">
                    <div className="price">
                        <div className="discount">  
                            <div className="discount-percent">
                                <label className="discount-percent-num">15%</label>
                            </div>
                            <label className="base-price">100.000.000</label>
                        </div>
                        <div className="final-price">         
                            <img src="./src/assets/toman.png" alt="تومان" className="toman" />
                            <label className="final-price-num">80.000.000</label>

                        </div>
                    </div>

                    <div className="buy-box">
                        <button className="buy-button" onClick={onAddToCart}>
                            افزودن به سبد خرید
                        </button>
                    </div>
                </div>
                <div className="information">
                    <div className="brand">
                        <img src="/src/assets/instagram.png" alt="brand" className="brand-img"/>
                        <label className="brand-name">iphone</label>
                    </div>
                    <h2>galaxy A53</h2>
                    <p className="product-information-title">رنگبندی :</p>
                    <div className="product-color">
                        <label className="product-color-name">سفید</label>
                        <label className="product-color-show"></label>
                    </div>

                    <hr className="hr" />

                    <p className="product-information-title">ویژگی‌ها :</p>
                    <div className="features">
                        <label className="features-title">حافظه</label>
                        <label className="features-inf">256GB</label>
                    </div>

                    <hr className="hr" />
                    
                    <div className="warranty">
                        <img src="./src/assets/tools-wench-ruler.png" alt="warranty" className="warranty-img" />
                        <label className="warranty-name">گارانتی 12 ماهه گلدیران</label>
                    </div>
                </div>

                <div className="images">
                    <img src="./src/assets/images.jpg" alt="تصویر محصول" className="product-img" />
                    <div className="miniimg-container">
                        <div id="more-miniimg-wrapper">
                            <img src="./src/assets/icons8-images-folder-50.png" alt="تصاویر بیشتر" id="more-product-miniimg" />
                            <label id="more-miniimg-label">+2 تصویر</label>
                        </div>
                        {["images (1).jpg", "images (2).jpg", "images.jpg"].map((img, i) => (
                            <div className="miniimg-wrapper" key={i}>
                                <img src={`./src/assets/${img}`} alt="تصویر محصول" className="product-miniimg" />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ProductDetail;
