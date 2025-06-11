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
function AdminPage() {
  const [activeItem, setActiveItem] = useState("داشبورد");

  return (
    <div style={{ display: "flex" }}>
      <AdminNav activeItem={activeItem} setActiveItem={setActiveItem} />

      <div className="contentContainer" style={{ flexGrow: 1, padding: "20px" }}>
        {activeItem === "داشبورد" && <Dashboard />}
        {activeItem === "گزارش مالی" && <FinancialReport />}
        {activeItem === "افزودن محصول" && <AddProduct />}
        {activeItem === "افزودن برند" && <AddBrand />}
        {activeItem === "افزودن دسته" && <AddCategory />}
        {activeItem === "لیست کاربران" && <UserList />}
        {activeItem === "لیست محصولات" && <ProductList />}
        {activeItem === "افزودن مدیر" && <AddManager/>}
        {activeItem === "افزودن انباردار" && <AddWarehouseManager />}
      </div>
    </div>
  );
}

export default AdminPage;
