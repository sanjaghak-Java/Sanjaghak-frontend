import { useLocation } from "react-router-dom";
import ProductGrid from "./productGrid";
import "/src/styles/categoryBox.css";

function CategoryBox({ onFilterClick, products, loading, error }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const brand = queryParams.get("brand");
  const banner = queryParams.get("banner");
  const category = queryParams.get("category");

  const categoryTitle = brand || banner || category || "دسته‌بندی محصولات";

  return (
    <div className="categoryBox">
      <div className="labelsContainer">
        <p className="categoryTitle">{categoryTitle}</p>
        <div className="labelGroup">
          <div className="filterWrapper" onClick={onFilterClick}>
            <img
              className="filterImg"
              src="/src/assets/icons8-filter-32.png"
              alt="filter"
            />
            <label className="filterLabel" tabIndex="0">فیلتر</label>
          </div>
          <label className="bestsellerLabel" tabIndex="0">پرفروش ترین ها</label>
          <label className="newestLabel" tabIndex="0">جدید ترین ها</label>
        </div>
      </div>
      <br />
      <ProductGrid products={products} loading={loading} error={error} />
    </div>
  );
}

export default CategoryBox;