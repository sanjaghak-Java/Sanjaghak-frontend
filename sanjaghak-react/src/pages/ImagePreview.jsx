import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./categorySwiper.css";
import "./slideShow.css";

function ImagePreview() {
  return (
    <div className="slideShowContainer">
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        loop={true}
        slidesPerView={1}
        initialSlide={1}
        className="Swiper"
        spaceBetween={0}
      >
        <SwiperSlide className="slide">
          <img src="./src/assets/mainslide1.png"  />
          <p className="slideTitle">Welcome to Our Store</p>
        </SwiperSlide>

        <SwiperSlide className="slide">
          <img src="./src/assets/mainslide1.png"  />
          <p className="slideTitle">Discover Amazing Deals</p>
        </SwiperSlide>

        <SwiperSlide className="slide">
          <img src="./src/assets/mainslide1.png"  />
          <p className="slideTitle">Shop the Latest Trends</p>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default ImagePreview;