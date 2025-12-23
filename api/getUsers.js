import { adminAuth } from './firebaseAdmin.js';

export default async function handler(req, res) {
  // --- INÍCIO DO CÓDIGO DE DEBUG ---
  console.log("--- Verificando Variáveis de Ambiente na Vercel ---");
  console.log("FIREBASE_PROJECT_ID existe?", !!process.env.FIREBASE_PROJECT_ID);
  console.log("FIREBASE_CLIENT_EMAIL existe?", !!process.env.FIREBASE_CLIENT_EMAIL);
  console.log("FIREBASE_PRIVATE_KEY existe?", !!process.env.FIREBASE_PRIVATE_KEY);
  if (process.env.FIREBASE_PRIVATE_KEY) {
    console.log("FIREBASE_PRIVATE_KEY começa com '-----BEGIN'?", process.env.FIREBASE_PRIVATE_KEY.startsWith('-----BEGIN'));
  }
  console.log("---------------------------------------------------");
  // --- FIM DO CÓDIGO DE DEBUG ---

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    if (decodedToken.admin !== true) {
      return res.status(403).json({ error: 'Forbidden: User is not an admin' });
    }

    const listUsersResult = await adminAuth.listUsers(1000);
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      isAdmin: !!userRecord.customClaims?.admin,
    }));

    return res.status(200).json(users);
  } catch (error) {
    console.error('Error in /api/getUsers:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
