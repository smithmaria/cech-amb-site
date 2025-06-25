const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {getAuth} = require("firebase-admin/auth");
const {getFirestore} = require("firebase-admin/firestore");

require('dotenv').config();

const userCollection = process.env.USERS_COLLECTION || "users";

exports.deleteUsers = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Must be authenticated");
  }

  const userDoc = await getFirestore().collection(userCollection).doc(request.auth.uid).get();
  if (!userDoc.exists || !userDoc.data().isAdmin) {
    throw new HttpsError("permission-denied", "Must be an admin");
  }

  const {userIds} = request.data;

  if(!userIds || !Array.isArray(userIds)) {
    throw new HttpsError("invalid-argument", "userIds must be an array");
  }

  if (userIds.includes(request.auth.id)) {
    throw new HttpsError("invalid-argument", "You cannot delete your own account");
  }

  try {
    const auth = getAuth();
    const firestore = getFirestore();

    const authDeletePromises = userIds.map(async (userId) => {
      try {
        await auth.deleteUser(userId);
      } catch (error) {
        console.log(`Failed to delete auth user ${userId}:`, error.message);
      }
    });

    const firestoreDeletePromises = userIds.map(async (userId) => {
      try {
        await firestore.collection(userCollection).doc(userId).delete();
      } catch (error) {
        console.log(`Failed to delete firestore user ${userId}:`, error.message);
      }
    });

    await Promise.all([...authDeletePromises, ...firestoreDeletePromises]);

    return {success: true, deletedCount: userIds.length};
  } catch (error) {
    console.error("Error deleting users:", error);
    throw new HttpsError("internal", "Failed to delete users");
  }
});
