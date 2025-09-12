import React, { useState, useEffect, useRef } from 'react';
import '/src/styles/ProfileEdit.css';
import Navbar from './Navbar';
import Footer from './Footer';
import ProfileMenu from './ProfileMenu';
import prof from '../assets/prof.png';
import editIcon from '../assets/editicon.png';
import ProfileEditModal from './ProfileEditModal';
import BackgroundPattern from './BackgroundPattern';

function EditProfile() {
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
  });
  const [addressInfo, setAddressInfo] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const backgroundAreaRef = useRef(null);
  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    const userId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      alert('لطفاً ابتدا وارد شوید');
      return;
    }

    fetch(`http://127.0.0.1:8080/api/Sanjaghak/UserAccount/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('خطا در دریافت اطلاعات کاربر');
        }
        return res.json();
      })
      .then(data => {
        setUserInfo({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phoneNumber: data.phoneNumber || '',
          email: data.email || '',
          address: '' 
        });

        return fetch(`http://127.0.0.1:8080/api/Sanjaghak/customerAddress/getAddressByfilter?customerId=${customerId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      })
      .then(res => {
        if (!res.ok) throw new Error('خطا در دریافت آدرس کاربر');
        return res.json();
      })
.then(data => {
  console.log("Address response:", data); 
  if (data && data.content && data.content.length > 0) {
    setAddressInfo(data.content[0]); 
  }
  setLoading(false);
})
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const fullName = `${userInfo.firstName} ${userInfo.lastName}`.trim();

const handleSave = async (updatedInfo, updatedAddress) => {
  const userId = localStorage.getItem('id');
  const token = localStorage.getItem('token');

  try {
    setUserInfo(updatedInfo);
    const addressBody = {
      addressLine1: updatedAddress.addressLine1 || "",
      addressLine2: updatedAddress.addressLine2 || "",
      city: updatedAddress.city || "",
      state: updatedAddress.state || "",
      country: updatedAddress.country || "",
      postalCode: updatedAddress.postalCode || "",
      phone: updatedAddress.phone || ""
    };

    if (addressInfo) {
      const res = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/customerAddress/${addressInfo.addressId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(addressBody)
        }
      );
      if (!res.ok) throw new Error('خطا در بروزرسانی آدرس');
      const newAddress = await res.json();
      setAddressInfo(newAddress);
      setUserInfo(prev => ({
        ...prev,
        address: `${newAddress.addressLine1} ${newAddress.addressLine2}, ${newAddress.city}, ${newAddress.state}, ${newAddress.country}, ${newAddress.postalCode}`
      }));
    } else {
      const res = await fetch(
        `http://127.0.0.1:8080/api/Sanjaghak/customerAddress/addCustomerAddress?customerId=${userId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(addressBody)
        }
      );
      if (!res.ok) {
        const errText = await res.text();
        console.error("Server error body:", errText);
        throw new Error('خطا در افزودن آدرس');
      }
      const newAddress = await res.json();
      setAddressInfo(newAddress);
      setUserInfo(prev => ({
        ...prev,
        address: `${newAddress.addressLine1} ${newAddress.addressLine2}, ${newAddress.city}, ${newAddress.state}, ${newAddress.country}, ${newAddress.postalCode}`
      }));
    }

    setShowModal(false);
  } catch (err) {
    console.error(err);
    alert('خطا در ذخیره تغییرات');
  }
};

  if (loading) {
    return <div>در حال بارگذاری اطلاعات...</div>;
  }

  return (
    <>
      <Navbar />

      <div className="background-content-wrapper" ref={backgroundAreaRef}>
        <BackgroundPattern parentRef={backgroundAreaRef} />

        <div className="profilecontent" style={{ display: 'flex', gap: '20px' }}>
          <ProfileMenu />

          <div className="orderdiv" style={{ flex: 1 }}>
            <div className="bordertwo" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px' }}>
              <div className="titleprof" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="titleprofile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={prof} alt="profile icon" className="editimg" />
                  <h3 className="titlehprof">اطلاعات کاربری</h3>
                </div>

                <button className="editbutton" onClick={() => setShowModal(true)}>
                  <img src={editIcon} alt="edit icon" className="editimg" />
                  ویرایش
                </button>
              </div>

              <br />
              <hr />
              <br />

              <div className="profdiv">
                <p className="proftext">نام و نام خانوادگی</p>
                <label>{fullName}</label>
                <hr className="profhr" />
              </div>
              <div className="profdiv">
                <p className="proftext">شماره موبایل</p>
                <label>{userInfo.phoneNumber}</label>
                <hr className="profhr" />
              </div>
              <div className="profdiv">
                <p className="proftext">ایمیل</p>
                <label>{userInfo.email}</label>
                <hr className="profhr" />
              </div>
<div className="profdiv">
  <p className="proftext">آدرس</p>
  {addressInfo ? (
    <label>
      {`${addressInfo.addressLine1} ${addressInfo.addressLine2}, ${addressInfo.city}, ${addressInfo.state}, ${addressInfo.country}, ${addressInfo.postalCode}`}
    </label>
  ) : (
    <label>آدرسی ثبت نشده است</label>
  )}
</div>
            </div>
          </div>
        </div>

{showModal && (
  <ProfileEditModal
    key={addressInfo ? addressInfo.addressId : 'new'} 
    userInfo={userInfo}
    addressInfo={addressInfo || {}} 
    onClose={() => setShowModal(false)}
    onSave={handleSave}
  />
)}
        <Footer />
      </div>
    </>
  );
}

export default EditProfile;