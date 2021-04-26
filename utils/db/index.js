import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: "plora-xyz.appspot.com"
    });
  } catch (error) {
    console.log('Firebase admin initialization error', error.stack);
  }
}

const firestore = admin.firestore()
const bucket = admin.storage().bucket()

export {
    firestore,
    bucket
}