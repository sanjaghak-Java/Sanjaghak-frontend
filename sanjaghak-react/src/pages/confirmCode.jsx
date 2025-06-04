import React, { useRef,useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./confirmCode.css";
import ParticlesBackground from '../ParticlesBackground';

function confirmCode() {
  const inputs = useRef([]);
const [secondsLeft, setSecondsLeft] = useState(300);

  useEffect(() => {
    const timerId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        else{
        return prev - 1;
        }
      });
    }, 1000);

  },[]);


  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      if (index < 5) {
        inputs.current[index + 1].focus();
      }
    } else {
      e.target.value = '';
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <>
    <ParticlesBackground/>
    <div className="codeBox">
      <h1>احراز هویت</h1>
      <p>لطفا کد 6 رقمی ارسال شده به ایمیل/شماره خود را وارد نمایید</p>

      <div className="digitContainer">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            type="text"
            className="digitBox"
            maxLength={1}
            ref={(el) => (inputs.current[i] = el)}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        ))}
      </div>
      <p>زمان باقی مانده :  {secondsLeft}</p>
      <button className="submitButton">تایید</button>
      <Link to="/signin" style={{color:"#dc2655",textDecoration:'none',position:"relative",top:"10px",right:"400px"}}>بازگشت</Link>
    </div>
    </>
  );
}

export default confirmCode;