import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import "./signIn.css"

function signInMobile(){
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    navigate('/confirmCode');  
  };
    return(
        <form className='signInBox' onSubmit={handleSubmit}>
            <h1>ورود با شماره موبایل</h1>
            <p>لطفا شماره موبایل خود را جهت دریافت کد وارد نمایید</p>
      <div className="inputWrapper">
        <input type="tel" required pattern="^09\d{9}$" inputMode="numeric" className="signUpInput"  placeholder=" "/>
        <label  className="floatingLabel">شماره موبایل</label>
          <button className="signInButton" type="submit">ارسال کد</button>
      </div>
       <h4 id="signuplabel">حساب کاربری ندارید؟</h4><Link to="/signup"style={{color: "#dc2655",textDecoration: "none",position:"relative",right:"165px",bottom:"22px"}}>ثبت نام</Link>
       <Link to="/signin" style={{color:"#dc2655",textDecoration:"none",position:"relative",right:"320px",bottom:"22px"}}>ورود با ایمیل</Link><br></br>
        </form>
    );
        
}
export default signInMobile