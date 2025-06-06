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

function mainPage(){
    return(
        <div className="mainPageContainer"> 
            <Navbar/>
            <ImagePreview/>
            <div>
                <CategoriesSwiper/>
            </div>
            <PromoBanner/>
            <div className="sliderdiv">
                <div className="titlepart">
                    <p className='titleslider'>جدید ترین ها</p>
                    <img src={New} alt="" />
                </div>
                <ProductSlider/>
            </div>
            <PromoBanner/>
            <div className="sliderdiv1">
                <p className="titleslider1">پر فروش ترین ها</p>
                <ProductSlider/>
            </div>            
            <PromoBanner/>
            <Footer/>
        </div>

    );
}
export default mainPage