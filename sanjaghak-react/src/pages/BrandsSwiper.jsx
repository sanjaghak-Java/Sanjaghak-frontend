import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "/src/styles/brandsSwiper.css";

const brands = [
  { name: "Huawei", image: "/src/assets/huawei.png" },
  { name: "JBL", image: "/src/assets/asus.png" },
  { name: "Nokia", image: "/src/assets/huawei.png" },
  { name: "Asus", image: "/src/assets/asus.png" },
  { name: "Apple", image: "/src/assets/huawei.png" },
  { name: "Xiaomi", image: "/src/assets/asus.png" },
  { name: "Samsung", image: "/src/assets/huawei.png" },
];

function BrandsSwiper() {
  return (
    <>
      <p className="brandsTitle">برندهای محبوب</p>
      <div className="brandsSwiperContainer">

        <Swiper
          className="brandsSwiper"
          dir="rtl"
          navigation
          loop={true}
          spaceBetween={40}
          slidesPerView={6}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
        >
          {brands.map((brand, index) => (
            <SwiperSlide key={index} className="brandSlide">
              <div className="brandWrapper">
                <img className="brandLogo" src={brand.image} alt={brand.name} />
                <div className="brandDivider" />
              </div>
            </SwiperSlide>

          ))}
        </Swiper>
      </div>
    </>

  );
}

export default BrandsSwiper;
