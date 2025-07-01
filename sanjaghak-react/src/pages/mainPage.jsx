import { useEffect } from "react";
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

import "/src/styles/mainPage.css";

function MainPage() {
  const location = useLocation();

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
    title: "جدیدترین لپ‌تاپ‌های لنوو",
    discription: "دنیا در دستان تو",
    image: "./src//assets/headphone.png",
    bgColor: "#e3f2fd",
  },
  {
    title: "صدای باکیفت با هایلو",
    discription: "همراه همیشگی تو",
    image: "./src//assets/headphone.png",
    bgColor: "#fff3e0",
  },
  {
    title: "ساعت‌های هوشمند مخصوص ورزشکاران",
    discription: "تا ۲۰٪ تخفیف تابستانه",
    image: "./src//assets/headphone.png",
    bgColor: "#f1f8e9",
  },
  {
    title: "نسل جدید گوشی های سامسونگ",
    discription: "آنلاین در همه جا",
    image: "./src//assets/headphone.png",
    bgColor: "#fce4ec",
  },
];


  return (
    <div className="mainPageContainer" id="main-scroll-container">
      <Navbar />
      <ImagePreview />

      <div>
        <CategoriesSwiper />
      </div>

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

      <br />
      <BrandsSwiper />
      <Footer />
    </div>
  );
}

export default MainPage;
