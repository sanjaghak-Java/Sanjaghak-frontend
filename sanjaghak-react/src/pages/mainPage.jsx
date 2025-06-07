import Navbar from "./navbar";
import CategoriesSwiper from "./categoriesSwiper";
import ImagePreview from "./imagePreview";
import PromoBanner from "./promoBanner";
import "/src/styles/mainPage.css"
import ProductCard from "./ProductCard";
import ProductSlider from "./productSlider";
import Footer from "./Footer";
import New from '../assets/new.png';
import { Form } from "react-router-dom";
import best from '../assets/best-seller.png'

function mainPage(){
    return(
        <div className="mainPageContainer"> 
            <Navbar/>
            <ImagePreview/>
            <div>
                <CategoriesSwiper/>
            </div>
            <div className="sliderdiv">
                <div className="titlepart">
                    <p className="titleslider">جدید ترین ها</p>
                    <img src={New} alt="" className="rotatedimg"/>
                </div>
                <ProductSlider/>
            </div>            
            <PromoBanner/>
            <div className="sliderdiv">
                <div className="titlepart">
                    <p className="titleslider">پر فروش ترین ها</p>
                    <img src={best} alt="" className="rotatedimg"/>
                </div>
                <ProductSlider/>
            </div>            
            <PromoBanner/>
            <Footer/>
        </div>

    );
}
export default mainPage