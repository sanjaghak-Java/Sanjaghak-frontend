import React, { useState, useRef, useEffect } from 'react';
import "/src/styles/ProfileFavorite.css";
import Navbar from './Navbar';
import Footer from './Footer';
import CartItem from './CartItem';
import ProfileMenu from './ProfileMenu';
import BackgroundPattern from './BackgroundPattern';
import favorite from '../assets/favorite.png';
import ProfileFavouriteItem from './profileFavouriteItem';

function Favorites() {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const backgroundAreaRef = useRef(null);

  const FAVORITES_URL = "http://127.0.0.1:8080/api/Sanjaghak/favoritesList/list";
  const VARIANT_URL = (productId) =>
    `http://127.0.0.1:8080/api/Sanjaghak/productVariants/getProductVariantByProductId?productId=${productId}`;
const PRODUCT_IMAGES_URL = (productId) =>
  `http://127.0.0.1:8080/api/Sanjaghak/productImages/${productId}`;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          setLoading(false);
          return;
        }

        const res = await fetch(FAVORITES_URL, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch favorites list");

        const favoritesData = await res.json();

const itemsWithDetails = await Promise.all(
  favoritesData.map(async (product) => {
    let price = 0;
    let color = [];
    let hex = [];
    let imageUrl = "";
    let inventory = "ناموجود"; 
    let discountPercentage = 0;

    try {
      const variantRes = await fetch(VARIANT_URL(product.productId), {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (variantRes.ok) {
        const variantData = await variantRes.json();
        if (Array.isArray(variantData) && variantData.length > 0) {

          color = variantData.map(v => v.color).filter(Boolean);
          hex = variantData.map(v => v.hexadecimal).filter(Boolean);

const stockChecks = await Promise.all(
  variantData.map(async (v) => {
    try {
      const stockRes = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/inventoryStock/variant/${v.variantId}/stock`,
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      if (!stockRes.ok) throw new Error("Failed to fetch stock");

      let stock = await stockRes.json();
      stock = typeof stock === "string" ? parseInt(stock) : stock;
      stock = isNaN(stock) ? 0 : stock;

let finalPrice = v.price;
let discountPercentage = 0;

if (stock > 0) {
  try {
    const discountRes = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/discount/active/${v.variantId}`,
      { headers: { "Authorization": `Bearer ${token}` } }
    );

    if (discountRes.ok && discountRes.status !== 204) {
      const discountData = await discountRes.json();
      if (discountData && discountData.discountPercentage) {
        discountPercentage = discountData.discountPercentage; 
        finalPrice = Math.round(v.price * (1 - discountPercentage / 100));
      }
    }
  } catch (err) {
    console.error("Error fetching discount for variant", v.variantId, err);
  }
}

return { id: v.variantId, price: finalPrice, stock, discountApplied: discountPercentage > 0, discountPercentage };

      return { id: v.variantId, price: finalPrice, stock };

    } catch (err) {
      console.error("Error checking stock for variant", v.variantId, err);
      return { id: v.variantId, price: finalPrice, stock, discountApplied: finalPrice < v.price };
    }
  })
);

const inStockVariants = stockChecks.filter(v => v.stock > 0);

if (inStockVariants.length > 0) {
const discountedVariant = inStockVariants.find(v => v.discountApplied);
const selectedVariant = discountedVariant || inStockVariants[0];

price = selectedVariant.price;
inventory = "موجود در انبار";
discountPercentage = selectedVariant.discountPercentage || 0;
} else {
  price = 0;
  inventory = "ناموجود";
}
console.log(product.productName, "Variants:", variantData, "Stock checks:", stockChecks);
        }
      }
    } catch (err) {
      console.error(`Error fetching variants for product ${product.productId}:`, err);
    }

try {
  const imgRes = await fetch(PRODUCT_IMAGES_URL(product.productId), {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (imgRes.ok) {
    const imgData = await imgRes.json(); 
    const mainImage = Array.isArray(imgData) ? imgData.find(img => img.primary) : null;
    imageUrl = mainImage ? `http://127.0.0.1:8080${mainImage.imageUrl}` : "";
  }
} catch (err) {
  console.error(`Error fetching image for ${product.productId}:`, err);
}

return {
  id: product.productId,
  productname: product.productName,
  warranty: "گارانتی ندارد",
  inventory: inventory,
  color: color,
  hexadecimal: hex,
  price: price,
  quantity: 1,
  image: imageUrl,
  discountPercentage: discountPercentage
};
  })
);

        setFavoriteItems(itemsWithDetails);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    setFavoriteItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <>
      <Navbar />

      <div className="background-content-wrapper" ref={backgroundAreaRef}>
        <BackgroundPattern parentRef={backgroundAreaRef} />

        <div className="profilecontent" style={{ display: 'flex', gap: '20px' }}>
          <ProfileMenu />
          <div className="orderdiv" style={{ flex: 1 }}>
            <div className='favitems'>
              <div className='titleprofile'>
                <img src={favorite} alt="" className='titleimg' />
                <h3 className="titlehprof">علاقه‌مندی‌ها</h3>
              </div>
              <hr />
              <div className="favitemscontainor">
                {loading ? (
                  <p className="loadingMessage">در حال بارگذاری...</p>
                ) : favoriteItems.length === 0 ? (
                  <p className="noOrdersMessage">لیست علاقه‌مندی‌های شما خالی است.</p>
                ) : (
                  favoriteItems.map(item => (
                    <ProfileFavouriteItem
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      showQuantityControls={false}
                      showDeleteButton={true}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default Favorites;