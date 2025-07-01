import ProductGrid from "./productGrid";
import "/src/styles/categoryBox.css"



function CategoryBox(props) {
    return (

        <div className="categoryBox">
            <div className="labelsContainer">
                <p className="categoryTitle">لپ تاپ</p>
                <div className="labelGroup">
                    <div className="filterWrapper">
                        <img className="filterImg" src="/src/assets/icons8-filter-32.png" />
                        <label className="filterLabel" tabIndex="0">فیلتر</label>
                    </div>
                    <label className="bestsellerLabel" tabIndex="0">پرفروش ترین ها</label>
                    <label className="newestLabel" tabIndex="0">جدید ترین ها</label>
                </div>
            </div>
            <br />
            <ProductGrid />
        </div>

    );
}
export default CategoryBox