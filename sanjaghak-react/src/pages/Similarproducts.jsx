import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "/src/styles/Similarproducts.css";
import ProductCard from "./ProductCard";

function Similarproducts({ categoryId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return; // Don't fetch if no category provided
    const token = localStorage.getItem("token");

    fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/product/getProductsByfilter?active=true&categoryId=${categoryId}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch similar products");
        return res.json();
      })
.then(async (data) => {
  const productList = data.content || []; // extract array
  const productsWithDetails = await Promise.all(
    productList.map(async (product) => {
            try {
              // fetch image
              const imgRes = await fetch(
                `http://127.0.0.1:8080/api/Sanjaghak/productImages/${product.productId}`,
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
              );
              let imageUrl = "/path/to/default-image.jpg";
              if (imgRes.ok) {
                const images = await imgRes.json();
                const primaryImage = images.find((img) => img.primary);
                if (primaryImage)
                  imageUrl = `http://127.0.0.1:8080${primaryImage.imageUrl}`;
              }

              // fetch variants
              const variantRes = await fetch(
                `http://127.0.0.1:8080/api/Sanjaghak/productVariants/getProductVariantByProductId?productId=${product.productId}`,
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
              );
              if (!variantRes.ok) throw new Error("Failed to fetch variants");
              const variants = await variantRes.json();

              if (variants.length === 0) {
                return {
                  ...product,
                  image: imageUrl,
                  price: "ناموجود",
                  salePrice: null,
                  salepercent: "",
                };
              }

              // fetch discount
              const discountRes = await fetch(
                `http://127.0.0.1:8080/api/Sanjaghak/discount/max-discount/${product.productId}`,
                { headers: token ? { Authorization: `Bearer ${token}` } : {} }
              );
              let discountData = null;
              if (discountRes.ok && discountRes.status !== 204) {
                discountData = await discountRes.json();
              }

              // find available variant with stock
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
                return {
                  ...product,
                  image: imageUrl,
                  price: "ناموجود",
                  salePrice: null,
                  salepercent: "",
                };
              }

              const originalPrice = availableVariant.price;

              if (
                discountData &&
                discountData.active &&
                discountData.discountPercentage &&
                discountData.variantsId &&
                discountData.variantsId.variantId &&
                availableVariant.variantId === discountData.variantsId.variantId
              ) {
                const percent = discountData.discountPercentage;
                const salePrice = Math.floor(originalPrice * (1 - percent / 100));
                return {
                  ...product,
                  image: imageUrl,
                  price: originalPrice,
                  salePrice,
                  salepercent: `${percent}%`,
                };
              } else {
                return {
                  ...product,
                  image: imageUrl,
                  price: originalPrice,
                  salePrice: null,
                  salepercent: "",
                };
              }
            } catch {
              return {
                ...product,
                image: "/path/to/default-image.jpg",
                price: "ناموجود",
                salePrice: null,
                salepercent: "",
              };
            }
          })
        );

        setProducts(productsWithDetails);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [categoryId]);

  if (loading) return <div>در حال بارگذاری محصولات مشابه...</div>;
  if (error) return <div>خطا در بارگذاری محصولات مشابه: {error}</div>;

  return (
    <div className="similar-box">
      <div className="similar-productSwiperContainer">
        <Swiper
          className="similar-productSwiper"
          dir="rtl"
          navigation
          loop={true}
          spaceBetween={80}
          slidesPerView={4}
          slidesPerGroup={1}
          modules={[Navigation]}
          initialSlide={0}
          breakpoints={{
            0: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 0 },
            768: { slidesPerView: 3, slidesPerGroup: 1, spaceBetween: 40 },
            1024: { slidesPerView: 4, slidesPerGroup: 1, spaceBetween: 80 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide
              className="similar-productSwiperSlide"
              key={product.productId}
            >
              <ProductCard
                productId={product.productId}
                name={product.productName}
                image={product.image || "/path/to/default-image.jpg"}
                model={product.model}
                price={
                  product.price !== null && product.price !== undefined
                    ? product.price.toLocaleString()
                    : ""
                }
                salePrice={
                  product.salePrice !== null && product.salePrice !== undefined
                    ? product.salePrice.toLocaleString()
                    : ""
                }
                salepercent={product.salepercent}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Similarproducts;