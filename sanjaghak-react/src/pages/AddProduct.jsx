import React, { useState, useEffect } from "react";
import "/src/styles/AddProduct.css";
import AttributeField from "./AttributeField";
import ImageCard from "./AddProductImageCard";
import { useNavigate } from "react-router-dom";
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

  const baseUrl = "http://127.0.0.1:8080";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch(`${baseUrl}/api/Sanjaghak/categories/getPaginationCategory?page=0&size=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
      const res = await fetch(`${baseUrl}/api/Sanjaghak/attributeRequirement/${categoryId}/required-attributes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const formattedAttributes = data.map((item) => ({
        id: item.attribute.attributeId, // Assuming attributeId is needed to send later
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

  // Step 1: create product
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
    price: document.querySelector(".productPrice").value,
    costPrice: document.querySelector(".productCost").value,
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

      // Upload main image
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
        // Upload main image with required = true
        await uploadImage(mainImage, "تصویر اصلی محصول", true);

        // Upload side images with required = false
        for (const [index, sideImg] of sideImages.entries()) {
          await uploadImage(sideImg, `تصویر جانبی شماره ${index + 1}`, false);
        }

        alert("محصول با موفقیت ثبت و تصاویر آپلود شدند ✅");
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

  // Save attributes & their values in step 2
  const handleSaveAttributes = async () => {
    if (!createdProductId) {
      alert("ابتدا محصول را ایجاد کنید.");
      return;

    }

    setSavingAttributes(true);

    try {
      // 1. For each custom attribute, create it in backend, get back id
      const createdCustomAttributes = [];

      for (const attr of customAttributes) {
        // Skip empty names
        if (!attr.name.trim()) continue;

        const res = await fetch(`${baseUrl}/api/Sanjaghak/productAttribute/addProductAttribute`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            attributeName: attr.name,
            attributeType: "", // pass empty string as requested
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

      // 2. Combine default and custom attributes with proper attributeId
      // Default attributes already have attributeId in attr.id
      // Custom attributes got new attributeId after creation
      // We want to send attribute values linked to product

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

      // 3. For each attribute value, send POST to addValue endpoint
      for (const attrVal of allAttributesToSave) {
        // skip empty values (optional)
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

      alert("ویژگی‌ها با موفقیت ذخیره شدند ✅");
      setAttributesSaved(true);
      setSavingAttributes(false);
       navigate("/admin/لیست محصولات")
    } catch (err) {
      alert("خطا در ارتباط با سرور");
      setSavingAttributes(false);
    }
  };

  const goToNextStep = () => {
    const form = document.querySelector("form");
    if (form.checkValidity()) {
      handleSubmit(new Event("submit"));
    } else {
      form.reportValidity();
    }
  };

  return (
    <div className="supplier-container" style={{padding: "0"}}>
      {/* <h1 className="pageTitle">افزودن محصول</h1> */}
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
                <input type="number" required className="productCost" placeholder=" " />
                <label className="adminFloatingLabel">قیمت خرید (تومان)</label>
              </div>
              <div className="inputWrapper">
                <input type="number" required className="productPrice" placeholder=" " />
                <label className="adminFloatingLabel">قیمت فروش (تومان)</label>
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

            <div style={{display: "flex"}}>
              {/* Main Image Input as ImageCard */}
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
                  width={220}
                  height={220}
                  placeholderText="تصویر اصلی"
                  title="کلیک برای انتخاب تصویر اصلی"
                  onFileSelect={(file) => {
                    setMainImage(file);
                    setMainImagePreview(URL.createObjectURL(file));
                  }}
                />
              </div>

              {/* Side Images Cards */}
              <div className="inputWrapper">
                <label className="imageCardLabel">تصاویر جانبی محصول (چند عکس)</label>
                <div
                  style={{
                    marginTop: "6px",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                  }}
                >
                  {sideImagesPreview.map((src, idx) => (
                    <ImageCard
                      key={idx}
                      image={src}
                      width={90}
                      height={90}
                      title="کلیک برای تغییر تصویر"
                      onFileSelect={(file) => handleSideImageChangeAtIndex(file, idx)}
                    />
                  ))}

                  {/* Always show one empty add card */}
                  <ImageCard
                    key="add-new"
                    image={null}
                    width={90}
                    height={90}
                    placeholderText="افزودن تصویر"
                    title="کلیک برای افزودن تصویر جانبی"
                    onFileSelect={handleAddNewSideImage}
                  />
                </div>
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

        <div className={`stepButtonsaddproduct ${step === 1 ? "singleButtonaddproduct" : ""}`}>
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="modal-button gray">
              بازگشت
            </button>
          )}
          {step < 2 ? (
            <button type="button" onClick={goToNextStep} className="nextBtnaddproduct">
              ادامه
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveAttributes}
              disabled={savingAttributes || attributesSaved}
              className="submitBtnaddproduct"
              title={attributesSaved ? "ویژگی‌ها قبلاً ذخیره شده‌اند" : ""}
            >
              {savingAttributes ? "در حال ذخیره ..." : attributesSaved ? "ثبت شد ✅" : "ثبت ویژگی‌ها"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AddProduct;