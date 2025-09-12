import React, { useState, useEffect } from 'react';
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

const Shippinginformation = ({ isOpen, onClose, orderId }) => {
  const [formData, setFormData] = useState({ firstName: '' });
  const [shippingData, setShippingData] = useState(defaultShippingData);
  const [showThankYou, setShowThankYou] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const customerId = localStorage.getItem("customerId");

  // Fetch customer address on mount
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8080/api/Sanjaghak/customerAddress/getAddressByfilter?customerId=${customerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch customer address");
        const data = await res.json();
        const firstAddress = data.content?.[0];
        if (firstAddress) {
          setShippingData({
            country: firstAddress.country || '',
            province: firstAddress.state || '',
            city: firstAddress.city || '',
            address: `${firstAddress.addressLine1 || ''} ${firstAddress.addressLine2 || ''}`.trim(),
            postalCode: firstAddress.postalCode || '',
            phone: firstAddress.phone || ''
          });
        }
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    };

    if (isOpen) fetchAddress();
  }, [isOpen, customerId, token]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Shipping Info:', { ...formData, ...shippingData });

    if (!orderId) return alert("Order ID not found");

    try {
      const res = await fetch(`http://127.0.0.1:8080/api/Sanjaghak/Orders/reorder/${orderId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to confirm order");

      setShowThankYou(true);
    } catch (err) {
      console.error(err);
      alert("خطا در ثبت سفارش. لطفا دوباره تلاش کنید.");
    }
  };

  const handleEditClick = () => navigate('/profile-edit');

  const handleCloseThankYou = () => {
    setShowThankYou(false);
    onClose();
    window.location.reload();
  };

  if (!isOpen && !showThankYou) return null;
  if (showThankYou) return <ThankYouModal isOpen={true} onClose={handleCloseThankYou} />;

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
            <input type="text" value={shippingData.country} readOnly />
            <button type="button" className="edit-btn" onClick={handleEditClick}>✏️</button>
          </div>

          <label>استان:</label>
          <div className="readonly-field">
            <input type="text" value={shippingData.province} readOnly />
            <button type="button" className="edit-btn" onClick={handleEditClick}>✏️</button>
          </div>

          <label>شهر:</label>
          <div className="readonly-field">
            <input type="text" value={shippingData.city} readOnly />
            <button type="button" className="edit-btn" onClick={handleEditClick}>✏️</button>
          </div>

          <label>آدرس:</label>
          <div className="readonly-field">
            <textarea value={shippingData.address} readOnly />
            <button type="button" className="edit-btn" onClick={handleEditClick}>✏️</button>
          </div>

          <label>کد پستی:</label>
          <div className="readonly-field">
            <input type="text" value={shippingData.postalCode} readOnly />
            <button type="button" className="edit-btn" onClick={handleEditClick}>✏️</button>
          </div>

          <label>شماره تلفن ثابت:</label>
          <div className="readonly-field">
            <input type="tel" value={shippingData.phone} readOnly />
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