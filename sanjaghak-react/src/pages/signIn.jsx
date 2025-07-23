import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "/src/styles/signIn.css";
import logo from '/src/assets/sanjaghak-logo.png';

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await fetch('http://localhost:8080/api/Sanjaghak/UserAccount/login/requestCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          phoneNumber: null
        })
      });

      if (response.ok) {
        console.log("✅ Code sent successfully");
        navigate('/confirmCode', { state: { email } }); // send email to confirmation page
      } else {
        const errorMessage = await response.text();
        console.error("❌ Server Error:", errorMessage);
        alert("خطا: " + errorMessage);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      alert("خطا در ارتباط با سرور");
    }
  };

  return (
    <>
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="Sanjaghak Logo" className='sign-logo' />
        </Link>
      </div>
      <form className='signInBox' onSubmit={handleSubmit}>
        <h1>ورود با ایمیل</h1>
        <p>لطفا ایمیل خود را جهت دریافت کد وارد نمایید.</p>

        <div className="inputWrappersignin">
          <input
            type="email"
            required
            className="signInInputemail"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="floatingLabel">ایمیل</label>
          <button className="signInButton" type="submit">ارسال کد</button>
        </div>

        <div className="signinlinkcontainor">
          <h4 id="signuplabel">حساب کاربری ندارید؟</h4>
          <Link to="/signup" id="signuplink">ثبت نام</Link>
          <Link to="/signinmobile" id="signinmobilelink">ورود با شماره موبایل</Link>
        </div>
      </form>
    </>
  );
}

export default SignIn;