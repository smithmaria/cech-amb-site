const ConfirmationModal = ({ isOpen, onClose, title, description, confirmLabel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <h2 className="modal-header">{title}</h2>
        <div className="modal-desc">{description ? description : null}</div>

        <div className="modal-buttons">
          <button onClick={onClose} className="button cancel">Cancel</button>
          <button onClick={onConfirm} className="button">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
