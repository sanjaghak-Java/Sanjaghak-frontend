import React from "react";
import "/src/styles/attributefield.css";
import bin from '../assets/bin.png';

function AttributeField({
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
        <label className="adminFloatingLabel">مقدار</label>
      </div>

      {!isDefault && (
        <button
          type="button"
          className="deleteAttrBtn"
          onClick={() => onDelete(id)}
        >
          <img src={bin} alt="" />
        </button>
      )}
    </div>
  );
}

export default AttributeField;