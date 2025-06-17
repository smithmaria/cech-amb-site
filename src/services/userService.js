import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';

const USERS_COLLECTION = import.meta.env.VITE_USERS_COLLECTION || 'users';

export const createUserAccount = async (formData, accountType) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      formData.email, 
      formData.password
    );
    
    const user = userCredential.user;

    let userData = {
      email: formData.email.trim(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      profilePictureURL: formData.profilePictureURL || null,
      profilePicturePath: formData.profilePicturePath || null,
      position: formData.position.trim() || null,
      isApproved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (accountType === 'admin') {
      userData = {
        ...userData,
        isAdmin: true,
        isMember: false
      }
    }

    if (accountType === 'member') {
      userData = {
        ...userData,
        isMember: true,
        isExec: formData.isExec,
        isAdmin: formData.isExec ? true : false,
        generalMajor: formData.generalMajor,
        specificMajors: formData.specificMajors.filter(major => major.trim()),
        minor: formData.minor.trim() || null,
        gradYear: formData.gradYear,
        orgs: formData.orgs.trim() || null,
        experience: formData.experience.trim(),
        certs: formData.certs.trim()
      };
    }

    // Save to Firestore using the user's UID as document ID
    await setDoc(doc(db, USERS_COLLECTION, user.uid), userData);
    
    console.log('User created successfully:', userData);
    return { success: true, user: userData };
    
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
};

// Optional: Create a separate function to update user data
export const updateUserData = async (uid, updateData) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      ...updateData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message };
  }
};

export const approveUser = async (userId, adminUid) => {
  try {
    const adminDoc = await getDoc(doc(db, USERS_COLLECTION, adminUid));
    if (!adminDoc.exists() || !adminDoc.data().isAdmin) {
      throw new Error('Unauthorized: Only admins can approve users');
    }

    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      isApproved: true
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error approving user:', error);
    return { success: false, error: error.message };
  }
};

export const getPendingUsers = async () => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION
), 
      where('isApproved', '==', false)
    );
    const querySnapshot = await getDocs(q);
    const pendingUsers = [];
    
    querySnapshot.forEach((doc) => {
      pendingUsers.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, users: pendingUsers };
  } catch (error) {
    console.error('Error fetching pending users:', error);
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('User logged out successfully');
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, error: error.message };
  }
};
