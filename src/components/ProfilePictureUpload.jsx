import React, { useRef, useState } from 'react';
import { MdCameraAlt, MdDelete, MdPerson } from 'react-icons/md';

const ProfilePictureUpload = ({ 
  profilePicture, 
  profilePictureURL, 
  onImageSelect, 
  onImageRemove,
  disabled = false 
}) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (file) => {
    if (file) {
      // Create preview URL
      const previewURL = URL.createObjectURL(file);
      onImageSelect(file, previewURL);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (!disabled) {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleFileSelect(file);
      }
    }
  };

  const triggerFileInput = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    if (!disabled) {
      resetFileInput();
      onImageRemove();
    }
  };

  return (
    <div className="profile-picture-upload">
      <label>Profile Picture</label>
      
      <div 
        className={`upload-area ${dragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        {profilePictureURL ? (
          <div>
            <div className="image-overlay">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileInput();
                }}
                className="change-btn"
                disabled={disabled}
              >
                <MdCameraAlt size={20} />
                Change
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="remove-btn"
                disabled={disabled}
              >
                <MdDelete size={20} />
                Remove
              </button>
            </div>
            <div className="image-preview">
              <img src={profilePictureURL} alt="Profile preview" />
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <MdPerson size={60} />
            <p>Click to upload or drag and drop</p>
            <span>PNG, JPG, GIF, WebP up to 5MB</span>
            <span className="size-hint">Minimum 100x100 pixels recommended</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />
    </div>
  );
};

export default ProfilePictureUpload;
