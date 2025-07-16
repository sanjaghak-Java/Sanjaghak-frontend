import React, { useState } from "react";
import AdminNav from "./adminNav";
import AddProduct from "./AddProduct";
import Dashboard from "./Dashboard";
import FinancialReport from "./FinancialReport";
import AddBrand from "./AddBrand";
import AddCategory from "./addCategory";
import UserList from "./UserList";
import ProductList from "./ProductList";
import AddManager from "./AddManager";
import AddWarehouseManager from "./AddWarehouseManager";
import AdminParticlesBackground from "./adminParticleBackground";

function AdminPage() {
  const [activeItem, setActiveItem] = useState("داشبورد");

    const products = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: 10000,
    category: "Category 1",
    brand: "Brand X",
    image: "https://example.com/image1.jpg",
    description: "Some description",
  }));


  return (
    <div className="adminPageRoot" style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Particles in the background */}
      <AdminParticlesBackground />

      {/* Main Content */}
      <div className="adminMainContent" style={{ position: "relative", zIndex: 1, display: "flex" }}>
        <AdminNav activeItem={activeItem} setActiveItem={setActiveItem} />
        <div className="adminContent" style={{ flexGrow: 1, padding: "20px" }}>
          {activeItem === "داشبورد" && <Dashboard />}
          {activeItem === "گزارش مالی" && <FinancialReport />}
          {activeItem === "افزودن محصول" && <AddProduct />}
          {activeItem === "افزودن برند" && <AddBrand />}
          {activeItem === "افزودن دسته" && <AddCategory />}
          {activeItem === "لیست کاربران" && <UserList />}
          {activeItem === "لیست محصولات" && <ProductList products={products} />}
          {activeItem === "افزودن مدیر" && <AddManager />}
          {activeItem === "افزودن انباردار" && <AddWarehouseManager />}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;