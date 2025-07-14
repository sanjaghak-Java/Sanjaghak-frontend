import React, { useState, useRef, useEffect } from "react";
import "/src/styles/ProductIntroduction.css";

function ProductIntroduction({ introRef, text }) {
  const [showMore, setShowMore] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const el = textRef.current;
      if (el.scrollHeight > el.clientHeight) {
        setShowToggle(true);
      } else {
        setShowToggle(false);
      }
    }
  }, [text]);

  const toggleShowMore = () => setShowMore((prev) => !prev);

  return (
    <>

      <div className="product-info-box">
        <p
          ref={textRef}
          className={`product-text ${showMore ? "expanded" : "collapsed"}`}
          style={{
            maxHeight: showMore ? "none" : "3.2em",
            overflow: "hidden",
          }}
        >
          {text}
        </p>
        {showToggle && (
          <div className="more-link" onClick={toggleShowMore} style={{cursor: "pointer"}}>
            <span>{showMore ? "کمتر" : "بیشتر"}</span>
            <span className="arrow">{showMore ? "❯" : "❮"}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductIntroduction;
