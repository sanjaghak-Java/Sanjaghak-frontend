import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "/src/styles/promoBanner.css";

function PromoBanner({ title, description, imageUrl, categoryLink, bgGradient }) {
  const navigate = useNavigate();

  const changeToCategory = () => {
    navigate(categoryLink);
  };

  return (
          <Link to= "productCategory" className="prompolink">
    <div className="PromoContainer" style={{ background: bgGradient }}>
        <div className="phoneimgcontainor">
          <img src={imageUrl} alt={title} className="phoneimg" />
        </div>
        <div className="promotexts">
          <h1 className="promoTitle">{title}</h1>
          <h4 className="PromoDescription">{description}</h4>
          {/* <button className="seeAllBtn" onClick={changeToCategory}>
            مشاهده &gt;
          </button> */}
        </div>

    </div>
          </Link>
  );
}

export default PromoBanner;
