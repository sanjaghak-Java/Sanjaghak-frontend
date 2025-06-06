import "/src/styles/ProductIntroduction.css";
import React, { useState } from 'react';

function ProductIntroduction({ introRef }) {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    return (
        <>
            <p className="Information-title" ref={introRef}>معرفی</p>
            <div className="product-info-box">
                <p className={`product-text ${showMore ? "expanded" : "collapsed"}`}>
                    گوشی‌ها هر روز زرق و برق بیشتری پیدا می‌کنند و ویژگی‌های جدیدتری را به لیست خود اضافه می‌کنند...
                    گوشی موبایل شیائومی مدل Redmi A3 یک گوشی با این مشخصات است
                </p>
                <div className="more-link" onClick={toggleShowMore}>
                    <span>{showMore ? "کمتر" : "بیشتر"}</span>
                    <span className="arrow">{showMore ? "❯" : "❮"}</span>
                </div>
            </div>
        </>
    );
}

export default ProductIntroduction;
