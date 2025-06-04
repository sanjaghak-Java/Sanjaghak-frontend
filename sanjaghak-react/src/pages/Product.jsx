import "./product.css";
import { Link } from 'react-router-dom';
import Navbar from "./navbar";
import React, { useRef, useState } from 'react';

function Product() {
    const targetRef = useRef(null);
    const introRef = useRef(null);
    const specsRef = useRef(null);

    const handleScroll = () => {
        targetRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToSection = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [showMore, setShowMore] = useState(false);
    const toggleShowMore = () => setShowMore(!showMore);

    return (
        <>
            <Navbar />
            <div className="head-cart">
                <div className="side-cart">
                    <div className="warranty">
                        <img src="./src/assets/tools-wench-ruler.png" alt="warranty" className="warranty-img" />
                        <label className="warranty-name">گارانتی 12 ماهه گلدیران</label>
                    </div>
                    <hr className="hr-side" />
                    <div className="final-color">
                        <img src="./src/assets/Color, Palette.png" alt="color" className="final-color-img" />
                        <label className="final-color-name">صورتی</label>
                    </div>
                    <hr className="hr-side" />
                    <div className="price">
                        <div className="discount">
                            <label className="base-price">100.000.000</label>
                            <div className="discount-percent">
                                <label className="discount-percent-num">15%</label>
                            </div>
                        </div>
                        <div className="final-price">
                            <label className="final-price-num">80.000.000</label>
                            <img src="./src/assets/toman.png" alt="تومان" className="toman" />
                        </div>
                    </div>
                    <div className="buy">
                        <button className="buy-button">افزودن به سبد خرید</button>
                    </div>
                </div>
                <div className="product">
                    <div className="icons-container">
                        <Link><img src="./src/assets/icons8-like-50.png" alt="like" className="like" /></Link>
                        <Link><img src="./src/assets/icons8-link-24.png" alt="link" className="link" /></Link>
                    </div>
                    <div className="information">
                        <h2>سامسونگ</h2>
                        <p className="product-information-title">رنگبندی :</p>
                        <div className="product-color">
                            <label className="product-color-name">سفید</label>
                            <label className="product-color-show"></label>
                        </div>
                        <hr className="hr" />
                        <p className="product-information-title">ویژگی ها :</p>
                        <div className="features">
                            <label className="features-title">حافظه</label>
                            <label className="features-inf">256gb</label>
                        </div>
                    </div>
                    <div>
                        <img src="./src/assets/images.jpg" alt="تصویر محصول" className="product-img" />
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

            <hr className="hr-side" />

            <div>
                <div className="Information">
                    <input
                        type="radio"
                        name="section"
                        value="intro"
                        id="intro"
                        className="Introduction"
                        onChange={() => scrollToSection(introRef)}
                    />
                    <label htmlFor="intro">معرفی</label>

                    <input
                        type="radio"
                        name="section"
                        value="specs"
                        id="specs"
                        className="specs"
                        onChange={() => scrollToSection(specsRef)}
                    />
                    <label htmlFor="specs">مشخصات</label>
                </div>

                <p className="Information-title" ref={introRef}>معرفی</p>
                <div className="product-info-box">
                    <p className={`product-text ${showMore ? "expanded" : "collapsed"}`}>
                        گوشی‌ها هر روز زرق و برق بیشتری پیدا می‌کنند و ویژگی‌های جدیدتری را به لیست خود اضافه می‌کنند...
                        گوشی موبایل شیائومی مدل Redmi A3 یک گوشی با این مشخصات است. این گوشی کیفیت ساخت مناسبی دارد و...
                        نمایشگر 90 هرتزی، پردازنده Helio G36، دوربین 8 مگاپیکسلی و  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis quod a, similique asperiores recusandae praesentium repellat corporis veniam, eius quo sunt. Explicabo minus laudantium molestias. V Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos eligendi sunt, suscipit id minima possimus doloribus modi, culpa dolores totam assumenda tenetur quae ab rem, lab Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque earum possimus provident fugiat. Eligendi deleniti eos officia ducimus blanditiis quam dignissimos ipsum, placeat suscipit excepturi nulla accusamus fugit assumenda architecto.oriosam nemo eveniet aspernatur veritatis!oluptates voluptatum est consequatur unde?غیره...
                    </p>
                    <div className="more-link" onClick={toggleShowMore}>
                        <span>{showMore ? "کمتر" : "بیشتر"}</span>
                        <span className="arrow">{showMore ? "❯" : "❮"}</span>
                    </div>
                </div>

                <p className="Information-title" ref={specsRef}>مشخصات</p>
                <div className="product-info-box">
                    <ul className="specs-list">
                        <li><strong>پردازنده:</strong> Helio G36</li>
                        <li><strong>رم:</strong> 4GB</li>
                        <li><strong>صفحه‌نمایش:</strong> 6.5 اینچ IPS، نرخ نوسازی 90Hz</li>
                        <li><strong>دوربین:</strong> 8 مگاپیکسل</li>
                        <li><strong>باتری:</strong> 5000 میلی‌آمپر ساعت</li>
                        <li><strong>سیستم‌عامل:</strong> اندروید 13 (Go Edition)</li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default Product;
