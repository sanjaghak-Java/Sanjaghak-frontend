import React from "react";
import "/src/styles/ModalConfirm.css";

function ModalConfirm({ message = "آیا از حذف این مورد اطمینان دارید؟", onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <button className="confirm-button" onClick={onConfirm}>تأیید</button>
          <button className="cancel-button" onClick={onCancel}>لغو</button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirm;
