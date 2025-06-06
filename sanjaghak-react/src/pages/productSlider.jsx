import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "/src/styles/categorySwiper.css"
import ProductCard from "./ProductCard";
import "/src/styles/productSlider.css"


function ProductSlider(){
    const products = [
  { name: "گوشی موبایل اپل مدل iPhone 16 CH", image: "./src/assets/images (1).jpg" ,model:"iPhone 16",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
  { name: "موس گیمینگ بیسیم iMICE GW-X7", image: "./src/assets/mouse.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
  { name: "کیبورد گیمینگ هیسکا", image: "./src/assets/keyboard.jpg" ,model:"HX-KEG400 RGB",salepercent:"20%",salePrice:"160000",price:"100000"},
  { name: "Cooldog5", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
    { name: "Cooldog6", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog7", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog8", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog9", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog10", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog11", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
    { name: "Cooldog12", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog13", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog14", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
    { name: "Cooldog15", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog16", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"}



];
    return(
      <div className="productSwiperContainer">
        <Swiper className="productSwiper"
           dir="rtl"
        navigation
          loop={true} 
        spaceBetween={100}
        slidesPerView={4}
       modules={[Navigation]}
       initialSlide={0}
        slidesPerGroup={4}

       >
        {products.map((product,index)=>(
            <SwiperSlide className="productSwiperSlide" key={index}>
                <ProductCard name={product.name} image={product.image} model={product.model} salepercent={product.salepercent} salePrice={product.salePrice} price={product.salePrice} />
            </SwiperSlide>
        ))}
       </Swiper>
       </div>
    );
}
export default ProductSlider