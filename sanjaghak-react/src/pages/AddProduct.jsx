
import React, { useState } from "react";
import "/src/styles/AddProduct.css";
import AttributeField from "./AttributeField";

function AddProduct() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [defaultAttributes, setDefaultAttributes] = useState([]);
  const [customAttributes, setCustomAttributes] = useState([]);

  const categoryOptions = [
    { id: "1", name: "category1" },
    { id: "2", name: "category2" },
    { id: "3", name: "category3" },
    { id: "4", name: "category4" },
    { id: "5", name: "category5" },
  ];

  const brandOptions = [
    { id: 1, name: "brand1" },
    { id: 2, name: "brand2" },
    { id: 3, name: "brand3" },
    { id: 4, name: "brand4" },
    { id: 5, name: "brand5" },
  ];

  const defaultAttributesByCategory = {
    1: [{ name: "رنگ", value: "" }, { name: "سایز", value: "" }],
    2: [{ name: "ظرفیت", value: "" }],
    3: [{ name: "قدرت", value: "" }],
    4: [{ name: "جنس", value: "" }],
    5: [{ name: "مدت زمان گارانتی", value: "" }],
  };

  // Add new custom attribute with empty name and value
  const handleAddAttribute = () => {
    const newAttr = { id: Date.now(), name: "", value: "" };
    setCustomAttributes([...customAttributes, newAttr]);
  };

  // Delete custom attribute by id
  const handleDeleteAttribute = (id) => {
    setCustomAttributes(customAttributes.filter((attr) => attr.id !== id));
  };

  // Update value of a default attribute at given index
  const handleDefaultAttrChange = (index, newValue) => {
    const updated = [...defaultAttributes];
    updated[index].value = newValue;
    setDefaultAttributes(updated);
  };

  // Update name or value of a custom attribute by id
  const handleCustomAttrChange = (id, newFields) => {
    const updated = customAttributes.map((attr) =>
      attr.id === id ? { ...attr, ...newFields } : attr
    );
    setCustomAttributes(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can gather all product info + attributes and send to server
    console.log("Product submitted!");
    console.log("Default Attributes:", defaultAttributes);
    console.log("Custom Attributes:", customAttributes);
  };

  const goToNextStep = () => {
    const form = document.querySelector("form");
    if (form.checkValidity()) {
      setStep(step + 1);
    } else {
      form.reportValidity();
    }
  };

  return (
    <>
      <br /><br /><br /><br /><br />
      <h1 className="pageTitle">افزودن محصول</h1>

      <form className="addProductContainer" onSubmit={handleSubmit}>
        {step === 1 && (
          <>
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
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setSelectedCategory(selectedId);
                    setDefaultAttributes(defaultAttributesByCategory[selectedId] || []);
                    setCustomAttributes([]); // clear custom attributes when category changes
                  }}
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
          </>
        )}

        {step === 2 && (
          <>
            <div className="attributeList">
              <h2 className="attributesTitle">ویژگی‌ها</h2>

              {/* Default attributes - name fixed, value editable */}
              {defaultAttributes.map((attr, index) => (
                <AttributeField
                  key={`default-${index}`}
                  id={`default-${index}`}
                  name={attr.name}
                  value={attr.value}
                  readOnly={true}
                  isDefault={true}
                  onValueChange={(val) => handleDefaultAttrChange(index, val)}
                />
              ))}

              {/* Custom attributes - name & value editable */}
              {customAttributes.map((attr) => (
                <AttributeField
                  key={attr.id}
                  id={attr.id}
                  name={attr.name}
                  value={attr.value}
                  onDelete={handleDeleteAttribute}
                  onNameChange={(val) => handleCustomAttrChange(attr.id, { name: val })}
                  onValueChange={(val) => handleCustomAttrChange(attr.id, { value: val })}
                />
              ))}

              <button
                type="button"
                className="addAttributeBtn"
                onClick={handleAddAttribute}
              >
                + افزودن ویژگی
              </button>
            </div>
          </>
        )}

        <div className={`stepButtonsaddproduct ${step === 1 ? "singleButtonaddproduct" : ""}`}>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="backBtnaddproduct"
            >
              بازگشت
            </button>
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="nextBtnaddproduct"
            >
              ادامه
            </button>
          ) : (
            <button type="submit" className="submitBtnaddproduct">
              ثبت محصول
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default AddProduct;