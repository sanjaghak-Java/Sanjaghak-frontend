import React, { useState } from "react";
import AdminBrandCard from "./AdminBrandCard";
import AdminBrandDetail from "./AdminBrandDetail";
import "/src/styles/adminbrandlist.css";
import { useNavigate } from "react-router-dom";

function AdminBrandList({ brands = [] }) {
  const navigate = useNavigate();

  const dummyBrands = [
    { id: 1, name: "برند ۱", image: "/src/assets/brand1.jpg" },
    { id: 2, name: "برند ۲", image: "/src/assets/brand2.jpg" },
    { id: 3, name: "برند ۳", image: "/src/assets/brand3.jpg" },
    { id: 4, name: "برند ۴", image: "/src/assets/brand3.jpg" },
  ];

  const [finalBrands, setFinalBrands] = useState(brands.length > 0 ? brands : dummyBrands);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const handleAddBrand = () => {
    navigate("/admin/افزودن برند");
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
  };

  // Called when back button clicked in detail
  const closeDetail = () => {
    setSelectedBrand(null);
  };

  // Save updated brand info from detail
  const saveBrandChanges = (updatedBrand) => {
    setFinalBrands((prevBrands) =>
      prevBrands.map((b) => (b.id === updatedBrand.id ? updatedBrand : b))
    );
    setSelectedBrand(null);
  };

  // If a brand is selected, show only detail
  if (selectedBrand) {
    return (
      <AdminBrandDetail
        brand={selectedBrand}
        onBack={closeDetail}
        onUpdateBrand={saveBrandChanges}
      />
    );
  }

  // Otherwise show the brand list
  return (
    <div className="adminBrandListContaineradmin">
      <h1 className="adminBrandTitleadmin">لیست برندها</h1>

      <div className="adminBrandGridadmin">
        {finalBrands.map((brand) => (
          <div
            key={brand.id}
            onClick={() => handleBrandClick(brand)}
            style={{ cursor: "pointer" }}
          >
            <AdminBrandCard brand={brand} />
          </div>
        ))}

        <div
          className="adminBrandCardadmin addBrandCardadmin"
          onClick={handleAddBrand}
          style={{ cursor: "pointer" }}
        >
          <div className="addBrandIconadmin">+</div>
          <h3 className="adminBrandCard__nameadmin">افزودن برند</h3>
        </div>
      </div>
    </div>
  );
}

export default AdminBrandList;