import { useEffect, useState } from "react"
import "/src/styles/ProductCard.css"
import { useNavigate } from "react-router-dom"

function ProductCard(props) {
    const [imageSizeClass, setImageSizeClass] = useState("backImage-small");

    const navigate = useNavigate();

    useEffect(() => {
        const img = new Image();
        img.src = props.image;

        img.onload = () => {
            if (img.naturalWidth > 100) {
                setImageSizeClass("backImage-large");
            } else {
                setImageSizeClass("backImage-small");
            }
        };
    }, [props.image]);

    const gotoproduct = () => {
        navigate("/product");
    };

    return (
        <div className="cardContainer" onClick={gotoproduct}>
            <div className="cardInner">
                <div className="cardFront">
                    <div className="salePercent">{props.salepercent}</div>
                    <img src={props.image} className="productImage" />
                    <div className='productinfo'>
                        <h2 className="ProductName">{props.name}</h2>
                        <h4 className="ProductModel">{props.model}</h4>
                    </div>
                    <hr />
                    <div className="priceSection">
                        <p className="price-title">قیمت:</p>
                        <div className="priceDetails">
                            <h5 className="productSalePrice">{props.salePrice} تومان</h5>
                            <h2 className="ProductPrice">{props.price} تومان</h2>
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

export default ProductCard
