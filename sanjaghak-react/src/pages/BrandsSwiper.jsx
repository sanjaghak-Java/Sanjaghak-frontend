import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "/src/styles/brandsSwiper.css";

function BrandsSwiper() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8080/api/Sanjaghak/brand/getActiveBrands");
        if (!res.ok) throw new Error("Failed to fetch brands");
        const data = await res.json();
        setBrands(data);
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    };

    fetchBrands();
  }, []);

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
          breakpoints={{
            0: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 40,
            },
          }}
          modules={[Navigation, Autoplay]}
        >
          {brands.map((brand) => (
            <SwiperSlide key={brand.brandId} className="brandSlide">
              <Link to={`/productCategory?brand=${brand.brandId}`}>
                <div className="brandWrapper">
                  <img
                    className="brandLogo"
                    src={
                      brand.logoUrl
                        ? brand.logoUrl
                        : "/src/assets/default-brand-logo.png" // fallback image if no logoUrl
                    }
                    alt={brand.brandName}
                  />
                  <div className="brandDivider" />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

export default BrandsSwiper;