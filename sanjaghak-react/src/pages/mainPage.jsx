import Navbar from "./Navbar";
import CategoriesSwiper from "./categoriesSwiper";
import ImagePreview from "./imagePreview";
import PromoBanner from "./promoBanner";
import "/src/styles/mainPage.css";
import ProductSlider from "./productSlider";
import Footer from "./Footer";
import New from '../assets/new.png';
import best from '../assets/best-seller.png';
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

            <PromoBanner />

            <div className="sliderdiv" id="bestseller">
                <div className="titlepart">
                    <p className="titleslider">پر فروش ترین ها</p>
                    <img src={best} alt="" className="rotatedimg" />
                </div>
                <ProductSlider />
            </div>            

            <PromoBanner />
            <Footer />
        </div>
    );
}

export default MainPage;
