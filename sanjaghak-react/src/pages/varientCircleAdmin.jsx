import React from "react";

function VariantCircle({ variant, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        textAlign: "center",
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
}

export default VariantCircle;