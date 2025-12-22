import { adminDb } from './firebaseAdmin.js';

export default async function handler(req, res) {
  // Apenas o método GET é permitido
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: 'UID do usuário é obrigatório' });
  }

  try {
    // 1. Verifica se o usuário solicitante é um administrador
    const userProfileRef = adminDb.collection('users').doc(uid);
    const userProfileSnap = await userProfileRef.get();

    if (!userProfileSnap.exists || !userProfileSnap.data().isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Requer privilégios de administrador.' });
    }

    // 2. Se for administrador, busca todos os usuários do Firestore
    const usersCollection = adminDb.collection('users');
    const usersSnapshot = await usersCollection.get();
    
    if (usersSnapshot.empty) {
      return res.status(200).json([]);
    }

    const usersList = usersSnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(usersList);

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ error: 'Falha ao buscar usuários', details: error.message });
  }
}
