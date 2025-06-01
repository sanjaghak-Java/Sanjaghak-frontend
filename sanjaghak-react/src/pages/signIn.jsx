import React from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import "./signIn.css"

function signIn(){
    const navigate = useNavigate();

  const handleSubmit = (e) => {
    navigate('/confirmCode');  
  };
    return(
        <form className='signInBox' onSubmit={handleSubmit}>
            <h1>ورود با ایمیل</h1>
            <p>لطفا ایمیل خود را جهت دریافت کد وارد نمایید</p>
      <div className="inputWrapper">
        <input type="email" required className="signInInput" id="email" placeholder=" " />
        <label  className="floatingLabel">ایمیل</label>
        <button className="signInButton" type="submit">ارسال کد</button>
      </div>
       <h4 id="signuplabel">حساب کاربری ندارید؟</h4><Link to="/signup"style={{color: "#dc2655",textDecoration: "none",position:"relative",right:"165px",bottom:"22px"}}>ثبت نام</Link>
       <Link to="/signinmobile" style={{color:"#dc2655",textDecoration:"none",position:"relative",right:"260px",bottom:"22px"}}>ورود با شماره موبایل</Link><br></br>
        </form>
    )
        
}
export default signIn