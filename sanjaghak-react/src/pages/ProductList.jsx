import React, { useState, useEffect, useRef } from 'react';
import AdminProductCard from './AdminProductCard';
import AdminProductDetail from './ProductDetailadmin';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import "/src/styles/ProductListAdmin.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
const [refreshToggle, setRefreshToggle] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 24;
  const [jumpInput, setJumpInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchMode, setSearchMode] = useState("name");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [searchModeDropdownOpen, setSearchModeDropdownOpen] = useState(false);
  const searchModeRef = useRef(null);
 const [productImages, setProductImages] = useState({});
  async function fetchMainImages(products) {
  try {
    const imagesMap = {};

    await Promise.all(products.map(async (product) => {
      try {
        const res = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/productImages/${product.productId}`);
        if (!res.ok) throw new Error("Failed to fetch images");

        const images = await res.json();

        const primaryImage = images.find(img => img.required) || images[0] || null;

        if (primaryImage) {

          imagesMap[product.productId] = `http://127.0.0.1:8080${primaryImage.imageUrl}`;
          console.log("Product ID:", product.productId, "Image URL:", imagesMap[product.productId]);

        } else {
          imagesMap[product.productId] = null;
        }
      } catch (e) {
        imagesMap[product.productId] = null;
      }
    }));

    setProductImages(imagesMap);
  } catch (error) {
    console.error("Error fetching product images:", error);
  }
}
  useEffect(() => {
  if (products.length === 0) return;

  const prices = products.map(p => Number(p.price)).filter(p => !isNaN(p));
  if (prices.length === 0) return;

  const absoluteMinPrice = Math.min(...prices);
  const absoluteMaxPrice = Math.max(...prices);
  const priceBuffer = 1000;
  const adjustedMin = absoluteMinPrice;
  const adjustedMax = absoluteMinPrice === absoluteMaxPrice ? absoluteMaxPrice + priceBuffer : absoluteMaxPrice;

  if (
    priceRange[0] === 0 && priceRange[1] === 10000 || 
    priceRange[0] > adjustedMax || 
    priceRange[1] < adjustedMin
  ) {
    setPriceRange([adjustedMin, adjustedMax]);
  }
}, [products]);
async function fetchAllProducts() {
  try {
    const res = await fetch('http://127.0.0.1:8080/api/Sanjaghak/product/getProductsByfilter?page=0&size=1000');
    if (!res.ok) throw new Error('Failed to fetch products');
    const productData = await res.json();
    const allProducts = productData.content || productData;

    const variantRes = await fetch("http://127.0.0.1:8080/api/Sanjaghak/productVariants/getAllProductVariant");
    if (!variantRes.ok) throw new Error("Failed to fetch variants");
    const allVariants = await variantRes.json();

    const variantsMap = {};
    allVariants.forEach(variant => {
      if (!variantsMap[variant.productId]) {
        variantsMap[variant.productId] = [];
      }
      variantsMap[variant.productId].push(variant);
    });

    const productsWithPrices = allProducts.map(product => {
      const variants = variantsMap[product.productId] || [];

      const variantPrices = variants.map(v => parseFloat(v.price)).filter(p => !isNaN(p));
      const variantCosts = variants.map(v => parseFloat(v.costPrice)).filter(p => !isNaN(p));

      const minPrice = variantPrices.length ? Math.min(...variantPrices) : 0;
      const minCost = variantCosts.length ? Math.min(...variantCosts) : 0;

      return {
        ...product,
        price: minPrice,
        costPrice: minCost,
        variants,
      };
    });

    setProducts(productsWithPrices);

    const allPrices = allVariants.map(v => parseFloat(v.price)).filter(p => !isNaN(p));
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    setPriceRange([min, max]);

    fetchMainImages(productsWithPrices);
  } catch (err) {
    console.error("Error loading products and variants:", err);
  }
}
useEffect(() => {
  fetchAllProducts();
}, [refreshToggle]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('http://127.0.0.1:8080/api/Sanjaghak/categories/getAllCategory');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCategories();
  }, [refreshToggle]);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const response = await fetch('http://127.0.0.1:8080/api/Sanjaghak/brand/getAllBrands');
        if (!response.ok) throw new Error('Failed to fetch brands');
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchBrands();
  }, [refreshToggle]);

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.categoryId === categoryId);
    return cat ? cat.categoryName : "نامشخص";
  };

  const getBrandName = (brandId) => {
    const br = brands.find(b => b.brandId === brandId);
    return br ? br.brandName : "نامشخص";
  };

  const prices = products.map(p => Number(p.price));
  const absoluteMinPrice = prices.length ? Math.min(...prices) : 0;
  const absoluteMaxPrice = prices.length ? Math.max(...prices) : 10000;
  const priceBuffer = 1000;
  const adjustedMin = absoluteMinPrice;
  const adjustedMax = absoluteMinPrice === absoluteMaxPrice ? absoluteMaxPrice + priceBuffer : absoluteMaxPrice;

  useEffect(() => {
    setPriceRange([adjustedMin, adjustedMax]);
  }, [adjustedMin, adjustedMax]);

  const filteredProducts = products.filter(product => {
    const search = searchText.toLowerCase();

    const productName = (product.productName || "").toString().toLowerCase();
    const productId = product.productId?.toString() || "";
    const productCategoryId = product.categories?.categoryId || "";
    const productBrandId = product.brands?.brandId || "";

    const matchesSearch = searchMode === 'name'
      ? productName.includes(search)
      : productId === search;

    const matchesCategory = filterCategory ? productCategoryId === filterCategory : true;
    const matchesBrand = filterBrand ? productBrandId === filterBrand : true;

    const productPrice = Number(product.price);
    const matchesPrice = !isNaN(productPrice) && productPrice >= priceRange[0] && productPrice <= priceRange[1];

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

const enhancedCurrentProducts = currentProducts.map(product => ({
  ...product,
  categoryName: getCategoryName(product.categories?.categoryId),
  brandName: getBrandName(product.brands?.brandId),
  mainImageUrl: productImages[product.productId] || null,
}));

  const handleJump = () => {
    const page = parseInt(jumpInput, 10);
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchModeRef.current && !searchModeRef.current.contains(event.target)) {
        setSearchModeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (selectedProduct) {
    return (
      <AdminProductDetail
        product={selectedProduct}
              onBack={() => {
        setSelectedProduct(null);
        setRefreshToggle(prev => !prev); 
      }}
        categories={categories}
        brands={brands}
      />
    );
  }
  

  return (
    <div className="adminProductListContainer">
      <div
        className="adminProductList__controls"
        style={{ gap: "12px", flexWrap: "wrap", position: "relative", alignItems: 'center' }}
      >
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input
            type="text"
            placeholder={searchMode === 'name' ? "جستجو بر اساس نام محصول" : "جستجو بر اساس شناسه محصول"}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="supplier-search"
            style={{ flexGrow: 1, height: '36px', fontSize: '16px' }}
          />
          <button
          className='searchModeToggleBtn'
            onClick={() => setSearchModeDropdownOpen(prev => !prev)}
            style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer"
            }}
            aria-label="Toggle Search Mode"
            type="button"
          >
            {/* ▼ */}
              <span style={{ display: "flex", alignItems: "center" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
          </button>

          {searchModeDropdownOpen && (
            <div
              ref={searchModeRef}
              // style={{
              //   position: "absolute",
              //   top: "100%",
              //   left: 0,
              //   background: "white",
              //   border: "1px solid #d54343",
              //   borderRadius: "8px",
              //   marginTop: "4px",
              //   zIndex: 1000,
              //   boxShadow: "0 4px 10px rgba(213,67,67,0.15)",
              //   minWidth: 280,
              // }}
              className='searchModeDropdown'
            >
              <div
                // style={{
                //   padding: "8px 12px",
                //   cursor: "pointer",
                //   backgroundColor: searchMode === 'name' ? "#f8dede" : "transparent",
                //   fontWeight: searchMode === 'name' ? '700' : 'normal',
                //   color: "#d54343"
                // }}
                className={`searchModeOption ${
                  searchMode === "name" ? "selected" : ""
                }`}
                onClick={() => {
                  setSearchMode('name');
                  setSearchModeDropdownOpen(false);
                }}
              >
                جستجو بر اساس نام
              </div>
              <div
                // style={{
                //   padding: "8px 12px",
                //   cursor: "pointer",
                //   backgroundColor: searchMode === 'id' ? "#f8dede" : "transparent",
                //   fontWeight: searchMode === 'id' ? '700' : 'normal',
                //   color: "#d54343"
                // }}
                className={`searchModeOption ${
                  searchMode === "id" ? "selected" : ""
                }`}
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

        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="discounts-select"
          style={{ minWidth: 150 }}
        >
          <option value="">همه دسته‌ها</option>
          {categories.map(cat => (
            <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
          ))}
        </select>

        <select
          value={filterBrand}
          onChange={e => setFilterBrand(e.target.value)}
          className="discounts-select"
          style={{ minWidth: 150 }}
        >
          <option value="">همه برندها</option>
          {brands.map(brand => (
            <option key={brand.brandId} value={brand.brandId}>{brand.brandName}</option>
          ))}
        </select>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setFilterDropdownOpen(prev => !prev)}
            className={`filterButton ${filterDropdownOpen ? "active" : ""}`}
            // style={{
            //   padding: "8px 16px",
            //   borderRadius: "8px",
            //   border: "2px solid #d54343",
            //   backgroundColor: filterDropdownOpen ? "#d54343" : "white",
            //   color: filterDropdownOpen ? "white" : "#d54343",
            //   fontWeight: "700",
            //   cursor: "pointer",
            //   transition: "background-color 0.3s, color 0.3s",
            //   minWidth: 120,
            //   height: '36px',
            // }}
            type="button"
          >
            فیلتر قیمت
            <span style={{display: "flex", alignItems: "center"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
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
                boxShadow: "0 8px 24px rgba(213,67,67,0.25)",
                width: 300,
                zIndex: 1000,
              }}
            >
              <Slider
                range
                min={adjustedMin}
                max={adjustedMax}
                value={priceRange}
                onChange={setPriceRange}
                allowCross={false}
                trackStyle={[{ backgroundColor: '#d54343' }]}
                handleStyle={[
                  { borderColor: '#d54343' },
                  { borderColor: '#d54343' }
                ]}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontWeight: 'bold', color: '#d54343' }}>
                <span>{priceRange[0].toLocaleString()} تومان</span>
                <span>{priceRange[1].toLocaleString()} تومان</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="adminProductList__grid fadeIn" key={currentPage}>
        {enhancedCurrentProducts.length > 0 ? (
          enhancedCurrentProducts.map(product => (
            <AdminProductCard
              key={product.productId}
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