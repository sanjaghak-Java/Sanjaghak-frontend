import React, { useState } from "react";
import Navbar from "./navbar";
import CategoryBox from "./categoryBox";
import Footer from "./Footer";
import Filter from "./Filter";

function CategoryPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div>
            <Navbar />
            <CategoryBox onFilterClick={() => setIsFilterOpen(true)} />

            <Filter
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
            />

            <Footer />
        </div>
    );
}

export default CategoryPage;
