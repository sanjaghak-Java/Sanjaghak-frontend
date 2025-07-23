import React, { useEffect, useState } from "react";
import AdminCategoryCard from "./AdminCategoryCard";
import "/src/styles/admincategorylist.css";
import { useNavigate } from "react-router-dom";

function AdminCategoryList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const baseUrl = "http://127.0.0.1:8080";

  useEffect(() => {
    if (!token) {
      alert("توکن دسترسی وجود ندارد. لطفا وارد شوید.");
      setLoading(false);
      return;
    }

    const fetchCategoriesWithImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/Sanjaghak/categories/getAllCategory`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("خطا در دریافت دسته‌بندی‌ها");
        const categoryData = await response.json();

        // For each category, fetch images, get first image's URL and ID
        const categoriesWithImages = await Promise.all(
          categoryData.map(async (category) => {
            try {
              const imageRes = await fetch(
                `${baseUrl}/api/Sanjaghak/categoryImages/${category.categoryId}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (!imageRes.ok) throw new Error();

              const imageData = await imageRes.json();

              if (imageData.length > 0) {
                // Use first image's URL and imageId
                const img = imageData[0];
                const prefix = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
                const suffix = img.imageUrl.startsWith("/") ? img.imageUrl : "/" + img.imageUrl;
                const fullUrl = prefix + suffix;

                return { 
                  ...category, 
                  imageUrl: fullUrl,
                  imageId: img.imageId,  // <-- include imageId here
                };
              }

              // No images found
              return { ...category, imageUrl: null, imageId: null };
            } catch (err) {
              console.error("خطا در دریافت تصویر دسته‌بندی:", err);
              return { ...category, imageUrl: null, imageId: null };
            }
          })
        );

        setCategories(categoriesWithImages);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesWithImages();
  }, [token, baseUrl]);

  const handleAddCategory = () => navigate("/admin/افزودن دسته");

  // Pass full category object including imageId in state
  const handleCategoryClick = (category) => {
    navigate(`/admin/category/${category.categoryId}/attributes`, {
      state: { category },
    });
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>در حال بارگذاری دسته‌بندی‌ها...</p>;

  return (
    <div className="adminCategoryListContaineradmin">
      <h1 className="adminCategoryTitleadmin">دسته‌بندی‌ها</h1>

      <div className="adminCategoryGridadmin">
        {categories.length === 0 && <p>دسته‌بندی‌ای وجود ندارد.</p>}
        {categories.map((category) => (
          <div
            key={category.categoryId}
            onClick={() => handleCategoryClick(category)}
            style={{ cursor: "pointer" }}
          >
            <AdminCategoryCard category={category} />
          </div>
        ))}

        <div
          className="adminCategoryCardadmin addCategoryCardadmin"
          onClick={handleAddCategory}
          style={{ cursor: "pointer" }}
        >
          <div className="addCategoryIconadmin">+</div>
          <h3 className="adminCategoryCard__nameadmin">افزودن دسته</h3>
        </div>
      </div>
    </div>
  );
}

export default AdminCategoryList;