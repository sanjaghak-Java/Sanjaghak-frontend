
function AddBrand(){
    return(
        <>
        <br />
        <br />
        <h1 className="pageTitle">افزودن برند</h1>
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
          <label className="adminFloatingLabel">url لوگو</label>
        </div>       
        </div>
      <div className="inputWrapper">
        <textarea className="productDescription" placeholder=" " />
        <label className="adminFloatingLabel">توضیحات برند</label>
      </div>
      <button className="submitButton" type="submit">افزودن برند</button>


















        </form>
        </>





















    )
}
export default AddBrand