import React, { createContext, useState, useEffect, useContext, useMemo, useRef } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

export const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [schedules, setSchedules] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [users, setUsers] = useState([]); // Estado para usuários
  const [loading, setLoading] = useState(true);
  
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (!currentUser) {
      setSchedules([]);
      setClients([]);
      setServices([]);
      setServiceCategories([]);
      setUsers([]); // Limpa usuários no logout
      setLoading(true);
      initialLoadDone.current = false;
      return;
    }

    setLoading(true);
    initialLoadDone.current = false;
    
    const collectionsToLoad = {
      schedules: { setter: setSchedules, isPrivate: true },
      clients: { setter: setClients, isPrivate: true },
      services: { setter: setServices, isPrivate: false },
      service_categories: { setter: setServiceCategories, isPrivate: false },
      users: { setter: setUsers, isPrivate: false }, // Adiciona a coleção de usuários
    };
    const collectionNames = Object.keys(collectionsToLoad);
    const loadedCollections = new Set();

    const unsubs = Object.entries(collectionsToLoad).map(([name, config]) => {
      let q;
      if (config.isPrivate) {
        q = query(collection(db, name), where("userId", "==", currentUser.uid));
      } else {
        q = collection(db, name);
      }

      return onSnapshot(q, 
        (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          config.setter(data);

          if (!initialLoadDone.current) {
            loadedCollections.add(name);
            if (loadedCollections.size === collectionNames.length) {
              setLoading(false);
              initialLoadDone.current = true;
            }
          }
        },
        (error) => {
          console.error(`[DataContext] Erro no listener de ${name}:`, error);
          if (!initialLoadDone.current) {
            loadedCollections.add(name);
            if (loadedCollections.size === collectionNames.length) {
              setLoading(false);
              initialLoadDone.current = true;
            }
          }
        }
      );
    });

    return () => { 
      unsubs.forEach(unsub => unsub());
    };
  }, [currentUser]);

  const enrichedSchedules = useMemo(() => {
    if (loading || !clients.length) return [];
    
    const clientsMap = new Map(clients.map(c => [c.id, c]));

    return schedules
      .map(schedule => {
        const client = clientsMap.get(schedule.clientId);
        
        const start = schedule.start instanceof Timestamp ? schedule.start.toDate() : schedule.start;
        const end = schedule.end instanceof Timestamp ? schedule.end.toDate() : schedule.end;

        if (!(start instanceof Date && !isNaN(start)) || !(end instanceof Date && !isNaN(end))) {
          return null; 
        }

        return {
          ...schedule,
          start,
          end,
          clientName: client ? client.name : 'Cliente Excluído',
          clientPhone: client ? client.phone : '-',
        };
      })
      .filter(Boolean);

  }, [schedules, clients, loading]);

  const addClient = (data) => addDoc(collection(db, 'clients'), { ...data, createdAt: serverTimestamp(), userId: currentUser.uid });
  const updateClient = (id, data) => updateDoc(doc(db, 'clients', id), data);
  const deleteClient = (id) => deleteDoc(doc(db, 'clients', id));

  const addService = (data) => addDoc(collection(db, 'services'), data);
  const updateService = (id, data) => updateDoc(doc(db, 'services', id), data);
  const deleteService = (id) => deleteDoc(doc(db, 'services', id));
  
  const addServiceCategory = async (categoryName) => {
    const docRef = await addDoc(collection(db, 'service_categories'), { name: categoryName });
    return docRef.id;
  };

  const deleteSchedule = (id) => deleteDoc(doc(db, 'schedules', id));

  const handleScheduleSave = async (scheduleData) => {
    try {
      if (!currentUser) throw new Error("Usuário não autenticado.");
      let finalScheduleData = { ...scheduleData, userId: currentUser.uid };
      const scheduleId = finalScheduleData.id;
      
      if (finalScheduleData.isNewClient) {
        const newClientRef = await addDoc(collection(db, 'clients'), {
          name: finalScheduleData.clientName,
          phone: finalScheduleData.clientPhone,
          createdAt: serverTimestamp(),
          userId: currentUser.uid,
        });
        finalScheduleData.clientId = newClientRef.id;
      }

      delete finalScheduleData.isNewClient;
      delete finalScheduleData.clientName;
      delete finalScheduleData.clientPhone;
      delete finalScheduleData.id;

      if (scheduleId) {
        await updateDoc(doc(db, 'schedules', scheduleId), finalScheduleData);
      } else {
        await addDoc(collection(db, 'schedules'), finalScheduleData);
      }
      return true;
    } catch (error) {
      console.error("Erro ao salvar o agendamento:", error);
      return false;
    }
  };
  
  const addSchedule = (data) => handleScheduleSave(data);
  const updateSchedule = (id, data) => handleScheduleSave({ ...data, id });

  // Função para atualizar dados de um usuário (ex: role)
  const updateUser = (id, data) => updateDoc(doc(db, 'users', id), data);

  const value = {
    schedules: enrichedSchedules,
    clients,
    services,
    serviceCategories,
    users, // Exporta os usuários
    loading,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    addClient, 
    updateClient, 
    deleteClient,
    addService,   
    updateService,
    deleteService,
    addServiceCategory,
    updateUser, // Exporta a função de update
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};