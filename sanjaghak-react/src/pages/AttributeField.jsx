import "/src/styles/attributefield.css";

function AttributeField({ id, onDelete }) {
  return (
    <div className="attributeField">
      <div className="inputWrapper">
        <input type="text" required className="attributeKey" placeholder=" " />
        <label className="adminFloatingLabel">ویژگی</label>
      </div>
      <div className="inputWrapper">
        <input type="text" required className="attributeValue" placeholder=" " />
        <label className="adminFloatingLabel">مقدار</label>
      </div>
      <button
        type="button"
        className="deleteAttrBtn"
        onClick={() => onDelete(id)}
      >
        حذف
      </button>
    </div>
  );
}

export default AttributeField;