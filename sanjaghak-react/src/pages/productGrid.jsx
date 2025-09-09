import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import "/src/styles/productGrid.css";

function ProductGrid({ products = [], loading, error }) {
  const PRODUCTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = React.useState(1);
  const [imagesByProductId, setImagesByProductId] = useState({});
  const [pricesByProductId, setPricesByProductId] = useState({});

 const [productPricing, setProductPricing] = useState({});

  useEffect(() => {
    if (!products.length) return;

    async function fetchPricing() {
      const pricingMap = {};

      for (const product of products) {
        try {
          // 1. Check discount for product
          const discountRes = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/discount/max-discount/${product.productId}`);

          if (discountRes.status === 204) {
            // No discount - fetch variants, use first variant price
            const variantsRes = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/productVariants/getProductVariantByProductId?productId=${product.productId}`);

            if (variantsRes.ok) {
              const variants = await variantsRes.json();
              if (variants.length > 0) {
                pricingMap[product.productId] = {
                  price: variants[0].price,
                  salepercent: null,
                  salePrice: null,
                };
              }
            }
          } else if (discountRes.ok) {
            // Discount exists
            const discount = await discountRes.json();
            const variantId = discount.variantsId.variantId;

            // Fetch the discounted variant price
            const variantPriceRes = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/productVariants/${variantId}`);
            if (variantPriceRes.ok) {
              const variant = await variantPriceRes.json();
              const originalPrice = variant.price;
              const discountPercent = discount.discountPercentage;
              const discountedPrice = Math.round(originalPrice * (1 - discountPercent / 100));

              pricingMap[product.productId] = {
                price: originalPrice,
                salepercent: discountPercent + "%",
                salePrice: discountedPrice,
              };
            }
          } else {
            pricingMap[product.productId] = {
              price: null,
              salepercent: null,
              salePrice: null,
            };
          }
        } catch (err) {
          console.error("Error fetching pricing for product:", product.productId, err);
          pricingMap[product.productId] = {
            price: null,
            salepercent: null,
            salePrice: null,
          };
        }
      }

      setProductPricing(pricingMap);
    }

    fetchPricing();
  }, [products]);
  useEffect(() => {
    if (!products.length) return;

    async function fetchImages() {
      const promises = products.map(async (product) => {
        const res = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/productImages/${product.productId}`);
        if (!res.ok) return null;
        const images = await res.json();
        const primaryImage = images.find(img => img.primary === true);
        return { productId: product.productId, imageUrl: primaryImage ? primaryImage.imageUrl : null };
      });

      const results = await Promise.all(promises);
      const imagesMap = {};
      results.forEach(item => {
        if (item) imagesMap[item.productId] = item.imageUrl;
      });
      setImagesByProductId(imagesMap);
    }

    fetchImages();
  }, [products]);
  React.useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = Array.isArray(products) 
  ? products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE) 
  : [];
  if (loading) return <p>در حال بارگذاری محصولات...</p>;
  if (error) return <p>خطا: {error}</p>;
  if (products.length === 0) return <p>محصولی یافت نشد.</p>;

  return (
    <div className="productGridWrapper">
      <div className="productGridContainer">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.productId}
            name={product.productName}
            description={product.productDescription}
            model={product.model}
            price={productPricing[product.productId]?.price ?? "در حال بارگذاری..."}
            salepercent={productPricing[product.productId]?.salepercent}
            salePrice={productPricing[product.productId]?.salePrice}
            image={imagesByProductId[product.productId] ? `http://127.0.0.1:8080${imagesByProductId[product.productId]}` : "./src/assets/hedphone.jpg"}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="paginationControls">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            &lt;
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductGrid;