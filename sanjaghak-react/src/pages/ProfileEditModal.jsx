import React, { useState, useEffect } from 'react';
import "/src/styles/EditInfo.css";

const ProfileEditModal = ({ userInfo, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData(userInfo);
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    if (!token || !userId) {
      setError('لطفا ابتدا وارد شوید');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/UserAccount/updateUsers/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || 'خطا در بروزرسانی اطلاعات');
        setLoading(false);
        return;
      }

      const updatedUser = await response.json();
      onSave(updatedUser);
      onClose();
    } catch (err) {
      setError('خطا در ارتباط با سرور');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay">
      <div className='popupbox'>
        <button className="closebtn" onClick={onClose} disabled={loading}>×</button>
        <h2 className='popuptitle'>ویرایش اطلاعات</h2>
        <hr className="hrpart" />

        <form className="formbox" onSubmit={handleSubmit}>
          <p>نام</p>
          <input
            type="text"
            className="profinput"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="نام"
            disabled={loading}
          />

          <p>نام خانوادگی</p>
          <input
            type="text"
            className="profinput"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="نام خانوادگی"
            disabled={loading}
          />

          <p>شماره موبایل</p>
          <input
            type="text"
            className="profinput"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="شماره موبایل"
            disabled={loading}
          />

          <p>ایمیل</p>
          <input
            type="email"
            className="profinput"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ایمیل"
            disabled={loading}
          />

          <p>آدرس</p>
          <input
            type="text"
            className="profinput"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="آدرس"
            disabled={loading}
          />

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

          <div className="formbuttons">
            <button type="submit" className='submitbtn' disabled={loading}>
              {loading ? 'در حال ذخیره...' : 'ثبت'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;