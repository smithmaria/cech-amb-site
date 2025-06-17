import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const uploadProfilePicture = async (file, userId) => {
  try {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File too large. Please select an image under 5MB.');
    }

    const minDimensions = await validateImageDimensions(file, 100, 100); // 100x100 minimum
    if (!minDimensions.valid) {
      throw new Error(minDimensions.error);
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `profile-pictures/${userId}/${fileName}`);

    const snapshot = await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      url: downloadURL,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const deleteProfilePicture = async (filePath) => {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    return { success: false, error: error.message };
  }
};

const validateImageDimensions = (file, minWidth = 100, minHeight = 100) => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      
      if (img.width < minWidth || img.height < minHeight) {
        resolve({
          valid: false,
          error: `Image too small. Please use an image that's at least ${minWidth}x${minHeight} pixels.`
        });
      } else {
        resolve({ valid: true });
      }
    };
    
    img.onerror = () => {
      resolve({
        valid: false,
        error: 'Invalid image file. Please try a different image.'
      });
    };
    
    img.src = URL.createObjectURL(file);
  });
};
