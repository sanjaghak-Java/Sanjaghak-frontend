import Navbar from "./navbar";
import CategoriesSwiper from "./categoriesSwiper";
import ImagePreview from "./imagePreview";
import PromoBanner from "./promoBanner";
import "./mainPage.css"
import ProductCard from "./ProductCard";
import ProductSlider from "./productSlider";

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

            </div>

    );
}
export default mainPage