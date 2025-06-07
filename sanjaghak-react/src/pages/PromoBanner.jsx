
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
            <div className="promodiv">
                <div className='promotexts'>
                    <h1 className="promoTitle">عنوان</h1>
                    <h4 className="PromoDescription">دسته بندی محصول</h4>
                    <button className="seeAllBtn" onClick={changeToCategory}>مشاهده &gt;</button>
                </div>
                <img src="./src/assets/laptop background.png" alt="" className="computerimg"/>
            </div>

            <div className="promodiv">
                <div className='promotexts'>
                    <h1 className="promoTitle">عنوان</h1>
                    <h4 className="PromoDescription">دسته بندی محصول</h4>
                    <button className="seeAllBtn" onClick={changeToCategory}>مشاهده &gt;</button>
                </div>
                <img src="./src/assets/laptop background.png" alt="" className="computerimg"/>
            </div>

        </div>
    )

}
export default PromoBanner