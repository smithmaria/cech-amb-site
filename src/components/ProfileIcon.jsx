import React from 'react';
import { MdPerson } from 'react-icons/md';

const ProfileIcon = ({ 
  src, 
  alt = "Profile picture", 
  size = "medium", 
  showBorder = true,
  onClick,
  className = ""
}) => {
  const sizeClasses = {
    small: "profile-icon-small",
    medium: "profile-icon-medium", 
    large: "profile-icon-large",
    xlarge: "profile-icon-xlarge"
  };

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div 
      className={`profile-icon ${sizeClasses[size]} ${showBorder ? 'with-border' : ''} ${onClick ? 'clickable' : ''} ${className}`}
      onClick={handleClick}
    >
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="profile-icon-placeholder">
          <MdPerson />
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;