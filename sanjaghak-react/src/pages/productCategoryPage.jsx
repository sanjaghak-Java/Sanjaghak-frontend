import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import CategoryBox from "./categoryBox";
import Footer from "./Footer";
import Filter from "./Filter";
import BackgroundPattern from "./BackgroundPattern";

function CategoryPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const backgroundAreaRef = useRef(null);

  return (
    <div>
      <Navbar />

      <div className="background-content-wrapper" ref={backgroundAreaRef}>
        <BackgroundPattern parentRef={backgroundAreaRef} />

        <CategoryBox onFilterClick={() => setIsFilterOpen(true)} />

        <Filter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />

        <Footer />
      </div>
    </div>
  );
}

export default CategoryPage;
