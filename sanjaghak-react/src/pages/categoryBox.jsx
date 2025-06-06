

import ProductGrid from "./productGrid";
import "/src/styles/categoryBox.css"



function CategoryBox(props){
    return(
        
        <div className="categoryBox">
            <div className="labelsContainer">
            <p className="categoryTitle">title</p>
            <div className="labelGroup">
                <label className="bestsellerLabel" tabIndex="0">bestseller</label>
                <label className="newestLabel" tabIndex="0">newest</label>
                <div className="filterWrapper">
                <img className="filterImg" src="#" />
                <label className="filterLabel" tabIndex="0">filter</label>
                </div>
            </div>
            </div>
            <hr/>
            <br/>
            <ProductGrid/>
        </div>

    );
}
export default CategoryBox