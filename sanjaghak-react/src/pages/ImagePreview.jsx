import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "/src/styles/categorySwiper.css";
import "/src/styles/slideShow.css";

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
          <img src="./src/assets/linus-mimietz-gvptKmonylk-unsplash.jpg"  />
          <p className="slideTitle" id="slideTitle1"> Performance You Can Count On</p>
        </SwiperSlide>

        <SwiperSlide className="slide">
          <img src="./src/assets/pexels-pavel-danilyuk-8038351.jpg"  />
          <p className="slideTitle" id="slideTitle2"> Experience the Future
            <br />of Technology Today</p>
        </SwiperSlide>

        <SwiperSlide className="slide">
          <img src="./src/assets/pexels-sorjigrey-9956771.jpg"  />
          <p className="slideTitle" id="slideTitle3">Next-Level Performance Starts Here</p>
        </SwiperSlide>
        <SwiperSlide className="slide">
          <img src="./src/assets/pexels-madebymath-331684 (1).jpg"  />
          <p className="slideTitle" id="slideTitle4">Everything You Need
          <br /> All in One Place</p>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default ImagePreview;