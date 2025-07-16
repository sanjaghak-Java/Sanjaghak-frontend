import ProductCard from "./ProductCard";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation"; 
import "/src/styles/Similarproducts.css"

function Similarproducts() {
    const products = [
        { name: "گوشی موبایل اپل مدل iPhone 16 CH", image: "./src/assets/images (1).jpg", model: "iPhone 16", salepercent: "20%", salePrice: "160000", price: "100000" },
        { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg", model: "coolest", salepercent: "20%", salePrice: "160000", price: "100000" },
        { name: "موس گیمینگ بیسیم iMICE GW-X7", image: "./src/assets/mouse.jpg", model: "coolest", salepercent: "20%", salePrice: "160000", price: "100000" },
        { name: "کیبورد گیمینگ هیسکا", image: "./src/assets/keyboard.jpg", model: "HX-KEG400 RGB", salepercent: "20%", salePrice: "160000", price: "100000" },
    ]

    return (
        <div className="similar-box">
            <div className="similar-productSwiperContainer">
                
                <Swiper
                className="similar-productSwiper"
                dir="rtl"
                navigation
                loop={true}
                spaceBetween={80}
                slidesPerView={4}
                slidesPerGroup={1}
                modules={[Navigation]}
                initialSlide={0}
                breakpoints={{
                    0: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                    spaceBetween: 0,
                    },
                    768: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                    spaceBetween: 40,
                    },
                    1024: {
                    slidesPerView: 4,
                    slidesPerGroup: 1,
                    spaceBetween: 80,
                    }
                }}
                >

                    {products.map((product, index) => (
                        <SwiperSlide className="similar-productSwiperSlide" key={index}>
                            <ProductCard name={product.name} image={product.image} model={product.model} salepercent={product.salepercent} salePrice={product.salePrice} price={product.salePrice} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default Similarproducts