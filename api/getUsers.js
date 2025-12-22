import { adminAuth } from './firebaseAdmin';

export default async function getUsers(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        // Verifica o token de autenticação do usuário que está fazendo a chamada.
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Acesso não autorizado: Token não fornecido.' });
        }
        
        const decodedToken = await adminAuth.verifyIdToken(token);
        const uid = decodedToken.uid;
        
        // Verifica se o usuário que fez a requisição é um administrador.
        const userRecord = await adminAuth.getUser(uid);
        const userRoles = userRecord.customClaims?.roles || [];

        if (!userRoles.includes('admin')) {
            return res.status(403).json({ error: 'Acesso negado: Requer privilégios de administrador.' });
        }

        // Se for admin, lista todos os usuários.
        const listUsersResult = await adminAuth.listUsers(1000); // Limite de 1000 por página
        
        // Mapeia os dados para um formato mais limpo para o frontend.
        const users = listUsersResult.users.map(user => ({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            disabled: user.disabled,
            // Adiciona as roles customizadas, se existirem
            roles: user.customClaims?.roles || [] 
        }));

        return res.status(200).json(users);

    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        return res.status(500).json({ error: 'Falha ao buscar usuários no servidor.' });
    }
}
