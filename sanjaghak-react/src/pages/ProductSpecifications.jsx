import React, { useState } from "react";
import "/src/styles/ProductSpecifications.css";

function ProductSpecifications({ specifications = [] }) {
  const [showAll, setShowAll] = useState(false);

  const displayedSpecs = showAll ? specifications : specifications.slice(0, 3);

  const toggleShowAll = () => setShowAll(!showAll);

  return (
    <div className="Specifications-div">
      {displayedSpecs.map((item, index) => (
        <div
          className={`Specification-part ${index % 2 === 1 ? "alt-bg" : ""}`}
          key={index}
        >
          <label className="Attribute-part">{item.label}:</label>
          <label className="Value-part">{item.value}</label>
        </div>
      ))}

      {specifications.length > 3 && (
        <div className="show-more-btn" onClick={toggleShowAll}>
          <span className="arrow">{showAll ? "❮" : "❯"}</span>
          <span>{showAll ? "کمتر" : "بیشتر"}</span>
        </div>
      )}
    </div>
  );
}

export default ProductSpecifications;
