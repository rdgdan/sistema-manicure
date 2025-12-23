import { adminAuth } from './firebaseAdmin.js';

export default async function handler(req, res) {
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
