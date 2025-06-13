import React, { useState } from 'react';
import "/src/styles/EditInfo.css";

const ProfileEditModal = ({ userInfo, onClose, onSave }) => {
  const [formData, setFormData] = useState(userInfo);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // ارسال داده به کامپوننت اصلی
  };

  return (
    <div className="overlay">
      <div className='popupbox'>
        <button className="closebtn" onClick={onClose}>×</button>
        <h2 className='popuptitle'>ویرایش اطلاعات</h2>
        <hr className="hrpart" />

        <form className="formbox" onSubmit={handleSubmit}>
          <p>نام و نام خانوادگی</p>
          <input type="text" className="profinput" name="fullName" value={formData.fullName} onChange={handleChange} />
          <p>شماره موبایل</p>
          <input type="text" className="profinput" name="phone" value={formData.phone} onChange={handleChange} />
          <p>ایمیل</p>
          <input type="email" className="profinput" name="email" value={formData.email} onChange={handleChange} />
          <p>آدرس</p>
          <input type="text" className="profinput" name="address" value={formData.address} onChange={handleChange} />
          <div className="formbuttons">
            <button type="submit" className='submitbtn'>ثبت</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
