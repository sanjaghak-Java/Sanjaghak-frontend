import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import CategoriesSwiper from "./categoriesSwiper";
import ImagePreview from "./imagePreview";
import PromoBanner from "./PromoBanner";
import ProductSlider from "./productSlider";
import BrandsSwiper from "./BrandsSwiper";
import Footer from "./Footer";
import New from "../assets/new.png";
import best from "../assets/best-seller.png";
import BackgroundPattern from "./BackgroundPattern";

import "/src/styles/mainPage.css";

function MainPage() {
  const location = useLocation();
  const backgroundAreaRef = useRef(null);

  useEffect(() => {
    document.title = "سنجاقک";
    const hash = location.hash;
    if (hash === "#bestseller" || hash === "#newest") {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const promoBanners = [
    {
      title: "جدیدترین مکبوک ها",
      discription: "دنیا در دستان تو",
      image: "./src//assets/mac.jpg",
      bgColor: "#000000",
    },
    {
      title: "صدای باکیفت با هایلو",
      discription: "همراه همیشگی تو",
      image: "./src//assets/headphones.jpg",
      bgColor: "#bfcee1",
    },
    {
      title: "ساعت‌های هوشمند اپل",
      discription: "مخصوص ورزشکاران",
      image: "./src//assets/applewatch.jpg",
      bgColor: "#d1a092",
    },
    {
      title: "نسل جدید گوشی های پوکو",
      discription: "آنلاین در همه جا",
      image: "./src//assets/POCO-Best-Phones.jpg",
      bgColor: "#ffb400",
    },
  ];

  return (
    <div className="mainPageContainer" id="main-scroll-container">
      <Navbar />
      <ImagePreview />

      {/* ✅ بک‌گراند فقط در این محدوده اضافه میشه */}
      <div className="background-content-wrapper" ref={backgroundAreaRef}>
        <BackgroundPattern parentRef={backgroundAreaRef} />

        <CategoriesSwiper />

        <div className="sliderdiv" id="newest">
          <div className="titlepart">
            <p className="titleslider">جدید ترین ها</p>
            <img src={New} alt="" className="rotatedimg" />
          </div>
          <ProductSlider />
        </div>

        <div className="prompopart">
          <p className="watercolor-text">بهترین‌های سنجاقک</p>
          <PromoBanner banners={promoBanners} />
        </div>

        <div className="sliderdiv" id="bestseller">
          <div className="titlepart">
            <p className="titleslider">پر فروش ترین ها</p>
            <img src={best} alt="" className="rotatedimg" />
          </div>
          <ProductSlider />
        </div>

        <BrandsSwiper />
        <Footer />
      </div>
    </div>
  );
}

export default MainPage;
