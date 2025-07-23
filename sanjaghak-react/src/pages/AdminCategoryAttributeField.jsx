import React from "react";
import "/src/styles/attributefield.css";

function AdminCategoryAttributeField({
  id,
  name = "",
  value = "",
  readOnly = false,
  isDefault = false,
  onDelete,
  onNameChange,
  onValueChange,
}) {
  return (
    <div className="attributeField">
      <div className="inputWrapper">
        <input
          type="text"
          className="attributeKey"
          placeholder=" "
          required
          readOnly={readOnly}
          value={name}
          onChange={(e) => {
            if (onNameChange) onNameChange(e.target.value);
          }}
        />
        <label className="adminFloatingLabel">ویژگی</label>
      </div>

      <div className="inputWrapper">
        <input
          type="text"
          className="attributeValue"
          placeholder=" "
          required
          value={value}
          onChange={(e) => {
            if (onValueChange) onValueChange(e.target.value);
          }}
        />
        <label className="adminFloatingLabel">واحد</label>
      </div>

      {!isDefault && (
        <button
          type="button"
          className="deleteAttrBtn"
          onClick={() => onDelete(id)}
        >
          حذف
        </button>
      )}
    </div>
  );
}

export default AdminCategoryAttributeField;