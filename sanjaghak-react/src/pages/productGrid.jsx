import ProductCard from "./ProductCard";
import "/src/styles/productGrid.css"

function ProductGrid(){
    const products = [
  { name: "Cooldog1", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
    { name: "Cooldog2", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog3", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog4", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog5", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
    { name: "Cooldog6", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog7", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog8", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog9", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog10", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog11", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
    { name: "Cooldog12", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog13", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
  { name: "Cooldog14", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"},
    { name: "Cooldog15", image: "./src/assets/testimage.jpg" ,model:"coolest",salepercent:"50",salePrice:"160000",price:"100000"}



];
    return(
        <div className="productGridContainer">
            {products.map((product,_)=>(
                <ProductCard name={product.name} image={product.image} model={product.model} salepercent={product.salepercent} salePrice={product.salePrice} price={product.salePrice} />                
            ))}








        </div>
    )
}
export default ProductGrid