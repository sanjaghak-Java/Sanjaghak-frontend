import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "/src/styles/product.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProductIntroduction from "./PorductIntroduction";
import Cartreport from "./Cartreport";
import ProductDetail from "./Productdetail";
import ProductSpecifications from "./ProductSpecifications";
import Similarproducts from "./Similarproducts";
import BackgroundPattern from "./BackgroundPattern";

function Product() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [brand, setBrand] = useState({ name: "نامشخص", logo: "default-logo.png" });
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCartReport, setShowCartReport] = useState(false);
  const backgroundAreaRef = useRef(null);
  const [productAttributes, setProductAttributes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const resProduct = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/product/${productId}`);
        if (!resProduct.ok) throw new Error("Failed to fetch product");
        const productData = await resProduct.json();
        setProduct(productData);

        if (productData.brands?.brandId) {
          const resBrand = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/brand/${productData.brands.brandId}`);
          if (resBrand.ok) {
            const brandData = await resBrand.json();
            setBrand({
              name: brandData.brandName || "نامشخص",
              logo: brandData.logoUrl ? `http://127.0.0.1:8080${brandData.logoUrl}` : "default-logo.png",
            });
          
          } else {
            setBrand({ name: "نامشخص", logo: "default-logo.png" });
          }
        } else {
          setBrand({ name: "نامشخص", logo: "default-logo.png" });
        }

        const resVariants = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/productVariants/getProductVariantByProductId?productId=${productId}`);
        if (!resVariants.ok) throw new Error("Failed to fetch variants");
        const variantsData = await resVariants.json();
        setVariants(variantsData.filter(v => v.active));

        const resImages = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/productImages/${productId}`);
        if (!resImages.ok) throw new Error("Failed to fetch images");
        const imagesData = await resImages.json();
        const formattedImages = imagesData.map(img => ({
          src: `http://127.0.0.1:8080${img.imageUrl}`,
          colorName: img.altText || "تصویر محصول",
          hex: "#ccc", 
        }));
        setImages(formattedImages);
        const resAttributes = await fetch(
  `http://127.0.0.1:8080/api/Sanjaghak/productAttributeValue/getValueByProductId/${productId}`
);
if (resAttributes.ok) {
  const attrData = await resAttributes.json();

  const formattedAttributes = attrData.map(item => ({
    id: item.id,
    value: item.value,
    attributeId: item.attributeId.attributeId,
    attributeName: item.attributeId.attributeName,
    attributeType: item.attributeId.attributeType,
  }));

  setProductAttributes(formattedAttributes);
} else {
  setProductAttributes([]);
}
      } catch (error) {
        console.error(error);
        setProduct(null);
        setBrand({ name: "نامشخص", logo: "default-logo.png" });
        setVariants([]);
        setImages([]);
      } finally {
        setLoading(false);
      }
    }
    

    if (productId) {
      fetchData();
    }
    
  }, [productId]);

  const handleAddToCart = () => setShowCartReport(true);
  const handleCloseCartReport = () => setShowCartReport(false);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>در حال بارگذاری...</div>;
  }

  if (!product) {
    return <div style={{ textAlign: "center", marginTop: "2rem" }}>محصول پیدا نشد</div>;
  }

  const colors = variants.map(v => ({
    name: v.color,
    hex: v.hexadecimal,
  }));
  console.log(productAttributes)
const fixedSpecs = [
  { label: "مدل", value: product.model },
  { label: "وزن", value: product.weight ? `${product.weight} گرم` : "" },
  { label: "طول", value: product.length ? `${product.length} میلی‌متر` : "" },
  { label: "عرض", value: product.width ? `${product.width} میلی‌متر` : "" },
  { label: "ارتفاع", value: product.height ? `${product.height} میلی‌متر` : "" },
];

const dynamicSpecs = productAttributes
  .filter(attr => attr.value && attr.value.trim() !== "") 
  .map(attr => ({
    label: attr.attributeName + (attr.attributeType ? ` (${attr.attributeType})` : ""),
    value: attr.value,
  }));

const allSpecs = [...fixedSpecs, ...dynamicSpecs];


  return (
    <>
      <Navbar />

      <div className="background-content-wrapper" ref={backgroundAreaRef}>
        <BackgroundPattern parentRef={backgroundAreaRef} />

<ProductDetail
  product={{
    title: product.productName,
    brand,
    introduction: product.productDescription,
    model: product.model,
    weight: product.weight,
    length: product.length,
    width: product.width,
    height: product.height,
    colors,
    images,
    variants,
    productId:product.productId
  }}
  requiredAttributes={productAttributes} 
  onAddToCart={handleAddToCart}
/>

        <hr className="hr-side" />
        <p className="Information-title">
          <span style={{ color: "#dc2655" }}>●</span> معرفی
        </p>
        <ProductIntroduction text={product.productDescription} />

        <p className="Information-title">
          <span style={{ color: "#dc2655" }}>●</span> مشخصات
        </p>
<ProductSpecifications
  specifications={allSpecs}
/>

        <div className="similar-dev">
          <hr className="hr-side" />
          <h1 className="similar-title">محصولات مشابه</h1>
          <Similarproducts categoryId={product.categories?.categoryId} />
        </div>

        {showCartReport && <Cartreport onClose={handleCloseCartReport} />}

        <Footer />
      </div>
    </>
  );
}

export default Product;