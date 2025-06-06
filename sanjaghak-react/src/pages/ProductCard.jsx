
import "/src/styles/ProductCard.css"
function ProductCard(props){
    return(
        <div className="cardContainer">
            <img src={props.image} className="productImage"/>
            <h2 className="ProductName">{props.name}</h2>
            <h4 className="ProductModel">{props.model}</h4>
            <br />
            <br />
             <div className="priceSection">
                 <div className="salePercent">{props.salepercent}</div>
                    <div className="priceDetails">
                     <h5 className="productSalePrice">{props.salePrice} تومان</h5>
                     <h2 className="ProductPrice">{props.price} تومان</h2>
                 </div>
             </div>





        </div>







    );
}
export default ProductCard