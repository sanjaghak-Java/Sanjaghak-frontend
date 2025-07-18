import React, { useState, useEffect, useRef } from 'react';
import AdminProductCard from './AdminProductCard';
import AdminProductDetail from './ProductDetailadmin';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import "/src/styles/ProductListAdmin.css";

function ProductList({ products = [] }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 24;
  const [jumpInput, setJumpInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchMode, setSearchMode] = useState("name"); // 'name' or 'id'
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [searchModeDropdownOpen, setSearchModeDropdownOpen] = useState(false);
  const searchModeRef = useRef(null);

  // Close search mode dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchModeRef.current && !searchModeRef.current.contains(event.target)) {
        setSearchModeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate price bounds dynamically
  const prices = products.map(p => p.price);
  const absoluteMinPrice = prices.length ? Math.min(...prices) : 0;
  const absoluteMaxPrice = prices.length ? Math.max(...prices) : 10000;
  const priceBuffer = 1000;
  const adjustedMin = absoluteMinPrice;
  const adjustedMax = absoluteMinPrice === absoluteMaxPrice
    ? absoluteMaxPrice + priceBuffer
    : absoluteMaxPrice;

  useEffect(() => {
    setPriceRange([adjustedMin, adjustedMax]);
  }, [adjustedMin, adjustedMax]);

  // Filtered products
  const filteredProducts = products.filter(product => {
    const search = searchText.toLowerCase();

    const matchesSearch = searchMode === 'name'
      ? product.name.toLowerCase().includes(search)
      : product.id.toString() === search;

    const matchesCategory = filterCategory ? product.category === filterCategory : true;
    const matchesBrand = filterBrand ? product.brand === filterBrand : true;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const handleJump = () => {
    const page = parseInt(jumpInput);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
    setJumpInput("");
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  if (selectedProduct) {
    return (
      <AdminProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <div className="adminProductListContainer">
      <div
        className="adminProductList__controls"
        style={{ gap: "12px", flexWrap: "wrap", position: "relative", alignItems: 'center' }}
      >
        {/* Search Input with Left Arrow Button */}
        <div style={{ position: "relative", minWidth: 280, display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => setSearchModeDropdownOpen(prev => !prev)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#d54343',
              fontSize: '24px',
              marginRight: '8px',
              userSelect: 'none',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              height: '36px',
              lineHeight: '1',
            }}
            aria-label="Toggle Search Mode"
            type="button"
          >
            ▼
          </button>

          <input
            type="text"
            placeholder={searchMode === 'name' ? "جستجو بر اساس نام محصول" : "جستجو بر اساس شناسه محصول"}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="adminProductList__search"
            style={{ flexGrow: 1, height: '36px', fontSize: '16px' }}
          />

          {/* Search Mode Dropdown */}
          {searchModeDropdownOpen && (
            <div
              ref={searchModeRef}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                background: "white",
                border: "1px solid #d54343",
                borderRadius: "8px",
                marginTop: "4px",
                zIndex: 1000,
                boxShadow: "0 4px 10px rgba(213,67,67,0.15)",
                minWidth: 280,
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  backgroundColor: searchMode === 'name' ? "#f8dede" : "transparent",
                  fontWeight: searchMode === 'name' ? '700' : 'normal',
                  color: "#d54343"
                }}
                onClick={() => {
                  setSearchMode('name');
                  setSearchModeDropdownOpen(false);
                }}
              >
                جستجو بر اساس نام
              </div>
              <div
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  backgroundColor: searchMode === 'id' ? "#f8dede" : "transparent",
                  fontWeight: searchMode === 'id' ? '700' : 'normal',
                  color: "#d54343"
                }}
                onClick={() => {
                  setSearchMode('id');
                  setSearchModeDropdownOpen(false);
                }}
              >
                جستجو بر اساس شناسه
              </div>
            </div>
          )}
        </div>

        {/* Category Dropdown */}
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="adminProductList__filter"
          style={{ minWidth: 150 }}
        >
          <option value="">همه دسته‌ها</option>
          <option value="دسته ۱">دسته ۱</option>
          <option value="دسته ۲">دسته ۲</option>
          <option value="دسته ۳">دسته ۳</option>
        </select>

        {/* Brand Dropdown */}
        <select
          value={filterBrand}
          onChange={e => setFilterBrand(e.target.value)}
          className="adminProductList__filter"
          style={{ minWidth: 150 }}
        >
          <option value="">همه برندها</option>
          <option value="برند ۱">برند ۱</option>
          <option value="برند ۲">برند ۲</option>
          <option value="برند ۳">برند ۳</option>
        </select>

        {/* Filter Button */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setFilterDropdownOpen(prev => !prev)}
            className="adminProductList__filterButton"
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "2px solid #d54343",
              backgroundColor: filterDropdownOpen ? "#d54343" : "white",
              color: filterDropdownOpen ? "white" : "#d54343",
              fontWeight: "700",
              cursor: "pointer",
              transition: "background-color 0.3s, color 0.3s",
              minWidth: 120,
              height: '36px',
            }}
            type="button"
          >
            فیلتر قیمت
          </button>

          {filterDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "8px",
                padding: "12px",
                backgroundColor: "white",
                border: "1px solid #d54343",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(213,67,67,0.15)",
                width: 280,
                zIndex: 1000,
              }}
            >
              <p
                style={{
                  margin: '0 0 8px 0',
                  fontWeight: '700',
                  color: '#7a2e2e',
                  userSelect: 'none',
                  textAlign: 'center',
                }}
              >
                قیمت: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} تومان
              </p>
              <Slider
                range
                min={adjustedMin}
                max={adjustedMax}
                value={priceRange}
                onChange={setPriceRange}
                trackStyle={[{ backgroundColor: '#d54343' }]}
                handleStyle={[
                  { borderColor: '#d54343' },
                  { borderColor: '#d54343' }
                ]}
                railStyle={{ backgroundColor: '#e0b1b1' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="adminProductList__grid fadeIn" key={currentPage}>
        {currentProducts.length > 0 ? (
          currentProducts.map(product => (
            <AdminProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#7a2e2e', marginTop: '40px' }}>
            محصولی پیدا نشد
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="adminProductList__pagination">
          <button onClick={handlePrev} disabled={currentPage === 1}>قبلی</button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={currentPage === idx + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}

          <button onClick={handleNext} disabled={currentPage === totalPages}>بعدی</button>

          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpInput}
            onChange={e => setJumpInput(e.target.value)}
            placeholder="برو به صفحه"
            className="adminProductList__jumpInput"
          />
          <button onClick={handleJump}>برو</button>
        </div>
      )}
    </div>
  );
}

export default ProductList;