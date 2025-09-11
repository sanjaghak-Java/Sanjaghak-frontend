import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import "/src/styles/productGrid.css";

function ProductGrid({ products = [], loading, error }) {
  const PRODUCTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [productDetails, setProductDetails] = useState({}); // contains price, salePrice, salepercent, image

  useEffect(() => {
    if (!products.length) return;

    async function fetchProductDetails() {
      const token = localStorage.getItem("token");
      const detailsMap = {};

      for (const product of products) {
        try {
          // ---------- Fetch Images ----------
          const imgRes = await fetch(
            `http://127.0.0.1:8080/api/Sanjaghak/productImages/${product.productId}`,
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
          );
          let imageUrl = "./src/assets/hedphone.jpg";
          if (imgRes.ok) {
            const images = await imgRes.json();
            const primaryImage = images.find((img) => img.primary);
            if (primaryImage) {
              imageUrl = `http://127.0.0.1:8080${primaryImage.imageUrl}`;
            }
          }

          // ---------- Fetch Variants ----------
          const variantRes = await fetch(
            `http://127.0.0.1:8080/api/Sanjaghak/productVariants/getProductVariantByProductId?productId=${product.productId}`,
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
          );

          if (!variantRes.ok) {
            detailsMap[product.productId] = {
              image: imageUrl,
              price: "ناموجود",
              salePrice: null,
              salepercent: "",
            };
            continue;
          }

          const variants = await variantRes.json();
          if (variants.length === 0) {
            detailsMap[product.productId] = {
              image: imageUrl,
              price: "ناموجود",
              salePrice: null,
              salepercent: "",
            };
            continue;
          }

          // ---------- Check Stock ----------
          let availableVariant = null;
          for (const variant of variants) {
            const stockRes = await fetch(
              `http://127.0.0.1:8080/api/Sanjaghak/inventoryStock/variant/${variant.variantId}/stock`,
              { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );
            if (!stockRes.ok) continue;
            const stockAmount = await stockRes.json();
            if (stockAmount > 0) {
              availableVariant = variant;
              break;
            }
          }

          if (!availableVariant) {
            detailsMap[product.productId] = {
              image: imageUrl,
              price: "ناموجود",
              salePrice: null,
              salepercent: "",
            };
            continue;
          }

          const originalPrice = availableVariant.price;

          // ---------- Fetch Discount ----------
          const discountRes = await fetch(
            `http://127.0.0.1:8080/api/Sanjaghak/discount/max-discount/${product.productId}`,
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
          );

          let discountData = null;
          if (discountRes.ok && discountRes.status !== 204) {
            discountData = await discountRes.json();
          }

          if (
            discountData &&
            discountData.active &&
            discountData.discountPercentage &&
            discountData.variantsId &&
            discountData.variantsId.variantId &&
            availableVariant.variantId === discountData.variantsId.variantId
          ) {
            const percent = discountData.discountPercentage;
            const salePercentStr = `${percent}%`;
            const salePrice = Math.floor(originalPrice * (1 - percent / 100));
            detailsMap[product.productId] = {
              image: imageUrl,
              price: originalPrice,
              salePrice,
              salepercent: salePercentStr,
            };
          } else {
            detailsMap[product.productId] = {
              image: imageUrl,
              price: originalPrice,
              salePrice: null,
              salepercent: "",
            };
          }
        } catch (err) {
          console.error("Error loading product:", product.productId, err);
          detailsMap[product.productId] = {
            image: "./src/assets/hedphone.jpg",
            price: "ناموجود",
            salePrice: null,
            salepercent: "",
          };
        }
      }

      setProductDetails(detailsMap);
    }

    fetchProductDetails();
  }, [products]);

  useEffect(() => {
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
            productId={product.productId}
            name={product.productName}
            model={product.model}
            price={
              productDetails[product.productId]?.price !== null &&
              productDetails[product.productId]?.price !== undefined &&
              productDetails[product.productId]?.price !== "ناموجود"
                ? productDetails[product.productId]?.price.toLocaleString()
                : productDetails[product.productId]?.price
            }
            salePrice={
              productDetails[product.productId]?.salePrice !== null &&
              productDetails[product.productId]?.salePrice !== undefined
                ? productDetails[product.productId]?.salePrice.toLocaleString()
                : ""
            }
            salepercent={productDetails[product.productId]?.salepercent}
            image={
              productDetails[product.productId]?.image ||
              "./src/assets/hedphone.jpg"
            }
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="paginationControls">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductGrid;