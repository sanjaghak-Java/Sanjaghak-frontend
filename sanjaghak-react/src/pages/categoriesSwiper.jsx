import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./categorySwiper.css"

const categories = [
  { title: "Cooldog", image: "./src/assets/testimage.jpg" },
   { title: "Cooldog", image: "./src/assets/testimage.jpg" },
    { title: "Cooldog", image: "./src/assets/testimage.jpg"},
     { title: "Cooldog", image: "./src/assets/testimage.jpg" },
          { title: "Cooldog", image: "./src/assets/testimage.jpg"},
               { title: "Cooldog", image: "./src/assets/testimage.jpg" }

];

 function CategoriesSwiper() {
  return (
    <div className="swiperContainer">
      <Swiper className="Swiper"
        dir="rtl"
     navigation
       loop={true} 
     spaceBetween={100}
     slidesPerView={4}
    modules={[Navigation]}
    initialSlide={0}
      >
        {categories.map((item, index) => (
          <SwiperSlide className="SwiperSlide" key={index} style={{maxWidth:"50px"}}>
            <div >
              <img className="slideImg"
                src={item.image}
              />
              <p className="slideText">{item.title}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
export default CategoriesSwiper