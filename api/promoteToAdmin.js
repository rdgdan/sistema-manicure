Fizimport { adminAuth } from './firebaseAdmin.js';

export default async function handler(req, res) {
  // Apenas permite requisições POST para segurança básica
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Pega o email do corpo da requisição
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'O email é obrigatório.' });
  }

  try {
    // Encontra o usuário pelo email no Firebase Authentication
    const user = await adminAuth.getUserByEmail(email);

    // Define a permissão customizada 'admin' como verdadeira para este usuário
    await adminAuth.setCustomUserClaims(user.uid, { admin: true });

    // Responde com sucesso
    return res.status(200).json({ message: `Sucesso! O usuário ${email} agora é um administrador.` });

  } catch (error) {
    console.error('Erro ao tentar promover usuário a admin:', error);
    return res.status(500).json({ error: 'Falha ao tornar o usuário um administrador.', details: error.message });
  }
}
