import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ManageUsersPage = () => {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        if (!currentUser) {
            setError("Autenticação necessária para acessar esta página.");
            setLoading(false);
            return;
        }

        try {
            const idToken = await currentUser.getIdToken(true); // Pega o token atualizado

            const response = await fetch('/api/getUsers', {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao buscar usuários.');
            }

            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Apenas busca usuários se o currentUser estiver definido
        if (currentUser) {
            fetchUsers();
        }
    }, [currentUser]);

    const handleToggleAdmin = async (uid, isAdmin) => {
        try {
            const idToken = await currentUser.getIdToken(true);
            const response = await fetch('/api/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({ uid, isAdmin: !isAdmin }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao atualizar usuário.');
            }
            fetchUsers(); // Recarrega a lista após a mudança
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteUser = async (uid) => {
        if (window.confirm('Tem certeza que deseja deletar este usuário? Esta ação é irreversível.')) {
            try {
                const idToken = await currentUser.getIdToken(true);
                const response = await fetch('/api/deleteUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({ uid }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Falha ao deletar usuário.');
                }
                fetchUsers(); // Recarrega a lista após deletar
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) {
        return <div className="container mx-auto p-4">Carregando usuários...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4 text-red-500">Erro: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gerenciar Usuários</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Nome</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Admin</th>
                            <th className="py-2 px-4 border-b">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.uid}>
                                <td className="py-2 px-4 border-b">{user.displayName || 'N/A'}</td>
                                <td className="py-2 px-4 border-b">{user.email}</td>
                                <td className="py-2 px-4 border-b">{user.isAdmin ? 'Sim' : 'Não'}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleToggleAdmin(user.uid, user.isAdmin)}
                                        className={`mr-2 px-4 py-2 rounded ${user.isAdmin ? 'bg-yellow-500' : 'bg-green-500'} text-white`}
                                    >
                                        {user.isAdmin ? 'Rebaixar' : 'Promover'}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(user.uid)}
                                        className="px-4 py-2 rounded bg-red-500 text-white"
                                    >
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsersPage;
