
import admin from 'firebase-admin';

const initializeAdmin = () => {
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
};

export default async function handler(req, res) {
  initializeAdmin();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // Correção: Verifica se o array de 'roles' inclui 'admin'
    if (!decodedToken.roles?.includes('admin')) {
      return res.status(403).json({ error: 'Forbidden: User is not an admin.' });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
  }

  const { uid, ...dataToUpdate } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'User UID is required.' });
  }

  try {
    // Prepara os dados para o serviço de Autenticação
    const authUpdatePayload = {};
    if (dataToUpdate.email) authUpdatePayload.email = dataToUpdate.email;
    if (dataToUpdate.displayName) authUpdatePayload.displayName = dataToUpdate.displayName;
    if (dataToUpdate.disabled !== undefined) authUpdatePayload.disabled = dataToUpdate.disabled;

    // Atualiza no Authentication
    if (Object.keys(authUpdatePayload).length > 0) {
        await admin.auth().updateUser(uid, authUpdatePayload);
    }
    
    // Define as permissões personalizadas (custom claims)
    if (dataToUpdate.roles) {
        await admin.auth().setCustomUserClaims(uid, { roles: dataToUpdate.roles });
    }

    // Atualiza o documento no Firestore
    await admin.firestore().collection('users').doc(uid).update(dataToUpdate);

    return res.status(200).json({ success: true, message: 'User updated successfully.' });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.status(500).json({ error: 'Failed to update user.' });
  }
}
