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
  { name: "Cooldog1", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
    { name: "Cooldog2", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog3", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog4", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
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