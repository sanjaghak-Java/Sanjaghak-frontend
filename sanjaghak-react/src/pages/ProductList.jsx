import React, { useState } from 'react';
import AdminProductCard from './AdminProductCard';
import AdminProductDetail from './ProductDetailadmin';
import "/src/styles/ProductListAdmin.css";

function ProductList({ products = [] }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [jumpInput, setJumpInput] = useState("");

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  const handleJump = () => {
    const page = parseInt(jumpInput);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
    setJumpInput("");
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

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
      <div className="adminProductList__grid fadeIn" key={currentPage}>
        {currentProducts.map((product) => (
          <AdminProductCard
            key={product.id}
            product={product}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="adminProductList__pagination">
          <button onClick={handlePrev} disabled={currentPage === 1}>
            قبلی
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={currentPage === idx + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}

          <button onClick={handleNext} disabled={currentPage === totalPages}>
            بعدی
          </button>

          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value)}
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