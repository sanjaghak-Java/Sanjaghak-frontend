import React, { use, useRef, useState } from 'react';
import { data, Link ,useNavigate} from 'react-router-dom';
import "./signIn.css"


function signIn(){
    const navigate = useNavigate();
    const [email,setEmail] = useState("");

  const handleSubmit = (e) => {
      e.preventDefault();
    console.log(email)
  fetch('http://localhost:8080/api/Sanjaghak/UserAccount/login/requestCode', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      phoneNumber: null
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
  const handleEmailChange =(input)=>{
    const value=input.target.value;
    setEmail(value)
  }
    return(
        <form className='signInBox' onSubmit={handleSubmit}>
            <h1>ورود با ایمیل</h1>
            <p>لطفا ایمیل خود را جهت دریافت کد وارد نمایید</p>
      <div className="inputWrapper">
        <input  type="email" required className="signInInput" id="email" placeholder=" " onChange={handleEmailChange} />
        <label  className="floatingLabel">ایمیل</label>
        <button className="signInButton" type="submit">ارسال کد</button>
      </div>
       <h4 id="signuplabel">حساب کاربری ندارید؟</h4><Link to="/signup"style={{color: "#dc2655",textDecoration: "none",position:"relative",right:"165px",bottom:"22px"}}>ثبت نام</Link>
       <Link to="/signinmobile" style={{color:"#dc2655",textDecoration:"none",position:"relative",right:"260px",bottom:"22px"}}>ورود با شماره موبایل</Link><br></br>
        </form>
    )
        
}
export default signIn