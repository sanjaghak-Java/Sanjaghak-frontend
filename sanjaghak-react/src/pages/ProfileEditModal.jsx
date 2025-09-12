import React, { useState, useEffect } from 'react';
import "/src/styles/EditInfo.css";

const ProfileEditModal = ({ userInfo, addressInfo, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });

  const [addressData, setAddressData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

useEffect(() => {
  if (!addressInfo) return;

  setFormData({
    firstName: userInfo.firstName || '',
    lastName: userInfo.lastName || '',
    phoneNumber: userInfo.phoneNumber || '',
    email: userInfo.email || ''
  });

  setAddressData({
    addressLine1: addressInfo.addressLine1 || '',
    addressLine2: addressInfo.addressLine2 || '',
    city: addressInfo.city || '',
    state: addressInfo.state || '',
    country: addressInfo.country || '',
    postalCode: addressInfo.postalCode || '',
    phone: addressInfo.phone || ''
  });
}, [userInfo, addressInfo]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // here we only build objects and let parent (EditProfile) handle API calls
      onSave(formData, addressData);
      onClose();
    } catch (err) {
      setError('خطا در ذخیره اطلاعات');
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
          <div className="location-inputs">
            <section style={{width: "100%"}}>
              <p>نام</p>
              <input
                type="text"
                className="profinput"
                name="firstName"
                value={formData.firstName}
                onChange={handleUserChange}
                placeholder="نام"
                disabled={loading}
              />
            </section>
            <section style={{width: "100%"}}>
              <p>نام خانوادگی</p>
              <input
                type="text"
                className="profinput"
                name="lastName"
                value={formData.lastName}
                onChange={handleUserChange}
                placeholder="نام خانوادگی"
                disabled={loading}
              />
            </section>
          </div>

          <p>شماره موبایل</p>
          <input
            type="text"
            className="profinput"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleUserChange}
            placeholder="شماره موبایل"
            disabled={loading}
          />

          <p>ایمیل</p>
          <input
            type="email"
            className="profinput"
            name="email"
            value={formData.email}
            onChange={handleUserChange}
            placeholder="ایمیل"
            disabled={loading}
          />

          <p>آدرس ۱</p>
<input
  type="text"
  className="profinput"
  name="addressLine1"
  value={addressData.addressLine1}
  onChange={handleAddressChange}
  placeholder="خیابان اصلی، کوچه..."
/>

<p>آدرس ۲</p>
<input
  type="text"
  className="profinput"
  name="addressLine2"
  value={addressData.addressLine2}
  onChange={handleAddressChange}
  placeholder="واحد، طبقه..."
/>

<div className="location-inputs">
  <input
    type="text"
    className="profinput"
    name="city"
    value={addressData.city}
    onChange={handleAddressChange}
    placeholder="شهر"
  />
  <input
    type="text"
    className="profinput"
    name="state"
    value={addressData.state}
    onChange={handleAddressChange}
    placeholder="استان"
  />
  <input
    type="text"
    className="profinput"
    name="country"
    value={addressData.country}
    onChange={handleAddressChange}
    placeholder="کشور"
  />
</div>

<p>کد پستی</p>
<input
  type="text"
  className="profinput"
  name="postalCode"
  value={addressData.postalCode}
  onChange={handleAddressChange}
  placeholder="کد پستی"
/>

<p>شماره تماس</p>
<input
  type="text"
  className="profinput"
  name="phone"
  value={addressData.phone}
  onChange={handleAddressChange}
  placeholder="شماره تماس"
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