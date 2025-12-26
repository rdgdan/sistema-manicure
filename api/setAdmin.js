const admin = require("firebase-admin");

// Garante que a inicialização do app admin do Firebase só ocorra uma vez
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error("Falha ao inicializar o Firebase Admin SDK:", error);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  // IMPORTANTE: Verificação de segurança COMENTADA TEMPORARIAMENTE
  // para permitir a criação do primeiro administrador.
  /*
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autorização ausente ou mal formatado.' });
  }
  
  const idToken = authorization.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    if (decodedToken.admin !== true) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem executar esta ação.' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.', details: error.message });
  }
  */

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'O campo \'email\' é obrigatório.' });
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`Sucesso! O usuário ${email} (${user.uid}) agora é um administrador.`);
    
    await admin.auth().revokeRefreshTokens(user.uid);
    
    return res.status(200).json({ message: `Sucesso! O usuário ${email} agora é um administrador.` });
  } catch (error) {
    console.error("Erro ao tentar definir a claim de admin:", error);
    return res.status(500).json({ error: 'Erro ao processar a solicitação.', details: error.code });
  }
}
