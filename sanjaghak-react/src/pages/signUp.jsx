import React from 'react';
import { Link } from 'react-router-dom';
import '/src/styles/signUp.css';
import ParticlesBackground from '../ParticlesBackground';
import logo from '/src/assets/sanjaghak-logo.png';



function SignUp() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <>
      <div className="signup-logo-container">
        <Link to="/">
          <img src={logo} alt="Sanjaghak Logo" className='signup-logo' />
        </Link>
      </div>
      <ParticlesBackground />
      <form className="signUpBox" onSubmit={handleSubmit}>
        <h1>ثبت نام</h1>

        <div className="signup-inputWrapper">
          <input type="text" required className="signUpInput" placeholder=" " />
          <label className="signup-floatingLabel">نام</label>
        </div>

        <div className="signup-inputWrapper">
          <input type="text" required className="signUpInput" placeholder=" " />
          <label className="signup-floatingLabel">نام خانوادگی</label>
        </div>

        <div className="signup-inputWrapper">
          <input type="tel" required pattern="^09\d{9}$" inputMode="numeric" className="signUpInput" placeholder=" " />
          <label className="signup-floatingLabel">شماره موبایل</label>
        </div>

        <div className="signup-inputWrapper">
          <input type="email" required className="signUpInput" placeholder=" " />
          <label className="signup-floatingLabel">ایمیل</label>
        </div>

        <div className="checkboxWrapper">
          <label >با شرایط و ضوابط سایت موافقم</label>
          <input type="checkbox" required className="check" />
        </div>

        <button className="signUpButton" type="submit">ثبت نام</button>

        <h4 id="signinlabel">قبلا ثبت نام کرده‌اید؟</h4>
        <Link to="/signin" className='for-signin' >ورود به حساب</Link>
      </form>
    </>
  );
}

export default SignUp;