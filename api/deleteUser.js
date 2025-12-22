import { admin, adminDb } from './firebaseAdmin.js';

export default async function handler(req, res) {
  // Permitir apenas o método DELETE
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { adminUid, targetUid } = req.body;

  // Validação dos parâmetros
  if (!adminUid || !targetUid) {
    return res.status(400).json({ error: 'adminUid e targetUid são obrigatórios.' });
  }

  try {
    // 1. Verificar se o solicitante (adminUid) é realmente um administrador
    const adminProfileRef = adminDb.collection('users').doc(adminUid);
    const adminProfileSnap = await adminProfileRef.get();

    if (!adminProfileSnap.exists() || !adminProfileSnap.data().isAdmin) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem deletar usuários.' });
    }

    // 2. Deletar o usuário do Firebase Authentication
    await admin.auth().deleteUser(targetUid);

    // 3. Deletar o perfil do usuário do Firestore
    const targetUserRef = adminDb.collection('users').doc(targetUid);
    await targetUserRef.delete();

    return res.status(200).json({ message: `Usuário ${targetUid} deletado com sucesso.` });

  } catch (error) {
    console.error(`Erro ao deletar usuário ${targetUid}:`, error);

    // Tratar erro caso o usuário não seja encontrado na autenticação
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ error: 'Usuário não encontrado no Firebase Authentication.' });
    }

    return res.status(500).json({ error: 'Falha ao deletar usuário', details: error.message });
  }
}
