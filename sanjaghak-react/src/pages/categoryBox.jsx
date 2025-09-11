import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import ProductGrid from "./productGrid";
import "/src/styles/categoryBox.css";

function CategoryBox({ onFilterClick, products, loading, error }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const brandId = queryParams.get("brand");
  const banner = queryParams.get("banner");
  const categoryId = queryParams.get("category");

  const [categoryName, setCategoryName] = useState(null);
  const [brandName, setBrandName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (categoryId) {
      fetch(`http://127.0.0.1:8080/api/Sanjaghak/categories/${categoryId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch category");
          return res.json();
        })
        .then((data) => setCategoryName(data.categoryName || "دسته‌بندی"))
        .catch(() => setCategoryName("دسته‌بندی"));
    } else {
      setCategoryName(null);
    }

    if (brandId) {
      fetch(`http://127.0.0.1:8080/api/Sanjaghak/brand/${brandId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch brand");
          return res.json();
        })
        .then((data) => setBrandName(data.brandName || "برند"))
        .catch(() => setBrandName("برند"));
    } else {
      setBrandName(null);
    }
  }, [categoryId, brandId]);

const categoryTitle =
  [brandName, categoryName].filter(Boolean).join(" / ") || banner || "دسته‌بندی محصولات";

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
            <label className="filterLabel" tabIndex="0">
              فیلتر
            </label>
          </div>
          <label className="bestsellerLabel" tabIndex="0">
            پرفروش ترین ها
          </label>
          <label className="newestLabel" tabIndex="0">
            جدید ترین ها
          </label>
        </div>
      </div>
      <br />
      <ProductGrid products={products} loading={loading} error={error} />
    </div>
  );
}

export default CategoryBox;