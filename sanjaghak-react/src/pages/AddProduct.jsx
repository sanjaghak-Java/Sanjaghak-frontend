
import React, { useState } from "react";
import "/src/styles/AddProduct.css";
import AttributeField from "./AttributeField";

function AddProduct() {
  const [attributes, setAttributes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const categoryOptions = [
    { id: 1, name: "category1" },
    { id: 2, name: "category2" },
    { id: 3, name: "category3" },
    { id: 4, name: "category4" },
    { id: 5, name: "category5" },
  ];

  const brandOptions = [
    { id: 1, name: "brand1" },
    { id: 2, name: "brand2" },
    { id: 3, name: "brand3" },
    { id: 4, name: "brand4" },
    { id: 5, name: "brand5" },
  ];

  const handleAddAttribute = () => {
    const newAttr = { id: Date.now() };
    setAttributes([...attributes, newAttr]);
  };

  const handleDeleteAttribute = (id) => {
    setAttributes(attributes.filter((attr) => attr.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted!");
  };

  return (
    <>
    <br />
    <br />
    <br />
    <br />
    <br />
    <h1 className="pageTitle">افزودن محصول</h1>
    <form className="addProductContainer" onSubmit={handleSubmit}>
      <div className="inputGroup">
        <div className="inputWrapper">
          <input type="text" required className="productName" placeholder=" " />
          <label className="adminFloatingLabel">نام محصول</label>
        </div>
        <div className="inputWrapper">
          <input type="text" required className="productModel" placeholder=" " />
          <label className="adminFloatingLabel">مدل محصول</label>
        </div>
      </div>

      <div className="inputWrapper">
        <textarea className="productDescription" placeholder=" " />
        <label className="adminFloatingLabel">توضیحات محصول</label>
      </div>

      <div className="inputGroup">
        <div className="inputWrapper">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="categorySelector"
            required
          >
            <option value="" disabled hidden></option>
            {categoryOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <label className="adminFloatingLabel">دسته بندی</label>
        </div>

        <div className="inputWrapper">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="brandSelector"
            required
          >
            <option value="" disabled hidden></option>
            {brandOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <label className="adminFloatingLabel">برند</label>
        </div>
      </div>

      <div className="inputGroup">
        <div className="inputWrapper">
          <input type="number" required className="productCost" placeholder=" " />
          <label className="adminFloatingLabel">قیمت خرید</label>
        </div>
        <div className="inputWrapper">
          <input type="number" required className="productPrice" placeholder=" " />
          <label className="adminFloatingLabel">قیمت فروش</label>
        </div>
      </div>

      <div className="inputGroup">
        <div className="inputWrapper">
          <input type="number" required className="productWeight" placeholder=" " />
          <label className="adminFloatingLabel">وزن</label>
        </div>
        <div className="inputWrapper">
          <input type="number" required className="productLength" placeholder=" " />
          <label className="adminFloatingLabel">طول</label>
        </div>
        <div className="inputWrapper">
          <input type="number" required className="productWidth" placeholder=" " />
          <label className="adminFloatingLabel">عرض</label>
        </div>
        <div className="inputWrapper">
          <input type="number" required className="productHeight" placeholder=" " />
          <label className="adminFloatingLabel">ارتفاع</label>
        </div>
      </div>

      <div className="attributeList">
        <h2 className="attributesTitle">ویژگی ها</h2>
        {attributes.map((attr) => (
          <AttributeField
            key={attr.id}
            id={attr.id}
            onDelete={handleDeleteAttribute}
          />
        ))}
      </div>

      <button type="button" className="addAttributeBtn" onClick={handleAddAttribute}>
        +افزودن ویژگی
      </button>
    </form>
    </>
  );
}

export default AddProduct;