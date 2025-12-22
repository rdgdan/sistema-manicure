import admin from 'firebase-admin';

// --- INICIALIZAÇÃO DO FIREBASE ADMIN SDK ---
// Esta é a forma correta para ambientes como a Vercel.
// Ele automaticamente usa as variáveis de ambiente configuradas na plataforma.
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

    const { uid, role } = req.body;

    if (!uid || !role) {
        return res.status(400).json({ error: 'UID e role são obrigatórios.' });
    }

    // Opcional: Verificar o token do usuário que está fazendo a chamada para garantir que ele é um admin
    // const idToken = req.headers.authorization?.split('Bearer ')[1];
    // if (!idToken) { ... }
    // const decodedToken = await admin.auth().verifyIdToken(idToken);
    // if (decodedToken.role !== 'admin') { ... }

    try {
        // Atualiza a custom claim 'role' do usuário
        await admin.auth().setCustomUserClaims(uid, { role });

        // Opcional: Atualizar também no Firestore, se você mantiver os dados lá
        // const userDocRef = admin.firestore().collection('users').doc(uid);
        // await userDocRef.update({ role });

        res.status(200).json({ success: true, message: `Usuário ${uid} agora tem a role ${role}.` });

    } catch (error) {
        console.error('Erro ao atualizar custom claims:', error);
        res.status(500).json({ error: 'Falha ao definir a role do usuário.', details: error.message });
    }
}
