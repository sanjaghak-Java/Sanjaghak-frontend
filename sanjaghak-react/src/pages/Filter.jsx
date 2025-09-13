import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "/src/styles/filter.css";

function Filter({ isOpen, onClose, onApply }) {
  const minPrice = 0;
  const maxPrice = 1000000;

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  const [brands, setBrands] = useState([]); // fetched brands
  const [selectedBrands, setSelectedBrands] = useState([]);

  // 🔹 Fetch brands from API
  useEffect(() => {
    if (!isOpen) return; // fetch only when modal is open
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8080/api/Sanjaghak/brand/getActiveBrands", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch brands");
        return res.json();
      })
      .then((data) => {
        setBrands(data || []);
      })
      .catch((err) => {
        console.error("Error fetching brands:", err);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleBrand = () => setIsBrandOpen((prev) => !prev);
  const togglePrice = () => setIsPriceOpen((prev) => !prev);

  const onSliderChange = (value) => {
    setPriceRange(value);
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handleApply = () => {
    const filterData = {
      brands: selectedBrands, // ✅ returns array of brandIds
      priceRange,
    };
    if (onApply) onApply(filterData);
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="filter-backdrop" onClick={onClose}>
      <div
        className="filter-itself"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-title"
      >
        <div className="filter-title" id="filter-title">
          <div className="filter-title-right">
            <img
              className="filter-header-img"
              src="/src/assets/icons8-filter.png"
              alt="فیلتر"
            />
            <h2 className="filter-header-title">فیلتر</h2>
          </div>
          <img
            src="/src/assets/close-icon.png"
            alt="بستن"
            className="filter-close"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          />
        </div>
        <hr />

        <div className="filter-content">
          {/* 🔹 Brand Section */}
          <div className={`filter-section ${isBrandOpen ? "open" : ""}`}>
            <div className="filter-brand-header" onClick={toggleBrand}>
              <h5 className="filter-brand-name">برند</h5>
              <img
                src="/src/assets/arrow-up.png"
                alt="باز/بسته"
                className="filter-arrow-up"
                style={{
                  transform: isBrandOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </div>
            {isBrandOpen && (
              <div className="filter-brand-content">
                {brands.map((brand) => (
                  <label key={brand.brandId}>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.brandId)}
                      onChange={() => handleBrandChange(brand.brandId)}
                    />
                    {brand.brandName}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 🔹 Price Section */}
          <div className={`filter-section ${isPriceOpen ? "open" : ""}`}>
            <div className="filter-brand-header" onClick={togglePrice}>
              <h5 className="filter-brand-name">قیمت</h5>
              <img
                src="/src/assets/arrow-up.png"
                alt="باز/بسته"
                className="filter-arrow-up"
                style={{
                  transform: isPriceOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </div>
            {isPriceOpen && (
              <div
                className="filter-price-content"
                style={{ padding: "10px 0" }}
                dir="ltr"
              >
                <Slider
                  range
                  min={minPrice}
                  max={maxPrice}
                  step={10000}
                  value={priceRange}
                  onChange={onSliderChange}
                  allowCross={false}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <span>{priceRange[0].toLocaleString()} تومان</span>
                  <span>{priceRange[1].toLocaleString()} تومان</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="Apply-filter-box">
          <button className="Apply-filter-button" onClick={handleApply}>
            اعمال فیلتر
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default Filter;