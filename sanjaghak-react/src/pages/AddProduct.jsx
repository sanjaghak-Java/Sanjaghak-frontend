import React, { useState, useEffect } from "react";
import "/src/styles/AddProduct.css";
import AttributeField from "./AttributeField";
import ImageCard from "./AddProductImageCard";
import { useNavigate } from "react-router-dom";
import VariantCircle from "./varientCircleAdmin";

function AddProduct() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const [defaultAttributes, setDefaultAttributes] = useState([]);
  const [customAttributes, setCustomAttributes] = useState([]);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingAttributes, setLoadingAttributes] = useState(false);

  const [createdProductId, setCreatedProductId] = useState(null);

  const [savingAttributes, setSavingAttributes] = useState(false);
  const [attributesSaved, setAttributesSaved] = useState(false);

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [sideImages, setSideImages] = useState([]);
  const [sideImagesPreview, setSideImagesPreview] = useState([]);

  const [variants, setVariants] = useState([]);
  const [showAddVariantPopup, setShowAddVariantPopup] = useState(false);

  const [newVariantColorName, setNewVariantColorName] = useState("");
  const [newVariantHex, setNewVariantHex] = useState("#000000");
  const [newVariantPrice, setNewVariantPrice] = useState("");
  const [newVariantCost, setNewVariantCost] = useState("");

  const baseUrl = "http://127.0.0.1:8080";
  const token = localStorage.getItem("token");
  const addProductVariant = async (productId, variant) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/productVariants/addProductVariant?productId=${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(variant),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "خطا در افزودن واریانت");
    }

    const data = await res.json();
    return data; 
  } catch (error) {
    console.error("Error adding variant:", error);
    alert(error.message);
    return null;
  }
};

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch(
          `${baseUrl}/api/Sanjaghak/categories/getPaginationCategory?page=0&size=100`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setCategoryOptions(data.content || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
        const res = await fetch(`${baseUrl}/api/Sanjaghak/brand/getPaginationBrands`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBrandOptions(data.content || []);
      } catch (err) {
        console.error("Error fetching brands:", err);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchCategories();
    fetchBrands();
  }, [token]);

  const fetchCategoryAttributes = async (categoryId) => {
    if (!categoryId) return;
    setLoadingAttributes(true);
    try {
      const res = await fetch(
        `${baseUrl}/api/Sanjaghak/attributeRequirement/${categoryId}/required-attributes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      const formattedAttributes = data.map((item) => ({
        id: item.attribute.attributeId,
        name: item.attribute.attributeName || "",
        value: "",
      }));
      setDefaultAttributes(formattedAttributes);
    } catch (err) {
      console.error("خطا در دریافت ویژگی‌های دسته‌بندی");
    } finally {
      setLoadingAttributes(false);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setDefaultAttributes([]);
    fetchCategoryAttributes(categoryId);
  };

  const handleAddAttribute = () => {
    const newAttr = { id: Date.now(), name: "", value: "" };
    setCustomAttributes([...customAttributes, newAttr]);
  };

  const handleDeleteAttribute = (id) => {
    setCustomAttributes(customAttributes.filter((attr) => attr.id !== id));
  };

  const handleDefaultAttrChange = (index, newValue) => {
    const updated = [...defaultAttributes];
    updated[index].value = newValue;
    setDefaultAttributes(updated);
  };

  const handleCustomAttrChange = (id, newFields) => {
    const updated = customAttributes.map((attr) =>
      attr.id === id ? { ...attr, ...newFields } : attr
    );
    setCustomAttributes(updated);
  };

  const handleSideImageChangeAtIndex = (file, index) => {
    if (!file) return;
    const newSideImages = [...sideImages];
    const newSideImagesPreview = [...sideImagesPreview];
    newSideImages[index] = file;
    newSideImagesPreview[index] = URL.createObjectURL(file);
    setSideImages(newSideImages);
    setSideImagesPreview(newSideImagesPreview);
  };

  const handleAddNewSideImage = (file) => {
    if (!file) return;
    setSideImages((prev) => [...prev, file]);
    setSideImagesPreview((prev) => [...prev, URL.createObjectURL(file)]);
  };

  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
      sideImagesPreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [mainImagePreview, sideImagesPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImage) {
      alert("لطفاً تصویر اصلی محصول را انتخاب کنید.");
      return;
    }

    const productData = {
      productName: document.querySelector(".productName").value,
      productDescription: document.querySelector(".productDescription").value,
      sku: crypto.randomUUID(),
      model: document.querySelector(".productModel").value,
      weight: document.querySelector(".productWeight").value,
      length: document.querySelector(".productLength").value,
      width: document.querySelector(".productWidth").value,
      height: document.querySelector(".productHeight").value,
    };

    try {
      const res = await fetch(
        `${baseUrl}/api/Sanjaghak/product/addProduct?categoryId=${selectedCategory}&brandId=${selectedBrand}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      if (res.ok) {
        const result = await res.json();
        const productId = result.productId || null;
        if (!productId) {
          alert("خطا در دریافت شناسه محصول ایجاد شده");
          return;
        }

        const uploadImage = async (file, altText, required) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("productId", productId);
          formData.append("altText", altText);
          formData.append("required", required);

          const uploadRes = await fetch(`${baseUrl}/api/Sanjaghak/productImages/upload`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (!uploadRes.ok) {
            const err = await uploadRes.json();
            throw new Error(err.error || "خطا در آپلود تصویر");
          }
        };

        try {
          await uploadImage(mainImage, "تصویر اصلی محصول", true);

          for (const [index, sideImg] of sideImages.entries()) {
            await uploadImage(sideImg, `تصویر جانبی شماره ${index + 1}`, false);
          }

          alert("محصول با موفقیت ثبت و تصاویر آپلود شدند ");
          setCreatedProductId(productId);
          setStep(2);
        } catch (uploadError) {
          alert("خطا در آپلود تصاویر: " + uploadError.message);
        }
      } else {
        const error = await res.json();
        alert("خطا: " + (error.error || "مشکلی رخ داده است"));
      }
    } catch (error) {
      alert("خطا در ارتباط با سرور");
    }
  };

  const handleSaveAttributes = async () => {
    if (!createdProductId) {
      alert("ابتدا محصول را ایجاد کنید.");
      return;
    }

    setSavingAttributes(true);

    try {
      const createdCustomAttributes = [];

      for (const attr of customAttributes) {
        if (!attr.name.trim()) continue;

        const res = await fetch(`${baseUrl}/api/Sanjaghak/productAttribute/addProductAttribute`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            attributeName: attr.name,
            attributeType: "",
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          alert("خطا در ایجاد ویژگی: " + (err.error || "مشکلی رخ داده است"));
          setSavingAttributes(false);
          return;
        }

        const createdAttr = await res.json();
        createdCustomAttributes.push({ ...attr, id: createdAttr.attributeId });
      }

      const allAttributesToSave = [
        ...defaultAttributes.map((attr) => ({
          attributeId: attr.id,
          value: attr.value,
        })),
        ...createdCustomAttributes.map((attr) => ({
          attributeId: attr.id,
          value: attr.value,
        })),
      ];

      for (const attrVal of allAttributesToSave) {
        if (!attrVal.value.trim()) continue;

        const res = await fetch(
          `${baseUrl}/api/Sanjaghak/productAttributeValue/addValue?productId=${createdProductId}&attributeId=${attrVal.attributeId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              value: attrVal.value,
            }),
          }
        );

        if (!res.ok) {
          const err = await res.json();
          alert("خطا در ذخیره مقدار ویژگی: " + (err.error || "مشکلی رخ داده است"));
          setSavingAttributes(false);
          return;
        }
      }

      alert("ویژگی‌ها با موفقیت ذخیره شدند ");
      setAttributesSaved(true);
      setSavingAttributes(false);
      setStep(3); 
    } catch (err) {
      alert("خطا در ارتباط با سرور");
      setSavingAttributes(false);
    }
  };

  const handleAddVariantClick = () => {
    setShowAddVariantPopup(true);
    setNewVariantColorName("");
    setNewVariantHex("#000000");
    setNewVariantPrice("");
    setNewVariantCost("");
  };

  const handleVariantPopupCancel = () => {
    setShowAddVariantPopup(false);
  };

  const handleVariantPopupOk = () => {
    if (!newVariantColorName.trim()) {
      alert("نام رنگ را وارد کنید.");
      return;
    }
    if (!newVariantPrice || isNaN(newVariantPrice)) {
      alert("قیمت صحیح را وارد کنید.");
      return;
    }
    if (!newVariantCost || isNaN(newVariantCost)) {
      alert("قیمت تمام شده صحیح را وارد کنید.");
      return;
    }
    setVariants((prev) => [
      ...prev,
      {
        id: Date.now(),
        color: newVariantColorName,
        hexadecimal: newVariantHex,
        price: Number(newVariantPrice),
        costPrice: Number(newVariantCost),
      },
    ]);
    setShowAddVariantPopup(false);
  };

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);

  const handleVariantSelect = (index) => {
    setSelectedVariantIndex(index);
  };


  const goToNextStep = () => {
    if (step === 1) {
      const form = document.querySelector("form");
      if (form.checkValidity()) {
        handleSubmit(new Event("submit"));
      } else {
        form.reportValidity();
      }
    } else if (step === 2) {
      handleSaveAttributes();
    } else if (step === 3) {
      if (variants.length === 0) {
        alert("لطفاً حداقل یک واریانت اضافه کنید.");
        return;
      }
      alert("محصول با موفقیت ثبت شد.");
      navigate("/admin/لیست محصولات");
    }
  };
const handleAddVariant = async () => {
  if (!createdProductId) {
    alert("ابتدا محصول را ایجاد کنید");
    return;
  }

  const newVariant = {
    sku: crypto.randomUUID(), 
    costPrice: newVariantCost,
    price: newVariantPrice,
    color: newVariantColorName,
    hexadecimal: newVariantHex,
  };

  try {
    const added = await addProductVariant(createdProductId, newVariant);
    if (added) {
      setVariants((prev) => [...prev, added]);
      setShowAddVariantPopup(false);
    }
  } catch (error) {
    alert(error.message || "خطا در افزودن واریانت");
  }
};

  const goToPrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const VariantCircle = ({ variant, isSelected, onClick }) => (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        textAlign: "center",
        margin: "0 8px 12px 0",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: variant.hexadecimal,
          border: isSelected ? "3px solid #007bff" : "1px solid #ccc",
          margin: "0 auto",
        }}
      />
      <div style={{ fontSize: "12px", marginTop: "4px" }}>{variant.color}</div>
    </div>
  );

  return (
    <>
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1 className="pageTitle">افزودن محصول</h1>
      <form className="addProductContainer" onSubmit={(e) => e.preventDefault()}>
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
              <textarea className="productDescription" rows="2" placeholder=" " />
              <label className="adminFloatingLabel">توضیحات محصول</label>
            </div>

            <div className="inputGroup">
              <div className="inputWrapper">
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="categorySelector"
                  required
                >
                  <option value="" disabled hidden>
                    انتخاب دسته‌بندی
                  </option>
                  {loadingCategories ? (
                    <option disabled>در حال بارگذاری...</option>
                  ) : (
                    categoryOptions.map((option) => (
                      <option key={option.categoryId} value={option.categoryId}>
                        {option.categoryName}
                      </option>
                    ))
                  )}
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
                  <option value="" disabled hidden>
                    انتخاب برند
                  </option>
                  {loadingBrands ? (
                    <option disabled>در حال بارگذاری...</option>
                  ) : (
                    brandOptions.map((option) => (
                      <option key={option.brandId} value={option.brandId}>
                        {option.brandName}
                      </option>
                    ))
                  )}
                </select>
                <label className="adminFloatingLabel">برند</label>
              </div>
            </div>


            <div className="inputGroup">
              <div className="inputWrapper">
                <input type="number" required className="productWeight" placeholder=" " />
                <label className="adminFloatingLabel">وزن (کیلوگرم)</label>
              </div>
              <div className="inputWrapper">
                <input type="number" required className="productLength" placeholder=" " />
                <label className="adminFloatingLabel">طول (میلی‌متر)</label>
              </div>
              <div className="inputWrapper">
                <input type="number" required className="productWidth" placeholder=" " />
                <label className="adminFloatingLabel">عرض (میلی‌متر)</label>
              </div>
              <div className="inputWrapper">
                <input type="number" required className="productHeight" placeholder=" " />
                <label className="adminFloatingLabel">ارتفاع (میلی‌متر)</label>
              </div>
            </div>

            <div
              className="inputWrapper"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <label className="imageCardLabel">تصویر اصلی محصول (فقط 1 عکس)</label>
              <ImageCard
                image={mainImagePreview}
                width={250}
                height={180}
                placeholderText="تصویر اصلی"
                title="کلیک برای انتخاب تصویر اصلی"
                onFileSelect={(file) => {
                  setMainImage(file);
                  setMainImagePreview(URL.createObjectURL(file));
                }}
              />
            </div>

            <div className="inputWrapper" style={{ marginTop: "20px" }}>
              <label className="imageCardLabel">تصاویر جانبی محصول (چند عکس)</label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {sideImagesPreview.map((src, idx) => (
                  <ImageCard
                    key={idx}
                    image={src}
                    width={100}
                    height={80}
                    title="کلیک برای تغییر تصویر"
                    onFileSelect={(file) => handleSideImageChangeAtIndex(file, idx)}
                  />
                ))}

                <ImageCard
                  key="add-new"
                  image={null}
                  width={100}
                  height={80}
                  placeholderText="افزودن تصویر"
                  title="کلیک برای افزودن تصویر جانبی"
                  onFileSelect={handleAddNewSideImage}
                />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="attributeList">
            <h2 className="attributesTitle">ویژگی‌ها</h2>
            {loadingAttributes && <p>در حال بارگذاری ویژگی‌های دسته‌بندی...</p>}
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
            <button type="button" className="addAttributeBtns" onClick={handleAddAttribute}>
              + افزودن ویژگی
            </button>
          </div>
        )}

        {step === 3 && (
          <>
            <h2 className="attributesTitle">واریانت‌ها</h2>
<div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
  {variants.map((variant, i) => (
    <VariantCircle
      key={variant.id}
      variant={variant}
      isSelected={selectedVariantIndex === i}
      onClick={() => setSelectedVariantIndex(i)}
    />
  ))}
              <div
                onClick={handleAddVariantClick}
                style={{
                  cursor: "pointer",
                  textAlign: "center",
                  margin: "0 8px 12px 0",
                }}
                title="افزودن واریانت جدید"
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid #ccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#555",
                    margin: "0 auto",
                    userSelect: "none",
                  }}
                >
                  +
                </div>
                <div style={{ fontSize: "12px", marginTop: "4px" }}>افزودن</div>
              </div>
            </div>

            {selectedVariantIndex !== null && variants[selectedVariantIndex] && (
              <div style={{ marginTop: 20 }}>
                <strong>قیمت فروش: </strong> {variants[selectedVariantIndex].price} <br />
                <strong>قیمت خرید: </strong> {variants[selectedVariantIndex].costPrice}
              </div>
            )}
          </>
        )}

        {showAddVariantPopup && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                padding: 20,
                width: 320,
                boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              <h3>افزودن واریانت جدید</h3>

              <label>
                رنگ (نام):
                <input
                  type="text"
                  value={newVariantColorName}
                  onChange={(e) => setNewVariantColorName(e.target.value)}
                  style={{ width: "100%", marginBottom: 10 }}
                />
              </label>

              <label>
                رنگ (کد هگزادسیمال):
                <input
                  type="color"
                  value={newVariantHex}
                  onChange={(e) => setNewVariantHex(e.target.value)}
                  style={{ width: "100%", marginBottom: 10, height: 30 }}
                />
              </label>

              <label>
                قیمت فروش:
                <input
                  type="number"
                  value={newVariantPrice}
                  onChange={(e) => setNewVariantPrice(e.target.value)}
                  style={{ width: "100%", marginBottom: 10 }}
                />
              </label>

              <label>
                قیمت خرید:
                <input
                  type="number"
                  value={newVariantCost}
                  onChange={(e) => setNewVariantCost(e.target.value)}
                  style={{ width: "100%", marginBottom: 10 }}
                />
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" onClick={handleVariantPopupCancel}>
                  لغو
                </button>
                <button type="button" onClick={handleAddVariant}>
                  تایید
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className={`stepButtonsaddproduct ${step === 1 ? "singleButtonaddproduct" : ""}`}
          style={{ marginTop: 20 }}
        >
          {step > 1 && (
            <button type="button" onClick={goToPrevStep} className="backBtnaddproduct">
              بازگشت
            </button>
          )}
          <button type="button" onClick={goToNextStep} className="nextBtnaddproduct">
            {step === 3 ? "پایان" : "ادامه"}
          </button>
        </div>
      </form>
    </div>
    </>
  );
}

export default AddProduct;