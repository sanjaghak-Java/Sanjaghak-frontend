import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '/src/styles/signUp.css';
import ParticlesBackground from '../ParticlesBackground';
import logo from '/src/assets/sanjaghak-logo.png';

function SignUp() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const sendCode = async () => {
    if (!phone && !email) {
      setError('ایمیل یا شماره موبایل را وارد کنید');
      return;
    }
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8080/api/Sanjaghak/UserAccount/requestCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, email: email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'خطا در ارسال کد');
        return;
      }
      alert('کد ارسال شد');
      setTimer(120);
    } catch (err) {
      setError('خطا در ارتباط با سرور');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agree) {
      setError('لطفا با شرایط و ضوابط سایت موافقت کنید');
      return;
    }
    setError(null);

    // Step 1: Verify code
    try {
      const verifyResponse = await fetch('http://127.0.0.1:8080/api/Sanjaghak/UserAccount/verifyCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phoneNumber: phone, code }),
      });
      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        setError(errorData.error || 'کد تایید اشتباه است');
        return;
      }
    } catch (err) {
      setError('خطا در تایید کد');
      return;
    }

    // Step 2: Register
    const userData = { firstName: name, lastName: surname, phoneNumber: phone, email };
    try {
      const response = await fetch('http://127.0.0.1:8080/api/Sanjaghak/UserAccount/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'خطا در ثبت نام');
        return;
      }
      const data = await response.json();
      alert(`ثبت نام موفق: ${data.message}`);
      localStorage.setItem('token', data.token);
      navigate('/signin');
    } catch (err) {
      setError('خطا در ارتباط با سرور');
    }
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
          <input type="text" required placeholder=" " className="signUpInput" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="signup-floatingLabel">نام</label>
        </div>

        <div className="signup-inputWrapper">
          <input type="text" required placeholder=" " className="signUpInput" value={surname} onChange={(e) => setSurname(e.target.value)} />
          <label className="signup-floatingLabel">نام خانوادگی</label>
        </div>

        <div className="signup-inputWrapper">
          <input type="tel" required pattern="^09\d{9}$" placeholder=" " className="signUpInput" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <label className="signup-floatingLabel">شماره موبایل</label>
        </div>

        <div className="signup-inputWrapper">
          <input type="email" required placeholder=" " className="signUpInput" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="signup-floatingLabel">ایمیل</label>
        </div>

        <div className="signup-inputWrapper">
          <input type="text" required placeholder=" " className="signUpInput" value={code} onChange={(e) => setCode(e.target.value)} />
          <label className="signup-floatingLabel">کد تایید</label>
          <button type="button" onClick={sendCode} disabled={timer > 0} className="signUpButton" style={{ marginTop: '8px' }}>
            {timer > 0 ? `ارسال مجدد (${timer})` : 'ارسال کد'}
          </button>
        </div>

        <div className="checkboxWrapper">
          <label>با <Link to="/rules" id='singup-rules'>شرایط و ضوابط</Link> سایت موافقم</label>
          <input type="checkbox" className="check" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        </div>

        {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}

        <button className="signUpButton" type="submit">ثبت نام</button>

        <h4 id="signinlabel">قبلا ثبت نام کرده‌اید؟</h4>
        <Link to="/signin" className='for-signin'>ورود به حساب</Link>
      </form>
    </>
  );
}

export default SignUp;