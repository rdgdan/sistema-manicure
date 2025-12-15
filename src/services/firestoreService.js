import {
  collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, where, writeBatch
} from "firebase/firestore";
import { db } from "../firebase";

const schedulesCollection = collection(db, "schedules");
const clientsCollection = collection(db, "clients");
const serviceCategoriesCollection = collection(db, "service_categories");

// --- HIERARQUIA DE SERVIÇOS ---

let categoriesPromise = null;

const fetchAndPopulateCategories = async () => {
  const snapshot = await getDocs(serviceCategoriesCollection);

  if (!snapshot.empty) {
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return categories.sort((a, b) => a.name.localeCompare(b.name));
  }

  console.log("Categorias de serviço não encontradas. Populando com dados iniciais...");
  const batch = writeBatch(db);
  const initialCategories = [
    { name: "Acrílico", subclasses: ["Aplicação", "Manutenção"] },
    { name: "Fibra de Vidro", subclasses: ["Aplicação", "Manutenção", "Remoção"] },
    { name: "Gel", subclasses: ["Aplicação em Gel na Tip", "Banho de Gel", "Esmaltação em Gel"] },
    { name: "Serviços Gerais", subclasses: ["Plástica dos Pés", "Spa dos Pés", "Manicure Simples"] },
  ];

  initialCategories.forEach(category => {
    const docRef = doc(serviceCategoriesCollection);
    batch.set(docRef, category);
  });

  await batch.commit();
  console.log("Categorias iniciais populadas com sucesso.");

  return initialCategories.sort((a, b) => a.name.localeCompare(b.name));
};

export const getServiceCategories = () => {
  if (!categoriesPromise) {
    categoriesPromise = fetchAndPopulateCategories();
  }
  return categoriesPromise;
};

// --- CLIENTES ---

const findOrCreateClient = async (name, phone) => {
  if (!phone) throw new Error("O número de telefone é obrigatório para identificar ou criar um cliente.");

  const q = query(clientsCollection, where("phone", "==", phone));
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  } else {
    const clientData = {
      name,
      phone,
      since: new Date().toISOString().split('T')[0],
    };
    const docRef = await addDoc(clientsCollection, clientData);
    return docRef.id;
  }
};

/**
 * Adiciona um novo cliente, utilizando a lógica que previne duplicatas pelo telefone.
 * Esta função é exportada para ser usada pela página de Clientes.
 * @param {object} clientData - Objeto contendo { name, phone }.
 * @returns {Promise<string>} O ID do cliente (novo ou existente).
 */
export const addClient = async (clientData) => {
    const { name, phone } = clientData;
    return await findOrCreateClient(name, phone);
};

export const getClients = async () => {
  const snapshot = await getDocs(clientsCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateClient = async (clientId, updatedData) => {
  await updateDoc(doc(db, "clients", clientId), updatedData);
};

export const deleteClient = async (clientId) => {
  await deleteDoc(doc(db, "clients", clientId));
};

// --- AGENDAMENTOS ---

export const getSchedules = async () => {
  const snapshot = await getDocs(schedulesCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addSchedule = async (scheduleData) => {
  const { clientName, clientPhone, price, ...restOfSchedule } = scheduleData;
  const clientId = await findOrCreateClient(clientName, clientPhone);

  const finalScheduleData = {
    ...restOfSchedule,
    clientName,
    clientPhone,
    price: parseFloat(price) || 0,
    clientId: clientId,
  };

  const docRef = await addDoc(schedulesCollection, finalScheduleData);
  return docRef.id;
};

export const deleteSchedule = async (scheduleId) => {
  await deleteDoc(doc(db, "schedules", scheduleId));
};

export const updateSchedule = async (scheduleId, updatedData) => {
  const { clientName, clientPhone, price, ...restOfSchedule } = updatedData;
  const clientId = await findOrCreateClient(clientName, clientPhone);

  const finalScheduleData = {
      ...restOfSchedule,
      clientName,
      clientPhone,
      price: parseFloat(price) || 0,
      clientId: clientId,
  };

  await updateDoc(doc(db, "schedules", scheduleId), finalScheduleData);
};