import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "/src/styles/filter.css";

function Filter({ isOpen, onClose, brands = [], onApply }) {
  const minPrice = 0;
  const maxPrice = 1000000;

  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);

  if (!isOpen) return null;

  const toggleBrand = () => setIsBrandOpen((prev) => !prev);
  const togglePrice = () => setIsPriceOpen((prev) => !prev);

  const onSliderChange = (value) => {
    setPriceRange(value);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const handleApply = () => {
    const filterData = {
      brands: selectedBrands,
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
                  <label key={brand}>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    {brand}
                  </label>
                ))}
              </div>
            )}
          </div>

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
