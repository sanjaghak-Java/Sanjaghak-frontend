import React, { useEffect, useState } from "react";
import AttributeField from "./AttributeField";
import ImageCard from "./AddProductImageCard";
import "/src/styles/adminproductdetail.css";

const defaultAttributesByCategory = {
  1: [{ name: "رنگ", value: "" }],
  2: [{ name: "ظرفیت", value: "" }],
  3: [{ name: "قدرت", value: "" }],
  4: [{ name: "جنس", value: "" }],
  5: [{ name: "گارانتی", value: "" }],
};

function AdminProductDetail({ product, onBack, categories, brands }) {
  const [editedProduct, setEditedProduct] = useState({
    productName: product.productName || "",
    productDescription: product.productDescription || "",
    sku: product.sku || "",
    model: product.model || "",
    price: product.price || 0,
    costPrice: product.costPrice || 0,
    weight: product.weight || 0,
    length: product.length || 0,
    width: product.width || 0,
    height: product.height || 0,
    categoryId: product.categories?.categoryId || "",
    brandId: product.brands?.brandId || "",
    active:product.active || false
  });

  const [newImageFiles, setNewImageFiles] = useState([]);
  const [defaultAttributes, setDefaultAttributes] = useState([]);
  const [customAttributes, setCustomAttributes] = useState(product.customAttributes || []);
  const [requiredAttributes, setRequiredAttributes] = useState([]);
 const [requiredAttributeValues, setRequiredAttributeValues] = useState([]);
   const [unusedAttributes, setUnusedAttributes] = useState([]);
   const [deletedUnusedAttributes, setDeletedUnusedAttributes] = useState([]);
   const [editedUnusedAttributes, setEditedUnusedAttributes] = useState([]);
   const [imagesToDelete, setImagesToDelete] = useState([]);
   useEffect(() => {
  if (!product.productId) {
    setImages([]);
    setMainImageIndex(0);
    return;
  }

  fetch(`http://127.0.0.1:8080/api/Sanjaghak/productImages/${product.productId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch product images");
      return res.json();
    })
    .then((data) => {
      const imgs = data.map((imgObj) => ({
        id: imgObj.imageId,
        src: `http://127.0.0.1:8080${imgObj.imageUrl}`,
        altText: imgObj.altText,
        primary: imgObj.primary,
      }));

      setImages(imgs);

      const primaryIndex = imgs.findIndex((img) => img.primary);
      setMainImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
    })
    .catch((err) => {
      console.error(err);
      setImages([]);
      setMainImageIndex(0);
    });
}, []);
useEffect(() => {
  const defaults = defaultAttributesByCategory[Number(editedProduct.categoryId)] || [];
  setDefaultAttributes(defaults.map((attr) => ({ ...attr })));
  if (editedProduct.categoryId && product.productId) {
    fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/attributeRequirement/${editedProduct.categoryId}/required-attributes`
    )
      .then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت ویژگی‌های الزامی");
        return res.json();
      })
      .then((data) => {
        const attrs = data.map((item) => ({
          attributeId: item.attribute.attributeId,
          attributeName: item.attribute.attributeName,
          attributeType: item.attribute.attributeType,
          requirementId: item.requirementId,
        }));
        setRequiredAttributes(attrs);

        return fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/productAttributeValue/getValueByProductId/${product.productId}`
        )
          .then((res) => {
            if (!res.ok) throw new Error("خطا در دریافت مقدار ویژگی‌ها");
            return res.json();
          })
          .then((valuesData) => {
            const valuesMap = {};
            const attrValueIdMap = {};
            valuesData.forEach((val) => {
              valuesMap[val.attributeId.attributeId] = val.value || "";
              attrValueIdMap[val.attributeId.attributeId] = val.id; 
            });

            setRequiredAttributeValues(valuesMap);

            setRequiredAttributes((prevAttrs) =>
              prevAttrs.map((attr) => ({
                ...attr,
                attributeValueId: attrValueIdMap[attr.attributeId] || null,
              }))
            );
          });
      })
      .then(() => {
        return fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/attributeRequirement/unused/${product.productId}`
        )
          .then((res) => {
            if (!res.ok) throw new Error("خطا در دریافت ویژگی‌های غیر الزامی");
            return res.json();
          })
          .then((unusedData) => {
            const unusedAttrs = unusedData.map((item) => ({
              attributeId: item.attributeId.attributeId,
              attributeName: item.attributeId.attributeName,
              attributeType: item.attributeId.attributeType,
              value: item.value || "",
              attributeValueId: item.id, 
            }));
            setUnusedAttributes(unusedAttrs);
            setEditedUnusedAttributes(unusedAttrs); 
          });
      })
      .catch((err) => {
        console.error(err);
        setRequiredAttributes([]);
        setRequiredAttributeValues({});
        setUnusedAttributes([]);
        setEditedUnusedAttributes([]);
      });
  } else {
    setRequiredAttributes([]);
    setRequiredAttributeValues({});
    setUnusedAttributes([]);
    setEditedUnusedAttributes([]);
  }
}, [editedProduct.categoryId, product.productId]);
const [images, setImages] = useState(() => {
  if (product.images && product.images.length > 0) {
    return product.images;
  }
  if (product.image && product.image.trim() !== "") {
    return [{ id: 1, src: product.image }];
  }
  return []; // No images at all
});
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numberValue = value === "" ? "" : Number(value);
    setEditedProduct((prev) => ({
      ...prev,
      [name]: numberValue,
    }));
  };

  const handleDefaultAttrChange = (index, value) => {
    const updated = [...defaultAttributes];
    updated[index].value = value;
    setDefaultAttributes(updated);
  };

  const handleCustomAttrChange = (id, newFields) => {
    const updated = customAttributes.map((attr) =>
      attr.id === id ? { ...attr, ...newFields } : attr
    );
    setCustomAttributes(updated);
  };

  const handleAddAttribute = () => {
    const newAttr = { id: Date.now(), name: "", value: "" };
    setCustomAttributes((prev) => [...prev, newAttr]);
  };

  const handleDeleteAttribute = (id) => {
    setCustomAttributes((prev) => prev.filter((attr) => attr.id !== id));
  };

const handleAddNewImage = (file) => {
  const id = Date.now(); // unique local id
  const reader = new FileReader();

  reader.onloadend = () => {
    setImages((prev) => [...prev, { id, src: reader.result }]);
    setNewImageFiles((prev) => [...prev, { id, file }]);
  };

  if (file) reader.readAsDataURL(file);
};

const handleSave = async () => {
  const token = localStorage.getItem("token");

  try {
    // 1. Delete marked images first
    for (const imageId of imagesToDelete) {
      const deleteRes = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/productImages/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!deleteRes.ok) {
        const error = await deleteRes.json();
        throw new Error(`Error deleting image with ID ${imageId}: ${error.error || deleteRes.statusText}`);
      }
    }

    setImages((prev) => prev.filter((img) => !imagesToDelete.includes(img.id)));
    setImagesToDelete([]);

    // 2. Upload new images
    for (const { file, id } of newImageFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", product.productId);
      formData.append("altText", "تصویر جدید");
      const isMain = images[mainImageIndex]?.id === id;
      formData.append("required", isMain ? "true" : "false");

      const uploadRes = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/productImages/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!uploadRes.ok) {
        const error = await uploadRes.json();
        throw new Error(`Error uploading image: ${error.error || uploadRes.statusText}`);
      }
    }
    setNewImageFiles([]);

    // 3. Update attributes and product info
    for (const attr of editedUnusedAttributes) {
      const updateNameRes = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/productAttribute/${attr.attributeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            attributeName: attr.attributeName,
            attributeType: "",
          }),
        }
      );

      if (!updateNameRes.ok) {
        const error = await updateNameRes.json();
        throw new Error(`Error updating attribute name "${attr.attributeName}": ${error.error}`);
      }

      if (attr.attributeValueId) {
        const updateValueRes = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/productAttributeValue/${attr.attributeValueId}?productId=${product.productId}&attributeId=${attr.attributeId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ value: attr.value }),
          }
        );

        if (!updateValueRes.ok) {
          const error = await updateValueRes.json();
          throw new Error(`Error updating value for "${attr.attributeName}": ${error.error}`);
        }
      }
    }

    for (const attr of requiredAttributes) {
      const newValue = requiredAttributeValues[attr.attributeId];
      if (!attr.attributeValueId) {
        const createRes = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/productAttributeValue/addValue?productId=${product.productId}&attributeId=${attr.attributeId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ value: newValue }),
          }
        );

        if (!createRes.ok) {
          const error = await createRes.json();
          throw new Error(`Error creating value for "${attr.attributeName}": ${error.error}`);
        }

        const createdValue = await createRes.json();
        attr.attributeValueId = createdValue.id;
        continue;
      }

      const updateAttrValueRes = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/productAttributeValue/${attr.attributeValueId}?productId=${product.productId}&attributeId=${attr.attributeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ value: newValue }),
        }
      );

      if (!updateAttrValueRes.ok) {
        const error = await updateAttrValueRes.json();
        throw new Error(`Error updating value for "${attr.attributeName}": ${error.error}`);
      }
    }

    for (const attr of customAttributes) {
      if (!attr.attributeId) {
        const createAttrRes = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/productAttribute/addProductAttribute`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              attributeName: attr.name,
              attributeType: "",
            }),
          }
        );

        if (!createAttrRes.ok) {
          const error = await createAttrRes.json();
          throw new Error(`Error creating attribute "${attr.name}": ${error.error}`);
        }

        const createdAttr = await createAttrRes.json();

        const createValueRes = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/productAttributeValue/addValue?productId=${product.productId}&attributeId=${createdAttr.attributeId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ value: attr.value }),
          }
        );

        if (!createValueRes.ok) {
          const error = await createValueRes.json();
          throw new Error(`Error creating value for "${attr.name}": ${error.error}`);
        }
      }
    }

    for (const attr of deletedUnusedAttributes) {
      await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/productAttributeValue/${attr.attributeValueId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/productAttribute/${attr.attributeId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    const productPayload = {
      productName: editedProduct.productName,
      productDescription: editedProduct.productDescription,
      sku: editedProduct.sku,
      model: editedProduct.model,
      price: editedProduct.price,
      costPrice: editedProduct.costPrice,
      weight: editedProduct.weight,
      length: editedProduct.length,
      width: editedProduct.width,
      height: editedProduct.height,
      active: editedProduct.active,
    };

    const productRes = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/product/${product.productId}?categoryId=${editedProduct.categoryId}&brandId=${editedProduct.brandId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productPayload),
      }
    );

    if (!productRes.ok) {
      const error = await productRes.json();
      throw new Error(error.error || "Error updating product details");
    }

    alert("Product updated successfully!");
    onBack();
    setDeletedUnusedAttributes([]);
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
};

const handleDelete = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `http://127.0.0.1:8080/api/Sanjaghak/product/${product.productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      alert("محصول با موفقیت حذف شد");
      onBack(); 
    } else {
      const error = await response.json();
      alert(error.error || "خطا در حذف محصول");
    }
  } catch (e) {
    alert("مشکل در ارتباط با سرور");
    console.error(e);
  }
};
const handleDeleteUnusedAttr = (attributeId) => {
  const deletedAttr = unusedAttributes.find((attr) => attr.attributeId === attributeId);
  if (deletedAttr) {
    setDeletedUnusedAttributes((prev) => [
      ...prev,
      {
        attributeId: deletedAttr.attributeId,
        attributeValueId: deletedAttr.attributeValueId,
      },
    ]);
    setUnusedAttributes((prev) => prev.filter((attr) => attr.attributeId !== attributeId));
    setEditedUnusedAttributes((prev) => prev.filter((attr) => attr.attributeId !== attributeId)); // ✅ added this line
  }
};
const handleUnusedAttrNameChange = (attributeId, newName) => {
  setEditedUnusedAttributes((prev) =>
    prev.map((attr) =>
      attr.attributeId === attributeId ? { ...attr, attributeName: newName } : attr
    )
  );
};

const handleUnusedAttrValueChange = (attributeId, newValue) => {
  setEditedUnusedAttributes((prev) =>
    prev.map((attr) =>
      attr.attributeId === attributeId ? { ...attr, value: newValue } : attr
    )
  );
};
  return (
    <div
      className="adminProductDetailContainer"
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: 32,
        backgroundColor: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 12px rgba(184,64,64,0.15)",
      }}
    >
      <button
        onClick={onBack}
        style={{
          marginBottom: 24,
          padding: "8px 16px",
          backgroundColor: "#d54343",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: "700",
        }}
        type="button"
      >
        بازگشت
      </button>

      <h2 style={{ marginBottom: 24, color: "#d54343" }}>
        ویرایش محصول: {product.productName}
      </h2>

      <div
        className="adminProductDetail__mainImageWrapper"
        style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}
      >
{images.length > 0 && mainImageIndex >= 0 && mainImageIndex < images.length && (
  <div style={{ position: "relative", display: "inline-block" }}>
    <ImageCard
      image={images[mainImageIndex].src}
      width={400}
      height={320}
      title="تصویر اصلی محصول"
      className="adminProductDetail__mainImageCard"
    />
    <button
      type="button"
      onClick={() => {
        const mainImageId = images[mainImageIndex].id;
        setImagesToDelete((prev) =>
          prev.includes(mainImageId)
            ? prev.filter((id) => id !== mainImageId)
            : [...prev, mainImageId]
        );
      }}
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        background: "rgba(255,0,0,0.8)",
        border: "none",
        borderRadius: "50%",
        width: 28,
        height: 28,
        color: "white",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: 20,
        lineHeight: "28px",
        textAlign: "center",
        padding: 0,
        zIndex: 10,
      }}
    >
      ×
    </button>
    {imagesToDelete.includes(images[mainImageIndex].id) && (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          background: "rgba(255,0,0,0.7)",
          color: "white",
          fontSize: 14,
          padding: "4px 8px",
          borderRadius: "0 0 0 4px",
          zIndex: 10,
        }}
      >
        حذف شد
      </div>
    )}
  </div>
)}
      </div>

      <div
        className="adminProductDetail__thumbnailRow"
        style={{
          marginBottom: 24,
          display: "flex",
          gap: 12,
          justifyContent: "center",
        }}
      >
  {images.length > 0 && mainImageIndex >= 0 && mainImageIndex < images.length && (
  images
    .map((img, idx) => ({ img, idx }))
    .filter(({ idx }) => idx !== mainImageIndex)
    .map(({ img, idx }) => (
      <div
        key={img.id || idx}
        style={{ position: "relative", display: "inline-block" }}
      >
        <ImageCard
          image={img.src}
          width={80}
          height={65}
          className="adminProductDetail__thumbnailImageCard"
        />
        <button
          type="button"
          onClick={() => {
            setImagesToDelete((prev) =>
              prev.includes(img.id)
                ? prev.filter((id) => id !== img.id)
                : [...prev, img.id]
            );
          }}
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            background: "rgba(255,0,0,0.8)",
            border: "none",
            borderRadius: "50%",
            width: 20,
            height: 20,
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 14,
            lineHeight: "18px",
            textAlign: "center",
            padding: 0,
            zIndex: 10,
          }}
          title={imagesToDelete.includes(img.id) ? "لغو حذف" : "حذف تصویر"}
        >
          ×
        </button>
        {imagesToDelete.includes(img.id) && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "rgba(255,0,0,0.7)",
              color: "white",
              fontSize: 12,
              padding: "2px 4px",
              borderRadius: "0 0 0 4px",
              zIndex: 10,
            }}
          >
            حذف شد
          </div>
        )}
      </div>
    ))
)}
        <ImageCard
          image={null}
          width={80}
          height={65}
          onFileSelect={handleAddNewImage}
          title="کلیک کنید برای افزودن تصویر جدید"
          placeholderText=""
          className="adminProductDetail__addImageCard"
        />
      </div>
<button
  onClick={() =>
    setEditedProduct((prev) => ({ ...prev, active: !prev.active }))
  }
  style={{
    backgroundColor: editedProduct.active ? "#4CAF50" : "#f44336",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "16px",
    marginRight:"38%"
  }}
>
  {editedProduct.active ? "فعال است (کلیک برای غیرفعال کردن)" : "غیرفعال است (کلیک برای فعال کردن)"}
</button>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label className="adminProductDetail__info">نام محصول:</label>
        <input
          type="text"
          name="productName"
          value={editedProduct.productName}
          onChange={handleInputChange}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">توضیحات:</label>
        <textarea
          name="productDescription"
          value={editedProduct.productDescription}
          onChange={handleInputChange}
          className="adminProductDetail__input"
          rows={4}
          style={{ resize: "vertical" }}
        />

        <label className="adminProductDetail__info">SKU:</label>
        <input
          type="text"
          name="sku"
          value={editedProduct.sku}
          onChange={handleInputChange}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">مدل:</label>
        <input
          type="text"
          name="model"
          value={editedProduct.model}
          onChange={handleInputChange}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">قیمت (تومان):</label>
        <input
          type="number"
          name="price"
          value={editedProduct.price}
          onChange={handleNumberChange}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">قیمت تمام شده (تومان):</label>
        <input
          type="number"
          name="costPrice"
          value={editedProduct.costPrice}
          onChange={handleNumberChange}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">وزن (کیلوگرم):</label>
        <input
          type="number"
          name="weight"
          value={editedProduct.weight}
          onChange={handleNumberChange}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">طول (سانتی‌متر):</label>
        <input
          type="number"
          name="length"
          value={editedProduct.length}
          onChange={handleNumberChange}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">عرض (سانتی‌متر):</label>
        <input
          type="number"
          name="width"
          value={editedProduct.width}
          onChange={handleNumberChange}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">ارتفاع (سانتی‌متر):</label>
        <input
          type="number"
          name="height"
          value={editedProduct.height}
          onChange={handleNumberChange}
          className="adminProductDetail__input"
        />

        <label className="adminProductDetail__info">دسته‌بندی:</label>
        <select
          name="categoryId"
          value={editedProduct.categoryId}
          onChange={handleInputChange}
          className="adminProductDetail__input"
        >
          <option value="">انتخاب دسته‌بندی</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryName}
            </option>
          ))}
        </select>

        <label className="adminProductDetail__info">برند:</label>
        <select
          name="brandId"
          value={editedProduct.brandId}
          onChange={handleInputChange}
          className="adminProductDetail__input"
        >
          <option value="">انتخاب برند</option>
          {brands.map((brand) => (
            <option key={brand.brandId} value={brand.brandId}>
              {brand.brandName}
            </option>
          ))}
        </select>
      </div>

      <div className="attributeList" style={{ marginTop: 30 }}>
        <h2 className="attributesTitle">ویژگی‌های الزامی دسته‌بندی</h2>
        {requiredAttributes.length === 0 && <p>ویژگی الزامی برای این دسته‌بندی وجود ندارد.</p>}
{requiredAttributes.map((attr) => (
  <AttributeField
    key={attr.attributeId}
    id={attr.attributeId}
    name={attr.attributeName}
    value={requiredAttributeValues[attr.attributeId] || ""}
    isDefault={true}
    onValueChange={(newVal) => {
      setRequiredAttributeValues(prev => ({
        ...prev,
        [attr.attributeId]: newVal,
      }));
    }}
  />
))}

<h2 className="attributesTitle" style={{ marginTop: 40 }}>
   ویژگی‌های دیگر
</h2>
{editedUnusedAttributes.length === 0 && <p>ویژگی غیر الزامی برای این دسته‌بندی وجود ندارد.</p>}
{editedUnusedAttributes.map((attr) => (
  <AttributeField
    key={attr.attributeId}
    id={attr.attributeId}
    name={attr.attributeName}
    value={attr.value}
    isDefault={false}
    onDelete={() => handleDeleteUnusedAttr(attr.attributeId)}
    onNameChange={(val) => handleUnusedAttrNameChange(attr.attributeId, val)}
    onValueChange={(val) => handleUnusedAttrValueChange(attr.attributeId, val)}
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

        <button
          type="button"
          className="addAttributeBtn"
          onClick={handleAddAttribute}
          style={{ marginTop: 16 }}
        >
          + افزودن ویژگی
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20,
          gap: 12,
        }}
      >
        <button
          onClick={handleDelete}
          style={{
            padding: "10px 20px",
            backgroundColor: "#7a2e2e",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "700",
            flexGrow: 1,
          }}
          type="button"
        >
          حذف محصول
        </button>

        <button
          onClick={handleSave}
          style={{
            padding: "10px 20px",
            backgroundColor: "#d54343",
            color: "white",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "700",
            flexGrow: 1,
          }}
          type="button"
        >
          ذخیره تغییرات
        </button>
      </div>
    </div>
  );
}

export default AdminProductDetail;
