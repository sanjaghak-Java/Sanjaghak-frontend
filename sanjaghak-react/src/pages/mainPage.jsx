import Navbar from "./navbar";
import CategoriesSwiper from "./categoriesSwiper";


function mainPage(){
    return(
        <div>
            <Navbar/>
            <div style={{marginTop:"200px",marginLeft:"750px"}}>
            <CategoriesSwiper/>
            </div>
        </div>

    );
}
export default mainPage