import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import CategoryBox from "./categoryBox";
import Footer from "./Footer";
import Filter from "./Filter";
import BackgroundPattern from "./BackgroundPattern";

function CategoryPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");
  const brandId = queryParams.get("brand");

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);

  const backgroundAreaRef = useRef(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    setLoadingProducts(true);
    setErrorProducts(null);

    let url = `http://127.0.0.1:8080/api/Sanjaghak/product/getProductsByfilter?`;

    if (categoryId) url += `categoryId=${categoryId}&`;
    if (brandId) url += `brandId=${brandId}&`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت محصولات");
        return res.json();
      })
.then((data) => {
  console.log("Fetched products:", data);
  setProducts(Array.isArray(data.content) ? data.content : []);
})
      .catch((err) => {
        setErrorProducts(err.message);
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, [categoryId, brandId]);

  return (
    <div>
      <Navbar />

      <div className="background-content-wrapper" ref={backgroundAreaRef}>
        <BackgroundPattern parentRef={backgroundAreaRef} />

        <CategoryBox
          products={isFilterOpen ? filteredProducts : products}
          loading={loadingProducts}
          error={errorProducts}
          onFilterClick={() => setIsFilterOpen(true)}
        />

        <Filter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          brands={[]}
onApply={(data) => {
  const result = products.filter((p) => {
    // Check brand
    const brandMatch =
      data.brands.length > 0 ? p.brand && data.brands.includes(p.brands.brandId) : true;

    // Check price


    return brandMatch ;
  });

  setFilteredProducts(result);
  setIsFilterOpen(false); // optional: close filter
}}
        />

        <Footer />
      </div>
    </div>
  );
}

export default CategoryPage;