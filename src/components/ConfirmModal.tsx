import React from "react";
import "../styles/ConfirmModal.css";

interface ConfirmModalProps {
  message: string;
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  isVisible,
  onConfirm,
  onCancel,
}) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn-confirm" onClick={onConfirm}>
            Yes
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;