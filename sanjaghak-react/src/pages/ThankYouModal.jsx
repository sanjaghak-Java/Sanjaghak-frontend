import React from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/styles/ThankYouModal.css';

const ThankYouModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleBackToShop = () => {
    onClose();
    navigate('/');
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>🎉 ممنون از خرید شما!</h2>
        <br />
        <hr />
        <br />
        <p>سفارش شما با موفقیت ثبت شد. امیدواریم از خریدتون راضی باشید.</p>
        <button className="closeButton" onClick={handleBackToShop}>
          بازگشت به فروشگاه
        </button>
      </div>
    </div>
  );
};

export default ThankYouModal;
