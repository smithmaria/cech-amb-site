import ProfileIcon from "./ProfileIcon";

const MiniContactItem = ({size}) => {
  if (size === "small") {
    return (
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
    );
  }
}