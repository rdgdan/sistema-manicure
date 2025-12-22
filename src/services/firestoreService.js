import { getAuth, onAuthStateChanged, getIdToken as getFirebaseAuthIdToken } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteDoc } from "firebase/firestore";

// --- Funções de Autenticação e Token ---

const auth = getAuth();
const db = getFirestore();

export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

export const getIdToken = async () => {
    if (!auth.currentUser) {
        throw new Error("Usuário não autenticado.");
    }
    return await getFirebaseAuthIdToken(auth.currentUser);
};

// --- Funções de API (Admin) ---

// Busca TODOS os usuários (requer privilégios de admin na API)
export const getAllUsers = async () => {
    const token = await getIdToken();
    const response = await fetch('/api/getUsers', { // Supondo que você criará este endpoint
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Falha ao buscar usuários');
    }
    return response.json();
};

// Atualiza os detalhes de um usuário específico (requer privilégios de admin na API)
export const updateUserDetails = async (uid, dataToUpdate) => {
    const token = await getIdToken();
    const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uid, ...dataToUpdate })
    });

    if (!response.ok) {
        // Lê o corpo da resposta como texto para evitar erros de JSON
        const errorBody = await response.text();
        let errorMessage = `Status: ${response.status}.`;
        try {
            // Tenta interpretar o corpo como JSON para uma mensagem de erro mais específica
            const errorJson = JSON.parse(errorBody);
            errorMessage = errorJson.error || errorJson.details || errorBody;
        } catch (e) {
            // Se não for JSON, usa o corpo do erro como está (pode ser um log de erro do servidor)
            errorMessage = errorBody || `Status Text: ${response.statusText}`;
        }
        throw new Error(`Falha ao atualizar usuário. Detalhes: ${errorMessage}`);
    }

    try {
        return await response.json();
    } catch {
        return { success: true };
    }
};

// Deleta um usuário (requer privilégios de admin na API)
export const deleteUser = async (uid) => {
    const token = await getIdToken();
    const response = await fetch('/api/deleteUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ uid })
    });
    if (!response.ok) {
        throw new Error('Falha ao deletar usuário');
    }
    return response.json();
};

// --- Funções de Perfil de Usuário (Padrão) ---

export const getUserProfile = async (uid) => {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        return { uid: userDoc.id, ...userDoc.data() };
    } else {
        return null; // Ou lançar um erro, dependendo da sua lógica
    }
};

export const createUserProfile = async (uid, userData) => {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, userData);
};
