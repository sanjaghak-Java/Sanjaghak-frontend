import React, { useState } from "react";
import ProductCard from "./ProductCard";
import "/src/styles/productGrid.css";

function ProductGrid() {
  const products = [
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"},
    { name: "هدفون بی سیم بیتس Studio 3", image: "./src/assets/hedphone.jpg" ,model:"coolest",salepercent:"20%",salePrice:"160000",price:"100000"}

  ];

  const PRODUCTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="productGridWrapper">
      <div className="productGridContainer">
        {currentProducts.map((product, i) => (
          <ProductCard
            key={i}
            name={product.name}
            image={product.image}
            model={product.model}
            salepercent={product.salepercent}
            salePrice={product.salePrice}
            price={product.price}
          />
        ))}
      </div>

      <div className="paginationControls">
        <button onClick={goToPrevPage} disabled={currentPage === 1}>&lt;</button>
        <span>{totalPages} / {currentPage}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>&gt;</button>
      </div>
    </div>
  );
}

export default ProductGrid;
