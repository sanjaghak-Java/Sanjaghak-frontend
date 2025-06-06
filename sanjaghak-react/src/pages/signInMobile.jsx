import React, { useState } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import "/src/styles/signIn.css"


function signInMobile(){
  const navigate = useNavigate();
  const [phoneNumber,setPhoneNumber]= useState("")

  const handleSubmit = (e) => {
      e.preventDefault();
      fetch('http://localhost:8080/api/Sanjaghak/UserAccount/login/requestCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: null,
      phoneNumber: phoneNumber
    })
  })
  .then(response => {
    if (response.ok) {
      navigate('/confirmCode')
    } else {
      return response.text().then(errorMessage => {
        throw new Error(errorMessage); 
      });
    }
  })
  .then(data => {
    console.log("✅ Success:", data);
  })
  .catch(error => {
    console.error("❌ Error:", error.message);
  });
  };
  const handleNumberChange=(input)=>{
    const value=input.target.value;
    setPhoneNumber(value);

  }
    return(
        <form className='signInBox' onSubmit={handleSubmit}>
            <h1>ورود با شماره موبایل</h1>
            <p>لطفا شماره موبایل خود را جهت دریافت کد وارد نمایید</p>
      <div className="inputWrapper">
        <input type="tel" required pattern="^09\d{9}$" inputMode="numeric" className="signUpInput"  placeholder=" " onChange={handleNumberChange}/>
        <label  className="floatingLabel">شماره موبایل</label>
          <button className="signInButton" type="submit">ارسال کد</button>
      </div>
       <h4 id="signuplabel">حساب کاربری ندارید؟</h4><Link to="/signup"style={{color: "#dc2655",textDecoration: "none",position:"relative",right:"165px",bottom:"22px"}}>ثبت نام</Link>
       <Link to="/signin" style={{color:"#dc2655",textDecoration:"none",position:"relative",right:"320px",bottom:"22px"}}>ورود با ایمیل</Link><br></br>
        </form>
    );
        
}
export default signInMobile