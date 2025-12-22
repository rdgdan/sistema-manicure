
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase'; // Importa o googleProvider
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup, // Importa a função para login com popup
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    createUserProfile,
    getUserProfile as getUserProfileFromFirestore,
    updateUserDetails // Corrigido: Trocado updateUserRoles por updateUserDetails
} from '../services/firestoreService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Este e-mail é o seu super administrador.
    // Considere movê-lo para as variáveis de ambiente do seu projeto (.env) para mais segurança.
    const ADMIN_EMAIL = "teste@gmail.com";

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true); // Começa o carregamento ao detectar mudança de usuário
            if (user) {
                const userDoc = await getUserProfileFromFirestore(user.uid);
                let profileData;

                if (userDoc.exists) {
                    // Perfil já existe, apenas carrega.
                    profileData = { ...userDoc.data(), id: user.uid };
                    // Garante que o admin designado tenha sempre a role de admin.
                    if (user.email === ADMIN_EMAIL && !profileData.roles?.includes('admin')) {
                        // Corrigido: Usa a nova função updateUserDetails
                        await updateUserDetails(user.uid, { roles: ['admin'] });
                        profileData.roles = ['admin']; // Atualiza o perfil localmente
                    }
                } else {
                    // NOVO USUÁRIO: Perfil não existe, então o criamos.
                    // Funciona para E-mail/Senha e para Google Sign-In.
                    const initialRoles = user.email === ADMIN_EMAIL ? ['admin'] : []; // Simplificado: admin é admin, resto começa sem role
                    const newProfile = {
                        email: user.email,
                        displayName: user.displayName || user.email.split('@')[0], // Nome do Google ou parte do e-mail
                        photoURL: user.photoURL || '', // Foto do Google ou vazio
                        roles: initialRoles,
                        createdAt: new Date() // Adiciona data de criação
                    };
                    await createUserProfile(user.uid, newProfile);
                    profileData = { ...newProfile, id: user.uid };
                }
                setUserProfile(profileData);
                setCurrentUser(user);
            } else {
                // Usuário deslogado.
                setUserProfile(null);
                setCurrentUser(null);
            }
            setLoading(false); // Finaliza o carregamento
        });

        return unsubscribe;
    }, []);

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // NOVA FUNÇÃO: Login com Google
    const signInWithGoogle = () => {
        return signInWithPopup(auth, googleProvider);
    };

    const logout = () => {
        return signOut(auth);
    };

    const hasRole = (role) => {
        return userProfile?.roles?.includes(role) ?? false;
    };

    const value = {
        currentUser,
        userProfile,
        loading,
        signup,
        login,
        logout,
        signInWithGoogle, // Expõe a nova função
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
