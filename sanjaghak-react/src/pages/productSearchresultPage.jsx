import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import CategoryBox from "./categoryBox";
import Footer from "./Footer";
import Filter from "./Filter";
import BackgroundPattern from "./BackgroundPattern";

function ProductSearchResult() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productName = queryParams.get("productName");

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);

  const backgroundAreaRef = useRef(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (!productName) return;

    setLoadingProducts(true);
    setErrorProducts(null);

    const url = `http://127.0.0.1:8080/api/Sanjaghak/product/getProductsByfilter?productName=${encodeURIComponent(productName)}`;

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
  }, [productName]);

  return (
    <div>
      <Navbar />

      <div className="background-content-wrapper" ref={backgroundAreaRef}>
        <BackgroundPattern parentRef={backgroundAreaRef} />

        <CategoryBox
          products={products}
          loading={loadingProducts}
          error={errorProducts}
          onFilterClick={() => setIsFilterOpen(true)}
        />

        <Filter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />

        <Footer />
      </div>
    </div>
  );
}

export default ProductSearchResult;