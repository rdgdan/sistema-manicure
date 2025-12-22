import admin from 'firebase-admin';

// --- INICIALIZAÇÃO DO FIREBASE ADMIN SDK ---
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { uid } = req.body;

    if (!uid) {
        return res.status(400).json({ error: 'UID do usuário é obrigatório.' });
    }

    // Opcional: Validação do token do chamador (admin)

    try {
        await admin.auth().deleteUser(uid);
        // Se você também armazena usuários no Firestore, delete-os de lá também.
        // await admin.firestore().collection('users').doc(uid).delete();

        res.status(200).json({ success: true, message: `Usuário ${uid} foi deletado com sucesso.` });

    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Falha ao deletar o usuário.', details: error.message });
    }
}
