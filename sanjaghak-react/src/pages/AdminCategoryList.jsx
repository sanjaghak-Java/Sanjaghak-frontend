import React from "react";
import AdminCategoryCard from "./AdminCategoryCard";
import "/src/styles/admincategorylist.css";
import { useNavigate } from "react-router-dom";

function AdminCategoryList({ categories = [] }) {
  const navigate = useNavigate();

  const dummyCategories = [
    { id: 1, name: "دسته ۱", image: "/src/assets/testimage.jpg" },
    { id: 2, name: "دسته ۲", image: "/src/assets/testimage.jpg" },
    { id: 3, name: "دسته ۳", image: "/src/assets/testimage.jpg" },
    { id: 4, name: "دسته ۴", image: "/src/assets/testimage.jpg" }
  ];

  const finalCategories = categories.length > 0 ? categories : dummyCategories;

  const handleAddCategory = () => {
    navigate("/admin/افزودن دسته");
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/admin/category/${categoryId}/attributes`);
  };

  return (
    <div className="adminCategoryListContaineradmin">
      <h1 className="adminCategoryTitleadmin">دسته‌بندی‌ها</h1>

      <div className="adminCategoryGridadmin">
        {finalCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
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