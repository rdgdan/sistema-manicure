import { adminDb } from './firebaseAdmin.js';

export default async function handler(req, res) {
  // Apenas o método POST é permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { adminUid, targetUid, isAdmin } = req.body;

  // Validação básica
  if (!adminUid || !targetUid || typeof isAdmin !== 'boolean') {
    return res.status(400).json({ error: 'Parâmetros inválidos. É necessário adminUid, targetUid e isAdmin.' });
  }

  try {
    // 1. Verifica se o usuário que faz a requisição é administrador
    const adminProfileRef = adminDb.collection('users').doc(adminUid);
    const adminProfileSnap = await adminProfileRef.get();

    if (!adminProfileSnap.exists || !adminProfileSnap.data().isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Requer privilégios de administrador.' });
    }

    // 2. Atualiza o perfil do usuário alvo no Firestore
    const targetUserRef = adminDb.collection('users').doc(targetUid);
    await targetUserRef.update({ isAdmin });

    return res.status(200).json({ message: `O usuário ${targetUid} foi atualizado com sucesso.` });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ error: 'Falha ao atualizar permissões do usuário', details: error.message });
  }
}
