import React, { useEffect, useState } from "react";
import AdminBrandCard from "./AdminBrandCard";
import AdminBrandDetail from "./AdminBrandDetail";
import "/src/styles/adminbrandlist.css";
import { useNavigate } from "react-router-dom";

function AdminBrandList() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8080/api/Sanjaghak/brand/getPaginationBrands?page=0&size=1000`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت برندها");
        return res.json();
      })
      .then((data) => {
        setBrands(data.content);
        setLoading(false);
      })
      .catch((err) => {
        alert(err.message);
        setLoading(false);
      });
  }, [token]);

  const handleAddBrand = () => navigate("/admin/افزودن برند");

  const handleBrandClick = (brand) => setSelectedBrand(brand);

  const closeDetail = () => setSelectedBrand(null);

const saveBrandChanges = (updatedBrand) => {
  setBrands((prev) =>
    prev.map((b) => (b.brandId === updatedBrand.brandId ? updatedBrand : b))
  );
  setSelectedBrand(null);
};

  if (loading) return <p>در حال بارگذاری برندها...</p>;

  if (selectedBrand) {
    return (
      <AdminBrandDetail
        brand={selectedBrand}
        onBack={closeDetail}
        onUpdateBrand={saveBrandChanges}
      />
    );
  }

  return (
    <div className="adminBrandListContaineradmin">
      <h1 className="adminBrandTitleadmin">لیست برندها</h1>

      <div className="adminBrandGridadmin">
        {brands.map((brand) => (
          <div
            key={brand.brandId}
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