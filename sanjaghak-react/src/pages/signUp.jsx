import React from 'react';
import { Link } from 'react-router-dom';
import './signUp.css';

function SignUp() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <form className="signUpBox" onSubmit={handleSubmit}>
      <h1>ثبت نام</h1>

      <div className="inputWrapper">
        <input type="text" required className="signUpInput" id="name" placeholder=" " />
        <label  className="floatingLabel">نام</label>
      </div>

      <div className="inputWrapper">
        <input type="text" required className="signUpInput" id="family" placeholder=" " />
        <label  className="floatingLabel">نام خانوادگی</label>
      </div>

      <div className="inputWrapper">
        <input type="tel" required pattern="^09\d{9}$" inputMode="numeric" className="signUpInput" id="phone" placeholder=" " />
        <label  className="floatingLabel">شماره موبایل</label>
      </div>

      <div className="inputWrapper">
        <input type="email" required className="signUpInput" id="email" placeholder=" " />
        <label  className="floatingLabel">ایمیل</label>
      </div>

      <div className="checkboxWrapper">
         <label >با شرایط و ضوابط سایت موافقم</label>
        <input type="checkbox" required className="check" id="terms" />
      </div>

      <button className="signUpButton" type="submit">ثبت نام</button>

      <h4 id="signinlabel">قبلا ثبت نام کرده‌اید؟</h4><Link to="/signin"style={{color: "#dc2655",textDecoration: "none",fontSize: "18px",textAlign: "right" ,position:"relative",marginLeft:"200px",bottom:"21px"}}>ورود به حساب</Link>
    </form>
  );
}

export default SignUp;