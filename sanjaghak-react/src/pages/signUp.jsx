import React from 'react';
import { Link } from 'react-router-dom';
import '/src/styles/signUp.css';
import ParticlesBackground from '../ParticlesBackground';


function SignUp() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <>
    <ParticlesBackground/>
    <form className="signUpBox" onSubmit={handleSubmit}>
      <h1>ثبت نام</h1>

      <div className="inputWrapper">
        <input type="text" required className="signUpInput"  placeholder=" " />
        <label  className="floatingLabel">نام</label>
      </div>

      <div className="inputWrapper">
        <input type="text" required className="signUpInput"  placeholder=" " />
        <label  className="floatingLabel">نام خانوادگی</label>
      </div>

      <div className="inputWrapper">
        <input type="tel" required pattern="^09\d{9}$" inputMode="numeric" className="signUpInput"  placeholder=" " />
        <label  className="floatingLabel">شماره موبایل</label>
      </div>

      <div className="inputWrapper">
        <input type="email" required className="signUpInput" placeholder=" " />
        <label  className="floatingLabel">ایمیل</label>
      </div>

      <div className="checkboxWrapper">
         <label >با شرایط و ضوابط سایت موافقم</label>
        <input type="checkbox" required className="check" />
      </div>

      <button className="signUpButton" type="submit">ثبت نام</button>

      <h4 id="signinlabel">قبلا ثبت نام کرده‌اید؟</h4><Link to="/signin"style={{color: "#dc2655",textDecoration: "none",fontSize: "18px",textAlign: "right" ,position:"relative",marginLeft:"200px",bottom:"21px"}}>ورود به حساب</Link>
    </form>
    </>
  );
}

export default SignUp;