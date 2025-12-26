import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged, 
    updateProfile, 
    sendPasswordResetEmail
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const SUPER_ADMIN_EMAIL = 'admin@gmail.com';

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    // Função para criar/atualizar o documento do usuário no Firestore
    const updateUserDocument = async (user) => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLogin: new Date().toISOString(),
        };

        // Mantém o status de admin se já existir, para não sobrescrever
        if (userDoc.exists() && userDoc.data().isAdmin) {
            userData.isAdmin = true;
        }

        await setDoc(userDocRef, userData, { merge: true });
        return userData; // Retorna os dados do usuário atualizados
    };

    // Função para atualizar os dados do usuário (usada pelo Admin)
    const adminUpdateUser = async (uid, data) => {
        const userDocRef = doc(db, 'users', uid);
        // O ideal seria chamar um backend seguro para atualizar o e-mail no Firebase Auth.
        // Por simplicidade, estamos atualizando apenas o documento do Firestore.
        // Nota: Isso não muda o e-mail de login do usuário.
        await updateDoc(userDocRef, data);
    };

    // Função para enviar e-mail de redefinição de senha
    const sendAdminPasswordResetEmail = (email) => {
        return sendPasswordResetEmail(auth, email);
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Atualiza o documento do usuário no Firestore a cada login
                const appUser = await updateUserDocument(user);

                // Lógica do Super Admin
                if (user.email === SUPER_ADMIN_EMAIL) {
                    const userDocRef = doc(db, 'users', user.uid);
                    await setDoc(userDocRef, { isAdmin: true }, { merge: true });
                    setIsAdmin(true);
                } else {
                    setIsAdmin(appUser.isAdmin || false);
                }
                
                setCurrentUser(user);

            } else {
                setCurrentUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Modificada para aceitar displayName
    const signup = async (displayName, email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Atualiza o perfil do Firebase Auth com o nome
        await updateProfile(userCredential.user, { displayName });
        // Cria o documento no Firestore
        await updateUserDocument(userCredential.user);
        return userCredential;
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        // Garante que o documento do usuário seja criado/atualizado no Firestore
        await updateUserDocument(result.user);
        return result;
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        currentUser,
        loading,
        isAdmin,
        signup,
        login,
        logout,
        signInWithGoogle,
        adminUpdateUser, // Nova função exportada
        sendAdminPasswordResetEmail, // Nova função exportada
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};