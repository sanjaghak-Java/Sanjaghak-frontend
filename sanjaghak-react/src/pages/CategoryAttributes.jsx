import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminCategoryAttributeField from "./AdminCategoryAttributeField";
import "/src/styles/categoryattributes.css";

function EditCategoryAttributes() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const baseUrl = "http://127.0.0.1:8080";

  const category = location.state?.category || null;

  if (!category) {
    return (
      <p style={{ color: "red", textAlign: "center" }}>
        دسته‌بندی یافت نشد. لطفا از صفحه دسته‌بندی‌ها وارد شوید.
      </p>
    );
  }

  const [categoryName, setCategoryName] = useState(category.categoryName || "");
  const [categoryDescription, setCategoryDescription] = useState(
    category.categoryDescription || ""
  );
  const [enabled, setEnabled] = useState(category.active ?? true);
  const [categoryPicture, setCategoryPicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(category.imageUrl || null);

  const [attributes, setAttributes] = useState([]);
  const [deletedRequirementIds, setDeletedRequirementIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingAttributes, setLoadingAttributes] = useState(true);
  const [errorLoadingAttributes, setErrorLoadingAttributes] = useState(null);

useEffect(() => {
  const fetchAttributes = async () => {
    try {
      setLoadingAttributes(true);
      setErrorLoadingAttributes(null);

      const res = await fetch(
        `${baseUrl}/api/Sanjaghak/attributeRequirement/${category.categoryId}/required-attributes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ⛔️ Bad status code, but might not be an actual error
      if (!res.ok) {
        const errData = await res.json();

        // ✅ If it's "no attributes defined", treat it as valid
        if (
          errData.error &&
          errData.error.includes("هیچ ویژگی ضروری‌ای برای این دسته‌بندی تعریف نشده است")
        ) {
          setAttributes([]);
          return;
        }

        throw new Error(errData.error || "خطا در دریافت ویژگی‌ها");
      }

      const data = await res.json();
      console.log("Fetched attributes:", data);

      if (Array.isArray(data) && data.length > 0) {
        setAttributes(
          data.map((attr) => ({
            id: attr.requirementId,
            requirementId: attr.requirementId,
            attributeId: attr.attribute.attributeId,
            name: attr.attribute.attributeName || "",
            type: attr.attribute.attributeType || "",
            isNew: false,
          }))
        );
      } else {
        setAttributes([]);
      }
    } catch (error) {
      setErrorLoadingAttributes(error.message);
    } finally {
      setLoadingAttributes(false);
    }
  };

  fetchAttributes();
}, [category, baseUrl, token]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryPicture(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleEnabled = () => setEnabled((prev) => !prev);

  const handleAddAttribute = () => {
    setAttributes((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        attributeId: null,
        name: "",
        type: "",
        isNew: true,
      },
    ]);
  };

const handleDeleteAttribute = (id) => {
  const attrToDelete = attributes.find((attr) => attr.id === id);
  console.log("Deleting requirementId queued:", attrToDelete?.requirementId);
  if (attrToDelete && !attrToDelete.isNew && attrToDelete.requirementId) {
    setDeletedRequirementIds((prev) => [...prev, attrToDelete.requirementId]);
  }
  setAttributes((prev) => prev.filter((attr) => attr.id !== id));
};
  const handleAttrChange = (id, newFields) => {
    setAttributes((prev) =>
      prev.map((attr) => (attr.id === id ? { ...attr, ...newFields } : attr))
    );
  };

  const saveCategoryInfo = async () => {
    const body = {
      categoryName,
      categoryDescription,
      active: enabled,
    };

    const res = await fetch(
      `${baseUrl}/api/Sanjaghak/categories/${category.categoryId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) throw new Error("خطا در ذخیره دسته‌بندی");
  };

  const saveImage = async () => {
    if (!categoryPicture) return;
    const formData = new FormData();
    formData.append("file", categoryPicture);
    formData.append("categoryId", category.categoryId);
    formData.append("altText", "");

    const endpoint = category.imageId
      ? `${baseUrl}/api/Sanjaghak/categoryImages/${category.imageId}`
      : `${baseUrl}/api/Sanjaghak/categoryImages/upload`;
    const method = category.imageId ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) throw new Error("خطا در ذخیره تصویر دسته‌بندی");
  };

  // *** FIXED deleteRequirementsFromBackend to use actual IDs ***
  const deleteRequirementsFromBackend = async () => {
 for (const requirementId of deletedRequirementIds) {
  const res = await fetch(`${baseUrl}/api/Sanjaghak/attributeRequirement/${requirementId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "خطا در حذف ویژگی الزامی");
      }
    }
    setDeletedRequirementIds([]);
  };

  const saveNewAttributes = async () => {
    const newAttrs = attributes.filter((attr) => attr.isNew && attr.name.trim() !== "");

    for (const attr of newAttrs) {
      const attrRes = await fetch(
        `${baseUrl}/api/Sanjaghak/productAttribute/addProductAttribute`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attributeName: attr.name,
            attributeType: attr.type,
          }),
        }
      );

      if (!attrRes.ok) {
        const error = await attrRes.json();
        throw new Error(error.error || "خطا در ثبت ویژگی");
      }

      const savedAttr = await attrRes.json();

      const reqRes = await fetch(
        `${baseUrl}/api/Sanjaghak/attributeRequirement/addRequirement?categoryId=${category.categoryId}&attributeId=${savedAttr.attributeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ required: true }),
        }
      );

      if (!reqRes.ok) {
        const error = await reqRes.json();
        throw new Error(error.error || "خطا در الزامی کردن ویژگی");
      }
    }
  };

  const saveUpdatedAttributes = async () => {
    const updatedAttrs = attributes.filter((attr) => !attr.isNew && attr.name.trim() !== "");

    for (const attr of updatedAttrs) {
      const res = await fetch(
        `${baseUrl}/api/Sanjaghak/productAttribute/${attr.attributeId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attributeName: attr.name,
            attributeType: attr.type,
          }),
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "خطا در به‌روزرسانی ویژگی");
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await deleteRequirementsFromBackend();
      await saveCategoryInfo();
      await saveImage();
      await saveUpdatedAttributes();
      await saveNewAttributes();
      alert("دسته‌بندی با موفقیت ذخیره شد.");
      navigate("/admin/لیست دسته ها");
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("آیا مطمئن هستید که می‌خواهید این دسته‌بندی را حذف کنید؟")) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `${baseUrl}/api/Sanjaghak/categories/${category.categoryId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("خطا در حذف دسته‌بندی");
      alert("دسته‌بندی حذف شد.");
      navigate("/admin/لیست دسته ها");
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loadingAttributes) {
    return <p style={{ textAlign: "center" }}>در حال بارگذاری ویژگی‌ها...</p>;
  }

  if (errorLoadingAttributes) {
    return (
      <p style={{ color: "red", textAlign: "center" }}>
        خطا در بارگذاری ویژگی‌ها: {errorLoadingAttributes}
      </p>
    );
  }

  return (
    <div className="editCategoryAttributesContainer">
      <button
        className="backBtnEditCategory"
        onClick={() => navigate("/admin/لیست دسته ها")}
        disabled={saving || deleting}
      >
        ← بازگشت
      </button>
      <h2 className="editCategoryAttributesTitle">ویرایش دسته بندی</h2>

      <div className="categoryInfoContainer">
        <label>نام دسته بندی:</label>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="categoryInput"
          placeholder="نام دسته بندی را وارد کنید"
          disabled={saving || deleting}
        />

        <label>تصویر دسته بندی:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={saving || deleting}
          className="fileInput"
        />
        {imagePreview && (
          <img src={imagePreview} alt="پیش‌نمایش" className="imagePreview" />
        )}

        <label>توضیحات:</label>
        <textarea
          value={categoryDescription}
          onChange={(e) => setCategoryDescription(e.target.value)}
          className="categoryInput"
          placeholder="توضیحات دسته بندی را وارد کنید"
          disabled={saving || deleting}
        />
      </div>

      <div className="topButtonsContainer">
        <button
          type="button"
          onClick={toggleEnabled}
          disabled={saving || deleting}
          className={`enableToggleBtn ${enabled ? "enabled" : "disabled"}`}
        >
          {enabled ? "غیرفعال‌سازی" : "فعال‌سازی"}
        </button>

        <button
          type="button"
          className="actionBtnEditCategory deleteBtn"
          onClick={handleDelete}
          disabled={saving || deleting}
        >
          {deleting ? "در حال حذف..." : "حذف دسته‌بندی"}
        </button>
      </div>

      <h3 className="editCategoryAttributesTitle">ویژگی‌های دسته بندی</h3>
      <div className="attributeList">
        {attributes.map((attr) => (
          <AdminCategoryAttributeField
            key={attr.id}
            id={attr.id}
            name={attr.name}
            value={attr.type}
            onDelete={handleDeleteAttribute}
            onNameChange={(val) => handleAttrChange(attr.id, { name: val })}
            onValueChange={(val) => handleAttrChange(attr.id, { type: val })}
          />
        ))}
      </div>

      <button
        type="button"
        className="addAttributeBtn"
        onClick={handleAddAttribute}
        disabled={saving || deleting}
      >
        + افزودن ویژگی جدید
      </button>

      <div className="stepButtonsEditCategory">
        <button
          type="button"
          className="saveBtnEditCategory"
          onClick={handleSave}
          disabled={saving || deleting}
        >
          {saving ? "در حال ذخیره..." : "ذخیره دسته‌بندی"}
        </button>
      </div>
    </div>
  );
}

export default EditCategoryAttributes;