import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import '/src/styles/PromoBanner.css';

const PromoBanner = ({ banners }) => {
  return (
    <div className="promo-banner-swiper">
      <Swiper
        modules={[Autoplay, Pagination, EffectCoverflow]}
        effect="coverflow"
        centeredSlides={true}
        slidesPerView="auto"
        loop={true}
        spaceBetween={230}
        coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 120,
        modifier: 2.5,
        slideShadows: false,
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        className="promo-swiper"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index} className="promo-slide">
            <div className="promo-banner-slide" style={{ backgroundColor: banner.bgColor }}>
              <div className="promo-banner-content">
                <h2>{banner.title}</h2>
                <p className="promo-banner-discription">{banner.discription}</p>
                <button onClick={banner.onClick}>مشاهده و خرید</button>
              </div>
              <div className="promo-banner-image">
                <img src={banner.image} alt={banner.title} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PromoBanner;
