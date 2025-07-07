import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "/src/styles/categorySwiper.css";
import ProductCard from "./ProductCard";
import "/src/styles/productSlider.css";

function ProductSlider() {
  const products = [
    { name: "گوشی موبایل اپل مدل iPhone 16 CH", image: "./src/assets/images (1).jpg", model: "iPhone 16", salepercent: "20%", salePrice: "160000", price: "100000" },
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg", model: "coolest", salepercent: "20%", salePrice: "160000", price: "100000" },
    { name: "موس گیمینگ بیسیم iMICE GW-X7", image: "./src/assets/mouse.jpg", model: "coolest", salepercent: "20%", salePrice: "160000", price: "100000" },
    { name: "کیبورد گیمینگ هیسکا", image: "./src/assets/keyboard.jpg", model: "HX-KEG400 RGB", salepercent: "20%", salePrice: "160000", price: "100000" },
    { name: "کیبورد گیمینگ هیسکا", image: "./src/assets/keyboard.jpg", model: "HX-KEG400 RGB", salepercent: "20%", salePrice: "160000", price: "100000" },
    { name: "کیبورد گیمینگ هیسکا", image: "./src/assets/keyboard.jpg", model: "HX-KEG400 RGB", salepercent: "20%", salePrice: "160000", price: "100000" },
    { name: "کیبورد گیمینگ هیسکا", image: "./src/assets/keyboard.jpg", model: "HX-KEG400 RGB", salepercent: "20%", salePrice: "160000", price: "100000" },
    { name: "کیبورد گیمینگ هیسکا", image: "./src/assets/keyboard.jpg", model: "HX-KEG400 RGB", salepercent: "20%", salePrice: "160000", price: "100000" },
    { name: "کیبورد گیمینگ هیسکا", image: "./src/assets/keyboard.jpg", model: "HX-KEG400 RGB", salepercent: "20%", salePrice: "160000", price: "100000" },
    { name: "کیبورد گیمینگ هیسکا", image: "./src/assets/keyboard.jpg", model: "HX-KEG400 RGB", salepercent: "20%", salePrice: "160000", price: "100000" },
    { name: "کیبورد گیمینگ هیسکا", image: "./src/assets/keyboard.jpg", model: "HX-KEG400 RGB", salepercent: "20%", salePrice: "160000", price: "100000" },
    { name: "کیبورد گیمینگ هیسکا", image: "./src/assets/keyboard.jpg", model: "HX-KEG400 RGB", salepercent: "20%", salePrice: "160000", price: "100000" },
  ];

  return (
    <div className="productSwiperContainer">
      <Swiper
        className="productSwiper"
        dir="rtl"
        navigation
        loop={true}
        spaceBetween={30}
        slidesPerView={4}
        slidesPerGroup={4}
        modules={[Navigation]}
        initialSlide={0}
        breakpoints={{
          0: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 80,
          },
        }}
      >
        {products.map((product, index) => (
          <SwiperSlide className="productSwiperSlide" key={index}>
            <ProductCard
              name={product.name}
              image={product.image}
              model={product.model}
              salepercent={product.salepercent}
              salePrice={product.salePrice}
              price={product.price}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ProductSlider;
