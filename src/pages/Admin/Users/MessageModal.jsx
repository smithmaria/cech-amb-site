import ProfileIcon from "../../../components/ProfileIcon";
import { MdContentCopy } from "react-icons/md";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

const MessageModal = ({
  isOpen, 
  onClose, 
  users, 
  selectedUsers, 
  setSelectedUsers, 
  emailSubject,
  emailBody
}) => {
  const selectedUserData = users.filter(user => selectedUsers.has(user.id));
  const [subject, setSubject] = useState(emailSubject);
  const [message, setMessage] = useState(emailBody);

  useEffect(() => {
    setSubject(emailSubject);
    setMessage(emailBody);
  }, [emailSubject, emailBody]);

  const handleCopyRecipients = async () => {
    const emailList = selectedUserData.map(user => user.email). join(', ');
  
    try {
      await navigator.clipboard.writeText(emailList);
      toast.success('Emails copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy emails');
      console.error('Failed to copy emails:', error);
    }
  };

  const handleRemoveRecipient = (userId) => {
    const newSelectedUsers = new Set(selectedUsers);
    newSelectedUsers.delete(userId);

    setSelectedUsers(newSelectedUsers);

    if (newSelectedUsers.size === 0) {
      onClose();
    }
  };

  const handleOpenOutlook = () => {
    const selectedUserData = users.filter(user => selectedUsers.has(user.id));
    const emailList = selectedUserData.map(user => user.email).join(';');
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(message);
    
    const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${emailList}&subject=${encodedSubject}&body=${encodedBody}`;
    
    window.open(outlookUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="message-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose} title="Close">
            ×
          </button>
          <h2 className="modal-header">
            Send Message
          </h2>

          <div className="message-headline">
            <div className="message-to">
              <div><span className="message-label">To:</span> </div>
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
                      onClick={() => handleRemoveRecipient(user.id)}
                      title="Remove user"
                    >
                      ×
                    </div>
                  </div>
                ))}
              </div>
              <MdContentCopy 
                size={20} 
                className="copy-recipients"
                onClick={handleCopyRecipients}
                title="Copy emails"
              />
            </div>
            <div>
              <span className="message-label">Subject:</span>
              <input 
                className="message-subject" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}>
              </input>
            </div>
          </div>

          <textarea 
            className="message-body"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            rows={11}
          />
          <div className="message-send">
            <button className="button" onClick={handleOpenOutlook}>Send in Outlook</button>
          </div>
        </div>
        <Toaster position="bottom-center" />
      </div>
  );
};

export default MessageModal;
