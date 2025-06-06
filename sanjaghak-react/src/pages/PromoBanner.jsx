
import { Navigate } from "react-router-dom";
import "/src/styles/promoBanner.css"
import { Link, useNavigate } from 'react-router-dom';


function PromoBanner(){
    const navigate= useNavigate();
    const changeToCategory=()=>(
        navigate("/productCategory")
        

    );
    return(
        <div className="PromoContainer">
            <h1 className="promoTitle">promo title</h1>
            <h4 className="PromoDescription">promo description</h4>
            <button className="seeAllBtn" onClick={changeToCategory}>see all</button>

        </div>
    )

}
export default PromoBanner