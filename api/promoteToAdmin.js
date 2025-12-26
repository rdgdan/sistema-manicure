
import { adminAuth } from './firebaseAdmin.js';

export default async function handler(req, res) {
  // 1. Validação de Segurança Essencial
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método não permitido.' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'O e-mail é obrigatório.' });
  }

  // 2. Medida de Segurança Adicional:
  // Só permite a promoção se o e-mail corresponder ao que está na variável de ambiente.
  // Isso evita que a API seja usada para promover qualquer e-mail.
  const pendingAdminEmail = process.env.VITE_PENDING_ADMIN_EMAIL;
  if (!pendingAdminEmail || email !== pendingAdminEmail) {
    console.warn(`Tentativa de promoção de admin para um e-mail não autorizado: ${email}`);
    return res.status(403).json({ success: false, error: 'Ação não autorizada.' });
  }

  try {
    // 3. Encontra o usuário pelo e-mail
    const userRecord = await adminAuth.getUserByEmail(email);
    const { uid } = userRecord;

    // 4. Define a permissão de administrador (custom claim)
    await adminAuth.setCustomUserClaims(uid, { admin: true });

    // Log no servidor para auditoria
    console.log(`SUCESSO: Permissão de Admin concedida para o e-mail: ${email} (UID: ${uid})`);

    return res.status(200).json({ 
      success: true,
      message: `Permissão de administrador concedida para ${email}.`
    });

  } catch (error) {
    console.error(`ERRO AO PROMOVER ADMIN para ${email}:`, error);
    // Trata o caso de usuário não encontrado
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado.' });
    }
    return res.status(500).json({ success: false, error: 'Erro interno do servidor ao promover administrador.', details: error.message });
  }
}
