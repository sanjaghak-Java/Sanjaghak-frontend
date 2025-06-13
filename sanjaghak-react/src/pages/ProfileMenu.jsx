import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import background from '../assets/background.png';
import prof from '../assets/prof.png';
import Shop from '../assets/shop.png';
import favorite from '../assets/favorite.png';
import exit from '../assets/exit2.png';
import LogoutModal from './LogoutModal';
import "/src/styles/profile.css";

const ProfileMenu = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className='profilepage'>
      <div className="menubar">
        <img src={background} alt="" className="backimg" />
        <div className="infopart">
          <img src={prof} alt="" className="editimg" />
          <label className="name">جعفر تنها</label>
        </div>

        <button
          className={`linkprof ${location.pathname === '/profile-orders' ? 'active' : ''}`}
          onClick={() => navigate('/profile-orders')}
        >
          <img src={Shop} alt="" className='editimg' /> سفارش‌ها
        </button>

        <button
          className={`linkprof ${location.pathname === '/profile-favorites' ? 'active' : ''}`}
          onClick={() => navigate('/profile-favorites')}
        >
          <img src={favorite} alt="" className='editimg' /> علاقه‌مندی‌ها
        </button>

        <button
          className={`linkprof ${location.pathname === '/profile-edit' ? 'active' : ''}`}
          onClick={() => navigate('/profile-edit')}
        >
          <img src={prof} alt="" className='profimg' /> ویرایش پروفایل
        </button>

        <button className="exit" onClick={() => setShowLogoutModal(true)}>
          <img src={exit} alt="" className="editimg" /> خروج از حساب کاربری
        </button>
      </div>

      {showLogoutModal && (
        <LogoutModal onClose={() => setShowLogoutModal(false)} />
      )}
    </div>
  );
};

export default ProfileMenu;
