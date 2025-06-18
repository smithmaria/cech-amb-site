const ConfirmAttendance = ({ isOpen, onClose, onConfirm, isUserSignedUp }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <h2 className="modal-header">
          {isUserSignedUp ? 'Remove RSVP' : 'Confirm RSVP'}
        </h2>

        <div className="modal-buttons">
          <button onClick={onClose} className="button cancel">Cancel</button>          
          <button onClick={onConfirm} className="button">Confirm</button>          
        </div>
      </div>
    </div>
  );
}

export default ConfirmAttendance;
