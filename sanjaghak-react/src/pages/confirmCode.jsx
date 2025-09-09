import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "/src/styles/confirmCode.css";
import ParticlesBackground from '../ParticlesBackground';

function ConfirmCode() {
  const inputs = useRef([]);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      alert("ایمیل یافت نشد");
      navigate('/signin');
    }
  }, [email, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

const handleSubmit = async () => {
  const code = inputs.current.map(input => input.value).join('');
  if (code.length !== 6) {
    setError("کد باید 6 رقمی باشد");
    return;
  }
  try {
    // Step 1: Verify code
    const response = await fetch('http://127.0.0.1:8080/api/Sanjaghak/UserAccount/login/verifyCode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, phoneNumber: null, code: code })
    });

    if (!response.ok) {
      const err = await response.text();
      setError(err);
      return;
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('id', data.id); // userId

    // Step 2: Get user role
    const roleResponse = await fetch('http://127.0.0.1:8080/api/Sanjaghak/UserAccount/getUserRole', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${data.token}`
      }
    });

    if (!roleResponse.ok) {
      const err = await roleResponse.text();
      setError("خطا در دریافت نقش کاربر: " + err);
      return;
    }

    const role = await roleResponse.text();

    // Step 3: If not admin, fetch customer info
if (role !== "admin") {
  const customerResponse = await fetch(
    `http://127.0.0.1:8080/api/Sanjaghak/Customer/getCustomerByfilter?userId=${data.id}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${data.token}`
      }
    }
  );

  if (!customerResponse.ok) {
    const err = await customerResponse.text();
    setError("خطا در دریافت اطلاعات مشتری: " + err);
    return;
  }

  const customerData = await customerResponse.json();

  // Extract the customerId from paginated response
  const customerId = customerData.content && customerData.content.length > 0
    ? customerData.content[0].customerId
    : null;

  if (customerId) {
    localStorage.setItem('customerId', customerId);
  } else {
    console.warn("customerId not found in API response", customerData);
  }
}

    // Step 4: Navigate based on role
    if (role === "admin") {
      navigate('/admin/داشبورد');
    } else {
      navigate('/');
    }

  } catch (e) {
    console.error(e);
    setError("خطا در ارتباط با سرور");
  }
};

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      if (index < 5) inputs.current[index + 1].focus();
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
      <ParticlesBackground />
      <div className="codeBox">
        <h1>احراز هویت</h1>
        <p>کد ۶ رقمی ارسال شده به {email} را وارد کنید</p>
        <div className="digitContainer">
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              type="text"
              className="digitBox"
              maxLength={1}
              ref={(el) => inputs.current[i] = el}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
            />
          ))}
        </div>
        <p>زمان باقی‌مانده: {secondsLeft} ثانیه</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className="submit-Button" onClick={handleSubmit}>تایید</button>
        <div style={{ direction: 'ltr' }}>
          <Link id="signinlink" to="/signin">بازگشت</Link>
        </div>
      </div>
    </>
  );
}

export default ConfirmCode;