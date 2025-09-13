import React from 'react';
import Logo from '../assets/sanjaghak-logo.png';
import "/src/styles/logout-modal.css";
import { Link, useNavigate } from 'react-router-dom';

function LogoutModal({ onClose }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    onClose();
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("customerId");
        localStorage.removeItem("role");
            navigate("/signin");

  };

  return (
    <div className="exitpage">
      <div className='exitpopup'>
        <button className="exitclose" onClick={onClose}>×</button>
        <div className="exittext">
          <p className="exitp">خارج شدن از حساب کاربری</p>
          <img src={Logo} alt="" className='exitlogo' />
        </div>
        <hr className="exithr" />

        <div className="exitbuttons">
          <p className='exitquestion'>آیا مایل هستید از حساب کاربری خود خارج شوید؟</p>
          <div className="buttonscontainor">
            <button className="optoutbut" onClick={onClose}>انصراف</button>
            <button className='exitbut' onClick={handleLogout}>خروج از حساب</button> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
