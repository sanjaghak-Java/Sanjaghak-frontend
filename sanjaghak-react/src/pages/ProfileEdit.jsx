import React, { useState } from 'react';
import "/src/styles/profile.css";
import Navbar from './navbar';    
import Footer from './Footer';  
import ProfileMenu from './ProfileMenu';
import prof from '../assets/prof.png';
import editIcon from '../assets/editicon.png';
import ProfileEditModal from './ProfileEditModal';

function EditProfile() {
  const [userInfo, setUserInfo] = useState({
    fullName: 'جعفر تنها',
    phone: '09123456789',
    email: 'jaafar@example.com',
    address: 'تهران، خیابان انقلاب، پلاک ۱۲۳'
  });

  const [showModal, setShowModal] = useState(false);

  const handleSave = (updatedInfo) => {
    setUserInfo(updatedInfo);
    setShowModal(false);
  };

  return (
    <>
      <Navbar />
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
              <p className="proftext">نام و نام خانوادگی</p><label>{userInfo.fullName}</label><hr className="profhr" />
            </div>
            <div className="profdiv">
              <p className="proftext">شماره موبایل</p><label>{userInfo.phone}</label><hr className="profhr" />
            </div>
            <div className="profdiv">
              <p className="proftext">ایمیل</p><label>{userInfo.email}</label><hr className="profhr" />
            </div>
            <div className="profdiv">
              <p className="proftext">آدرس</p><label>{userInfo.address}</label>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ProfileEditModal
          userInfo={userInfo}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      <Footer />
    </>
  );
}

export default EditProfile;
