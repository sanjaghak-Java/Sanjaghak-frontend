import Navbar from "./navbar";
import CategoriesSwiper from "./categoriesSwiper";
import ImagePreview from "./imagePreview";
import PromoBanner from "./promoBanner";
import "/src/styles/mainPage.css"
import ProductCard from "./ProductCard";
import ProductSlider from "./productSlider";
import Footer from "./Footer";

function mainPage(){
    return(
        <div className="mainPageContainer"> 
            <Navbar/>
            <ImagePreview/>
            <div>
                <CategoriesSwiper/>
            </div>
            <PromoBanner/>
            <ProductSlider/>
            <PromoBanner/>
            <ProductSlider/>
            <PromoBanner/>
            <Footer/>
        </div>

    );
}
export default mainPage