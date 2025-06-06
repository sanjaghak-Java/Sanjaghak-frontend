
import "/src/styles/ProductCard.css"
function ProductCard(props){
    return(
        <div className="cardContainer">
            <div className="salePercent">{props.salepercent}</div>
            <img src={props.image} className="productImage"/>
            <div className='productinfo'>
                <h2 className="ProductName">{props.name}</h2>
                <h4 className="ProductModel">{props.model}</h4>
            </div>
            <hr />
            <div className="priceSection">
                <p>قیمت:</p>
                <div className="priceDetails">
                    <h5 className="productSalePrice">{props.salePrice} تومان</h5>
                    <h2 className="ProductPrice">{props.price} تومان</h2>
                </div>
            </div>





        </div>







    );
}
export default ProductCard