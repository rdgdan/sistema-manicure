import { adminAuth } from './firebaseAdmin';

export default async function updateUser(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Acesso não autorizado: Token não fornecido.' });
        }

        const decodedToken = await adminAuth.verifyIdToken(token);
        const requestingUid = decodedToken.uid;

        const requestingUserRecord = await adminAuth.getUser(requestingUid);
        const requestingUserRoles = requestingUserRecord.customClaims?.roles || [];

        if (!requestingUserRoles.includes('admin')) {
            return res.status(403).json({ error: 'Acesso negado: Requer privilégios de administrador.' });
        }

        const { uid, roles } = req.body;
        if (!uid || !roles) {
            return res.status(400).json({ error: 'UID do usuário e roles são obrigatórios.' });
        }

        // Define as "custom claims" (regras customizadas) do usuário-alvo.
        await adminAuth.setCustomUserClaims(uid, { roles });

        return res.status(200).json({ message: `As regras do usuário ${uid} foram atualizadas com sucesso.` });

    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        return res.status(500).json({ error: 'Falha ao atualizar usuário no servidor.' });
    }
}
