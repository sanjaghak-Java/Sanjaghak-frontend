
import React from "react";
import { useNavigate } from "react-router-dom";

function AddBrand() {
  const navigate = useNavigate();

  return (
    <>
      <div className="addCategoryHeaderadmin">
        <button
          className="backButtonadmin"
          onClick={() => navigate("/admin/لیست برند ها")}
        >
          بازگشت
        </button>
        <h1 className="pageTitleadmin">افزودن برند</h1>
      </div>

      <form className="addProductContainer">
        <div className="inputWrapper">
          <input type="text" required className="brandName" placeholder=" " />
          <label className="adminFloatingLabel">نام برند</label>
        </div>

        <div className="inputGroup">
          <div className="inputWrapper">
            <input type="text" required className="webUrl" placeholder=" " />
            <label className="adminFloatingLabel">وبسایت برند</label>
          </div>
          <div className="inputWrapper">
            <input type="text" required className="logoUrl" placeholder=" " />
            <label className="adminFloatingLabel">URL لوگو</label>
          </div>
        </div>

        <div className="inputWrapper">
          <textarea className="productDescription" placeholder=" " />
          <label className="adminFloatingLabel">توضیحات برند</label>
        </div>

        <button className="submitButton" type="submit">افزودن برند</button>
      </form>
    </>
  );
}

export default AddBrand;