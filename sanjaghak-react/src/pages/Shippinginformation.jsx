import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import "/src/styles/Shippinginformation.css";

const defaultShippingData = {
  country: '',
  province: '',
  city: '',
  address: '',
  postalCode: '',
  phone: ''
};

const ThankYouModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="shipping-modal-overlay">
      <div className="shipping-modal">
        <h2>🎉 ممنون از خرید شما!</h2>
        <p>سفارش شما با موفقیت ثبت شد. امیدواریم از خریدتون راضی باشید.</p>
        <div className="btn-row">
          <button onClick={onClose} className="submit-btn1">بستن</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Shippinginformation = ({ isOpen, onClose, shippingData = defaultShippingData }) => {
  const [formData, setFormData] = useState({
    firstName: '',
  });
  const [showThankYou, setShowThankYou] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Shipping Info:', { ...formData, ...shippingData });
    setShowThankYou(true);
  };

  const handleEditClick = () => {
    navigate('/profile-edit');  
  };

  const handleCloseThankYou = () => {
    setShowThankYou(false);
    onClose();
  };

  if (!isOpen && !showThankYou) return null;

  if (showThankYou) {
    return <ThankYouModal isOpen={true} onClose={handleCloseThankYou} />;
  }

  return ReactDOM.createPortal(
    <div className="shipping-modal-overlay">
      <div className="shipping-modal">
        <h2>اطلاعات تحویل‌گیرنده</h2>
        <form onSubmit={handleSubmit}>
          <label>نام تحویل‌گیرنده:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <label>کشور:</label>
          <div className="readonly-field">
            <input type="text" value={shippingData.country || ''} readOnly />
            <button type="button" className="edit-btn" onClick={handleEditClick}>✏️</button>
          </div>

          <label>استان:</label>
          <div className="readonly-field">
            <input type="text" value={shippingData.province || ''} readOnly />
            <button type="button" className="edit-btn" onClick={handleEditClick}>✏️</button>
          </div>

          <label>شهر:</label>
          <div className="readonly-field">
            <input type="text" value={shippingData.city || ''} readOnly />
            <button type="button" className="edit-btn" onClick={handleEditClick}>✏️</button>
          </div>

          <label>آدرس:</label>
          <div className="readonly-field">
            <textarea value={shippingData.address || ''} readOnly />
            <button type="button" className="edit-btn" onClick={handleEditClick}>✏️</button>
          </div>

          <label>کد پستی:</label>
          <div className="readonly-field">
            <input type="text" value={shippingData.postalCode || ''} readOnly />
            <button type="button" className="edit-btn" onClick={handleEditClick}>✏️</button>
          </div>

          <label>شماره تلفن ثابت:</label>
          <div className="readonly-field">
            <input type="tel" value={shippingData.phone || ''} readOnly />
            <button type="button" className="edit-btn" onClick={handleEditClick}>✏️</button>
          </div>

          <div className="btn-row">
            <button type="submit" className="submit-btn1">ثبت اطلاعات</button>
            <button type="button" onClick={onClose} className="cancel-btn1">بستن</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default Shippinginformation;
