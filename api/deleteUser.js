import { adminAuth } from './firebaseAdmin';

export default async function deleteUser(req, res) {
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

        const { uid } = req.body;
        if (!uid) {
            return res.status(400).json({ error: 'UID do usuário é obrigatório.' });
        }

        // Deleta o usuário.
        await adminAuth.deleteUser(uid);

        return res.status(200).json({ message: `Usuário ${uid} deletado com sucesso.` });

    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        return res.status(500).json({ error: 'Falha ao deletar usuário no servidor.' });
    }
}
