

import "/src/styles/addmanager.css";


function AddWarehouseManager(){
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <>
     <br /><br /><br /><br /><br />
      <h1 className="addManagerTitle">افزودن انباردار</h1>

      <form className="addManagerBox" onSubmit={handleSubmit}>
        <div className="addmanager-inputWrapper">
          <input type="text" required className="addmanagerInput" placeholder=" " />
          <label className="addmanager-floatingLabel">نام</label>
        </div>

        <div className="addmanager-inputWrapper">
          <input type="text" required className="addmanagerInput" placeholder=" " />
          <label className="addmanager-floatingLabel">نام خانوادگی</label>
        </div>

        <div className="addmanager-inputWrapper">
          <input
            type="tel"
            required
            pattern="^09\d{9}$"
            inputMode="numeric"
            className="addmanagerInput"
            placeholder=" "
          />
          <label className="addmanager-floatingLabel">شماره موبایل</label>
        </div>

        <div className="addmanager-inputWrapper">
          <input type="email" required className="addmanagerInput" placeholder=" " />
          <label className="addmanager-floatingLabel">ایمیل</label>
        </div>

        <button className="addmanagerButton" type="submit">ثبت نام</button>
      </form>
    </>
  );
}
export default AddWarehouseManager