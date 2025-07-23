import React from "react";
import "/src/styles/imagecard.css";

function ImageCard({
  image = null,
  onFileSelect,
  placeholderText = "افزودن تصویر",
  width = 100,
  height = 80,
  title = "کلیک برای انتخاب تصویر",
}) {
  const inputRef = React.useRef(null);

const handleClick = () => {
  if (onFileSelect && inputRef.current) {
    inputRef.current.click();
  }
};

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className="imageCardContainer"
      onClick={handleClick}
      title={title}
      style={{ width, height }} // size controlled inline because it can be dynamic
    >
      {!image ? (
        <>
          <div
            className="imageCardPlus"
            style={{ fontSize: height * 0.6, lineHeight: height * 0.6 }} // font size dynamic
          >
            ＋
          </div>
          <div className="imageCardPlaceholderText">{placeholderText}</div>
        </>
      ) : (
        <img src={image} alt="preview" className="imageCardImage" />
      )}
      <input
        type="file"
        accept="image/*"
        className="imageCardInput"
        ref={inputRef}
        onChange={handleChange}
      />
    </div>
  );
}

export default ImageCard;