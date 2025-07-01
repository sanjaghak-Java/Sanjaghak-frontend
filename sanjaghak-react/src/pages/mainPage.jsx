import Navbar from "./Navbar";
import CategoriesSwiper from "./categoriesSwiper";
import ImagePreview from "./imagePreview";
import PromoBanner from "./PromoBanner";
import "/src/styles/mainPage.css";
import ProductSlider from "./productSlider";
import BrandsSwiper  from "./BrandsSwiper";
import Footer from "./Footer";
import New from "../assets/new.png";
import best from "../assets/best-seller.png";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function MainPage() {
  const location = useLocation();

  useEffect(() => {
    document.title = "سنجاقک";
    //  document.querySelector("/src/assets/dragonfly (2).png");
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
      categoryLink: "/productCategory",
      bgGradient: "radial-gradient(circle, #e3f2fd, #90caf9)"
    },
    {
      title: "هدفون‌های باکیفیت",
      description: "صدایی که تو رو می‌بره!",
      imageUrl: './src/assets/headphone.png',
      categoryLink: "/productCategory",
      bgGradient: "radial-gradient(circle, #fce4ec, #f48fb1)"
    },
    {
      title: "ساعت‌های هوشمند",
      description: "زندگی مدرن با ساعت دیجیتال",
      imageUrl: './src/assets/smartwatch.png',
      categoryLink: "/productCategory",
      bgGradient: "radial-gradient(circle, #ede7f6, #b39ddb)"
    },
    {
      title: "موبایل‌های جدید",
      description: "دنیا در دستان توست",
      imageUrl: "./src/assets/smartphone.png",
      categoryLink: "/productCategory",
      bgGradient: "radial-gradient(circle, #e8f5e9, #81c784)"
    }
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
        <p className="watercolor-text">بهترین های مجموعه ما</p>
        <div className="promobannerdiv">
          <PromoBanner {...promoBanners[0]} />
          <PromoBanner {...promoBanners[1]} />
          <PromoBanner {...promoBanners[2]} />
          <PromoBanner {...promoBanners[3]} />
        </div>
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
