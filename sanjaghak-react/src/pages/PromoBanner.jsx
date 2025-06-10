import { useNavigate } from "react-router-dom";
import "/src/styles/promoBanner.css";

function PromoBanner({ title, description, imageUrl, categoryLink }) {
  const navigate = useNavigate();

  const changeToCategory = () => {
    navigate(categoryLink);
  };

  return (
    <div className="PromoContainer">
      <div className="promotexts">
        <h1 className="promoTitle">{title}</h1>
        <h4 className="PromoDescription">{description}</h4>
        <button className="seeAllBtn" onClick={changeToCategory}>
          مشاهده &gt;
        </button>
      </div>
      <img src={imageUrl} alt={title} className="phoneimg" />
    </div>
  );
}

export default PromoBanner;
