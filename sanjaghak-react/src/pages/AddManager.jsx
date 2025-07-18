import { useNavigate } from "react-router-dom";
import "/src/styles/addmanager.css";

function AddEmployee() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <>
      <button
        className="backButtonadmin"
        onClick={() => navigate("/admin/لیست کارکنان")}
      >
        بازگشت
      </button>

      <h1 className="addManagerTitle">افزودن کارمند</h1>

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

        <div className="addmanager-inputWrapper">
          <select required className="addmanagerInput">
            <option value="storekeeper">انباردار</option>
            <option value="manager">مدیر</option>
          </select>
          <label className="addmanager-floatingLabel">نقش</label>
        </div>

        <button className="addmanagerButton" type="submit">ثبت نام</button>
      </form>
    </>
  );
}

export default AddEmployee;