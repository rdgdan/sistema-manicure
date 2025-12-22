import { db, auth } from '../firebase.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, where, query, setDoc, getDoc } from 'firebase/firestore';

// --- Collections ---
const schedulesCollection = collection(db, 'schedules');
const servicesCollection = collection(db, 'services');
const clientsCollection = collection(db, 'clients');
const usersCollection = collection(db, 'users');

// --- Helper para obter o token de autenticação ---
const getIdToken = async () => {
    if (!auth.currentUser) {
        throw new Error("Nenhum usuário autenticado encontrado. Por favor, faça login novamente.");
    }
    // Força a atualização do token para garantir que não está expirado
    return await auth.currentUser.getIdToken(true);
}

// --- Funções de Perfil de Usuário e Permissões (Admin) ---

// Lista todos os usuários para a página de admin
export const getAllUsers = async () => {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// CHAMA O BACKEND SEGURO para deletar uma conta de usuário (Auth e Firestore)
export const deleteUserAccount = async (uid) => {
    const token = await getIdToken();
    const response = await fetch('/api/deleteUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uid })
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || 'Falha ao deletar o usuário.');
    }
    return result;
};

// CHAMA O BACKEND SEGURO para atualizar os detalhes de um usuário (Auth e Firestore)
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

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || 'Falha ao atualizar o usuário.');
    }
    return result;
};

// --- Funções de Perfil de Usuário (Padrão) ---

export const createUserProfile = (userId, profileData) => {
    const userDocRef = doc(db, 'users', userId);
    return setDoc(userDocRef, {
        ...profileData,
        createdAt: Timestamp.now()
    });
};

export const getUserProfile = (userId) => {
    const userDocRef = doc(db, 'users', userId);
    return getDoc(userDocRef);
}


// --- Funções de Agendamento (Schedules) --- //
export const getSchedules = async (userId) => {
    const q = query(schedulesCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), start: doc.data().start?.toDate(), end: doc.data().end?.toDate() }));
};

export const addSchedule = (schedule) => addDoc(schedulesCollection, { ...schedule, start: Timestamp.fromDate(new Date(schedule.start)), end: Timestamp.fromDate(new Date(schedule.end)) });
export const updateSchedule = (id, schedule) => updateDoc(doc(db, 'schedules', id), { ...schedule, ...(schedule.start && { start: Timestamp.fromDate(new Date(schedule.start)) }), ...(schedule.end && { end: Timestamp.fromDate(new Date(schedule.end)) }) });
export const deleteSchedule = (id) => deleteDoc(doc(db, 'schedules', id));

// --- Funções de Serviços (Services) --- //
export const getServices = async (userId) => {
    const q = query(servicesCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addService = (service) => addDoc(servicesCollection, { ...service, createdAt: Timestamp.now() });
export const updateService = (id, serviceData) => updateDoc(doc(db, 'services', id), serviceData);
export const deleteService = (id) => deleteDoc(doc(db, 'services', id));

// --- Funções de Clientes (Clients) --- //
export const getClients = async (userId) => {
    const q = query(clientsCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addClient = (client) => addDoc(clientsCollection, { ...client, createdAt: Timestamp.now() });
export const updateClient = (id, clientData) => updateDoc(doc(db, 'clients', id), clientData);
export const deleteClient = (id) => deleteDoc(doc(db, 'clients', id));

// --- FUNÇÃO DE MIGRAÇÃO DE DADOS (CORRIGIDA) ---
export const migrateDataToUser = async (userId) => {
    if (!userId) throw new Error("UserID é necessário para a migração.");

    const migrateCollection = async (coll, type) => {
        const q = query(coll, where("userId", "==", null)); // Migra apenas docs sem userId
        const snapshot = await getDocs(q);
        const promises = [];
        snapshot.forEach(document => {
            const docRef = doc(db, type, document.id);
            promises.push(updateDoc(docRef, { userId: userId }));
        });
        await Promise.all(promises);
        return snapshot.size;
    };

    const migratedClients = await migrateCollection(clientsCollection, 'clients');
    const migratedServices = await migrateCollection(servicesCollection, 'services');

    return { migratedClients, migratedServices };
};
