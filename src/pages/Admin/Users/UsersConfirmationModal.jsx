import { useState } from "react";
import { db } from "../../../firebase";
import ProfileIcon from "../../../components/ProfileIcon";
import { deleteDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

const USERS_COLLECTION = import.meta.env.VITE_USERS_COLLECTION || 'users';

const UsersConfirmationModal = ({
  isOpen, 
  onClose,
  title,
  onConfirm,
  users, 
  setUsers, 
  selectedUsers, 
  setSelectedUsers
}) => {
  const [deleting, setDeleting] = useState(false);

  const selectedUserData = users.filter(user => selectedUsers.has(user.id));

  const handleRemoveRecipient = (userId) => {
    const newSelectedUsers = new Set(selectedUsers);
    newSelectedUsers.delete(userId);

    setSelectedUsers(newSelectedUsers);

    if (newSelectedUsers.size === 0) {
      onClose();
    }
  };

  if (!isOpen) return null;

   return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delete-user-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <h2 className="modal-header">
          {title}
        </h2>

        <div className="message-recipients">
          {selectedUserData.map(user => (
            <div key={user.id} className="recipient-item">
              <ProfileIcon 
                src={user.profilePictureURL} 
                size="small"
              />
              <div className="to-email">{user.email}</div>
              <div 
                className="remove-recipient"
                title="Remove email"
                onClick={() => {
                  handleRemoveRecipient(user.id);
                }}
              >
                ×
              </div>
            </div>
          ))}
        </div>

        <div className="modal-buttons">
          <button onClick={onClose} className="button cancel">Cancel</button>
          <button 
            className="button"
            title={`Delete ${selectedUsers.size} selected user(s)`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </div>
   )
};

export default UsersConfirmationModal;
