import { useEffect, useState } from "react";
import "/src/styles/ProductCard.css";
import { useNavigate } from "react-router-dom";

function ProductCard(props) {
  const [imageSizeClass, setImageSizeClass] = useState("backImage-small");
  const navigate = useNavigate();

  useEffect(() => {
    const img = new Image();
    img.src = props.image;

    img.onload = () => {
      setImageSizeClass(img.naturalWidth > 100 ? "backImage-large" : "backImage-small");
    };
  }, [props.image]);

  const gotoproduct = () => {
  navigate(`/product/${props.productId}`, { state: { product: props } });
};

  const hasDiscount = props.salepercent || props.salePrice;
  const isUnavailable = props.price === "ناموجود";

  return (
    <div className="cardContainer" onClick={gotoproduct}>
      <div className="cardInner">
        <div className="cardFront">
          {/* Show discount badge only if available and product is not unavailable */}
          {hasDiscount && !isUnavailable && (
            <div className="salePercent">{props.salepercent}</div>
          )}

          <img src={props.image} className="productImage" />

          <div className="productinfo">
            <h2 className="ProductName">{props.name}</h2>
            <h4 className="ProductModel">{props.model}</h4>
          </div>

          <hr id="idont-know-hr" />

          <div className="priceSection">
            <p className="price-title">قیمت:</p>
            <div className="priceDetails">
              {isUnavailable ? (
                <h2 className="ProductPrice">ناموجود</h2>
              ) : props.salePrice ? (
                <>
                  <h5 className="productOriginalPrice">{props.price} تومان</h5>
                  <h2 className="productSalePrice">{props.salePrice} تومان</h2>
                </>
              ) : (
                <h2 className="ProductPrice">{props.price} تومان</h2>
              )}
            </div>
          </div>
        </div>

        <div className="cardBack">
          <img src={props.image} className={imageSizeClass} />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;