import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "/src/styles/categorySwiper.css";
import ProductCard from "./ProductCard";
import "/src/styles/productSlider.css";

function BestSellerSlider() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("http://127.0.0.1:8080/api/Sanjaghak/Orders/top-selling", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch top selling products");
      return res.json();
    })
    .then(async (data) => {
      // If the API returns product objects or just IDs, adjust accordingly
      // Assuming it returns an array of product objects or at least with productId
      const topSelling = data.slice(0, 15);

      const productsWithDetails = await Promise.all(
        topSelling.map(async (product) => {
          try {
            // Fetch images
            const imgRes = await fetch(
              `http://127.0.0.1:8080/api/Sanjaghak/productImages/${product.productId}`,
              { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );
            if (!imgRes.ok) throw new Error("Failed to fetch images");
            const images = await imgRes.json();
            const primaryImage = images.find((img) => img.primary);
            const imageUrl = primaryImage
              ? `http://127.0.0.1:8080${primaryImage.imageUrl}`
              : "/path/to/default-image.jpg";

            // Fetch variants
            const variantRes = await fetch(
              `http://127.0.0.1:8080/api/Sanjaghak/productVariants/getProductVariantByProductId?productId=${product.productId}`,
              { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );
            if (!variantRes.ok) throw new Error("Failed to fetch variants");
            const variants = await variantRes.json();

            // Fetch discount
            const discountRes = await fetch(
              `http://127.0.0.1:8080/api/Sanjaghak/discount/max-discount/${product.productId}`,
              { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            );

            let discountData = null;
            if (discountRes.ok) {
              if (discountRes.status === 204) {
                discountData = null;
              } else {
                discountData = await discountRes.json();
              }
            }

            if (variants.length > 0) {
              const originalPrice = variants[0].price;

              if (
                discountData &&
                discountData.active &&
                discountData.discountPercentage &&
                discountData.variantsId &&
                discountData.variantsId.variantId &&
                variants[0].variantId === discountData.variantsId.variantId
              ) {
                const percent = discountData.discountPercentage;
                const salePercentStr = `${percent}%`;
                const salePrice = Math.floor(originalPrice * (1 - percent / 100));
                return {
                  ...product,
                  image: imageUrl,
                  price: originalPrice,
                  salePrice,
                  salepercent: salePercentStr,
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
            } else {
              return {
                ...product,
                image: imageUrl,
                price: null,
                salePrice: null,
                salepercent: "",
              };
            }
          } catch {
            return {
              ...product,
              image: "/path/to/default-image.jpg",
              price: null,
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
}, []);
  if (loading) return <div>در حال بارگذاری محصولات...</div>;
  if (error) return <div>خطا در بارگذاری محصولات: {error}</div>;

  return (
    <div className="productSwiperContainer">
      <Swiper
        className="productSwiper"
        dir="rtl"
        navigation
        loop={true}
        spaceBetween={50}
        slidesPerView={5}
        slidesPerGroup={1}
        modules={[Navigation]}
        initialSlide={0}
        breakpoints={{
          0: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 0 },
          768: { slidesPerView: 5, slidesPerGroup: 1, spaceBetween: 50 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide className="productSwiperSlide" key={product.productId}>
            <ProductCard
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
  );
}

export default BestSellerSlider;