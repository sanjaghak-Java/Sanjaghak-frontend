import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "/src/styles/categorySwiper.css";
import { Link } from "react-router-dom";

const categories = [
  { title: "گوشی موبایل", image: "./src/assets/images (2).jpg" },
  { title: "هدفون", image: "./src/assets/hedphone.jpg" },
  { title: "ساعت هوشمند", image: "./src/assets/watch.jpg" },
  { title: "لپ تاپ", image: "./src/assets/lap.jpg" },
  { title: "گوشی موبایل", image: "./src/assets/images (2).jpg" },
  { title: "هدفون", image: "./src/assets/hedphone.jpg" },
  { title: "هدفون", image: "./src/assets/hedphone.jpg" },
  { title: "هدفون", image: "./src/assets/hedphone.jpg" }
];

function CategoriesSwiper() {
  return (
    <>
      <p className="categorie-title">دسته بندی محصولات</p>

      <div className="categorySwiperContainer">
        <Swiper
          className="categorySwiper"
          dir="rtl"
          navigation
          loop={true}
          spaceBetween={30}
          slidesPerView={6}
          modules={[Navigation]}
          breakpoints={{
            0: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 6,
              spaceBetween: 57,
            },
          }}
        >
          {categories.map((item, index) => (
            <SwiperSlide className="categorySwiperSlide" key={index}>
              <Link to={`/productCategory?category=${item.title}`} className="categorySwiperSlide">
                <div>
                  <img className="categorySlideImg" src={item.image} alt={item.title} />
                  <p className="categorySlidetext">{item.title}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

export default CategoriesSwiper;
