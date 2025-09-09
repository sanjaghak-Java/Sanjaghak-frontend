import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "/src/styles/categorySwiper.css";
import { Link } from "react-router-dom";

function CategoriesSwiper() {
  const [categories, setCategories] = useState([]);
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8080/api/Sanjaghak/categories/getActiveCategory");
      const data = await res.json();

      const categoriesWithImages = await Promise.all(
        data.map(async (cat) => {
          try {
            const imgRes = await fetch(
              `http://127.0.0.1:8080/api/Sanjaghak/categoryImages/${cat.categoryId}`
            );
            const imgData = await imgRes.json(); // <-- imgData defined here

            if (imgData.length > 0) {
              const fullUrl = `http://127.0.0.1:8080${encodeURI(imgData[0].imageUrl)}`;
              console.log(`Category ${cat.categoryName} image URL:`, fullUrl);
              return { ...cat, imageUrl: fullUrl, altText: imgData[0].altText || cat.categoryName };
            } else {
              console.log(`Category ${cat.categoryName} has no image`);
              return { ...cat, imageUrl: null, altText: cat.categoryName };
            }
          } catch (err) {
            console.error("Error fetching image for category", cat.categoryId, err);
            return { ...cat, imageUrl: null, altText: cat.categoryName };
          }
        })
      );

      setCategories(categoriesWithImages);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  fetchCategories();
}, []);

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
          {categories.map((item) => (
            <SwiperSlide className="categorySwiperSlide" key={item.categoryId}>
              <Link
                to={`/productCategory?category=${item.categoryName}`}
                className="categorySwiperSlide"
              >
                <div>
<img 
  className="categorySlideImg"
  src={item.imageUrl || "/fallback-image.jpg"} 
  alt={item.altText || item.categoryName} 
/>
                  <p className="categorySlidetext">{item.categoryName}</p>
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