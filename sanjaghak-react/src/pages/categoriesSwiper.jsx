import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "/src/styles/categorySwiper.css"

const categories = [
  { title: "گوشی موبایل", image: "./src/assets/images (2).jpg" },
  { title: "هدفون", image: "./src/assets/hedphone.jpg" },
  { title: "ساعت هوشمند", image: "./src/assets/watch.jpg"},
  { title: "لپ تاپ", image: "./src/assets/lap.jpg" },
  { title: "گوشی موبایل", image: "./src/assets/images (2).jpg" },
  { title: "هدفون", image: "./src/assets/hedphone.jpg" },

];

 function CategoriesSwiper() {
  return (
    <>
    <p className="categorie-title">دسته بندی محصولات</p>

    <div className="swiperContainer">
      <Swiper className="Swiper"
        dir="rtl"
     navigation
       loop={true} 
     spaceBetween={38}
     slidesPerView={5}
    modules={[Navigation]}
    initialSlide={0}
      >
        {categories.map((item, index) => (
          <SwiperSlide className="SwiperSlide" key={index} >
            <div >
              <img className="slideImg"
                src={item.image}
              />
              <p className="slidetext">{item.title}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    </>
  );
}
export default CategoriesSwiper