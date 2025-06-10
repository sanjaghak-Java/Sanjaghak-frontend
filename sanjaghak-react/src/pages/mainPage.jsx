import Navbar from "./Navbar";
import CategoriesSwiper from "./categoriesSwiper";
import ImagePreview from "./imagePreview";
import PromoBanner from "./promoBanner";
import "/src/styles/mainPage.css";
import ProductSlider from "./productSlider";
import Footer from "./Footer";
import New from "../assets/new.png";
import best from "../assets/best-seller.png";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function MainPage() {
  const location = useLocation();

  useEffect(() => {
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
      title: "لپ‌تاپ‌های جدید",
      description: "پیشتاز تکنولوژی",
      imageUrl: "./src/assets/laptop background.png",
      categoryLink: "/productCategory/laptop"
    },
    {
      title: "هدفون‌های باکیفیت",
      description: "صدایی که تو رو می‌بره!",
      imageUrl: './src/assets/smartwatch.png',
      categoryLink: "/productCategory/headphone"
    },
    {
      title: "ساعت‌های هوشمند",
      description: "زندگی مدرن با ساعت دیجیتال",
      imageUrl: './src/assets/smartwatch.png',
      categoryLink: "/productCategory/watch"
    },
    {
      title: "موبایل‌های جدید",
      description: "دنیا در دستان توست",
      imageUrl: "./src/assets/smartphone.png",
      categoryLink: "/productCategory/mobile"
    }
  ];

  return (
    <div className="mainPageContainer">
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

      <div className="promobannerdiv">
        <PromoBanner {...promoBanners[0]} />
        <PromoBanner {...promoBanners[1]} />
      </div>

      <div className="sliderdiv" id="bestseller">
        <div className="titlepart">
          <p className="titleslider">پر فروش ترین ها</p>
          <img src={best} alt="" className="rotatedimg" />
        </div>
        <ProductSlider />
      </div>

      <div className="promobannerdiv">
        <PromoBanner {...promoBanners[2]} />
        <PromoBanner {...promoBanners[3]} />
      </div>

      <Footer />
    </div>
  );
}

export default MainPage;
