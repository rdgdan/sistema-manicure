
// Importa o SDK Admin do Firebase
import admin from 'firebase-admin';

// Helper para inicializar o Admin SDK de forma segura, garantindo que aconteça apenas uma vez.
const initializeAdmin = () => {
  // A chave da conta de serviço é passada como uma string JSON através de uma variável de ambiente.
  // Este é o passo manual que você fará no deploy.
  if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
};

// A função principal que será executada pela Vercel/Netlify
export default async function handler(req, res) {
  // Garante que o SDK Admin esteja inicializado
  initializeAdmin();

  // 1. VERIFICAÇÃO DE MÉTODO: Aceita apenas requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. VERIFICAÇÃO DE SEGURANÇA: Garante que o chamador é um admin autenticado
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken.admin !== true) {
      return res.status(403).json({ error: 'Forbidden: User is not an admin.' });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
  }

  // 3. LÓGICA PRINCIPAL: Executa a exclusão do usuário
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'User UID is required.' });
  }

  try {
    // Exclui do Authentication
    await admin.auth().deleteUser(uid);

    // Exclui do Firestore para manter a consistência
    await admin.firestore().collection('users').doc(uid).delete();

    return res.status(200).json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'User not found.' });
    }
    // Retorna um erro genérico para outros casos
    return res.status(500).json({ error: 'Failed to delete user.' });
  }
}
